import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, Timestamp, arrayUnion, arrayRemove, getDoc, query, where, getDocs, runTransaction } from 'firebase/firestore';
import { Order, ServicePackage, ServiceAddon, TeamMember, ClientUser, Notification, NotificationType, Message, Discount, Deduction, Bonus, WasherPayment, IssueReport, PayrollPeriod, ServiceArea } from '../types';
import { calculateOrderFinancials } from '../utils/financialCalculations';

export const useFirestoreActions = () => {

    // Helper to get next sequence
    const getNextSequence = async (counterName: string, padding: number, prefix: string = '') => {
        const counterRef = doc(db, 'settings', 'counters');
        try {
            return await runTransaction(db, async (transaction) => {
                const counterDoc = await transaction.get(counterRef);
                let newIndex = 1;

                if (counterDoc.exists()) {
                    const data = counterDoc.data();
                    const currentIndex = data[counterName] || 0;
                    newIndex = currentIndex + 1;
                    transaction.set(counterRef, { [counterName]: newIndex }, { merge: true });
                } else {
                    transaction.set(counterRef, { [counterName]: 1 });
                }

                return prefix + newIndex.toString().padStart(padding, '0');
            });
        } catch (e) {
            console.error(`Error generating sequence for ${counterName}`, e);
            // Fallback to timestamp if transaction fails
            return `${prefix}${Date.now()}`;
        }
    };

    // --- ORDERS ---
    const createOrder = async (orderData: Partial<Order>) => {
        try {
            // VALIDACIONES DEFENSIVAS - Evitar crear órdenes con datos inválidos
            if (!orderData.clientId) {
                throw new Error('Client ID is required');
            }
            if (!orderData.address || orderData.address.trim() === '') {
                throw new Error('Address is required');
            }
            if (!orderData.vehicleConfigs || orderData.vehicleConfigs.length === 0) {
                throw new Error('At least one vehicle configuration is required');
            }
            if (typeof orderData.price !== 'number' || orderData.price <= 0) {
                throw new Error('Valid price is required');
            }

            // Use time-based random ID for Firestore Document, delaying sequential ID until assignment
            // User Request: "Don't waste an ID for unassigned cancellations"
            const docId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

            // Remove 'id' if present
            const { id, ...rest } = orderData;

            // Remove undefined fields
            const cleanData = Object.entries(rest).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as any);

            const docRef = doc(db, 'orders', docId);
            const orderWithStatus = {
                ...cleanData,
                id: docId, // Internal ID
                displayId: null, // No sequential ID yet
                createdAt: Timestamp.now(),
                status: 'Pending',
                date: cleanData.date || new Date().toISOString().split('T')[0]
            };
            console.log("🔥 CREATING ORDER (Unassigned):", docId);
            await setDoc(docRef, orderWithStatus);


            // Notify ALL Washers using broadcast system
            try {
                await addNotification(
                    'washer-broadcast', // Special ID that all washers listen to
                    'New Order Available! 🚿',
                    `New request at ${orderWithStatus.address}. Claim it now!`,
                    'success',
                    'WASHER_JOB_DETAILS',
                    docId
                );
            } catch (notifyError) {
                console.warn("⚠️ Failed to send notifications:", notifyError);
            }

            return docId;
        } catch (error) {
            console.error("❌ Error creating order:", error);
            throw error;
        }
    };

    const updateOrder = async (orderId: string, updates: Partial<Order>) => {
        try {
            const docRef = doc(db, 'orders', orderId);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    };

    const grabOrder = async (orderId: string, washerId: string, washerName: string, washerAvatar?: string) => {
        const orderRef = doc(db, 'orders', orderId);
        const counterRef = doc(db, 'settings', 'counters');

        try {
            return await runTransaction(db, async (transaction) => {
                const orderDoc = await transaction.get(orderRef);
                if (!orderDoc.exists()) {
                    throw new Error('Order not found');
                }
                const orderData = orderDoc.data() as Order;
                if (orderData.status !== 'Pending') {
                    throw new Error('Order already taken');
                }

                // Generate Sequential ID NOW (upon assignment)
                // This ensures we only "spend" an ID on valid jobs
                const counterDoc = await transaction.get(counterRef);
                let newIndex = 1;
                if (counterDoc.exists()) {
                    const data = counterDoc.data();
                    newIndex = (data['lastOrderIndex'] || 0) + 1;
                    transaction.set(counterRef, { 'lastOrderIndex': newIndex }, { merge: true });
                } else {
                    transaction.set(counterRef, { 'lastOrderIndex': 1 });
                }
                const newDisplayId = '#' + newIndex.toString().padStart(8, '0');

                transaction.update(orderRef, {
                    washerId,
                    washerName,
                    status: 'Assigned',
                    washerAvatar: washerAvatar || '',
                    displayId: newDisplayId // Assign the visible ID
                });
                return newDisplayId;
            });
        } catch (error) {
            console.error("Error grabbing order:", error);
            throw error;
        }
    };

    const submitOrderRating = async (orderId: string, ratingData: { clientRating: number, clientReview: string, tip: number, washerId: string }) => {
        try {
            console.log('🔍 submitOrderRating called with:', { orderId, ratingData });

            // Get the current order to access base price
            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);

            if (!orderSnap.exists()) {
                throw new Error('Order not found');
            }

            const orderData = orderSnap.data() as Order;
            const basePrice = orderData.basePrice || orderData.price || 0;

            // Get Global Fees from settings
            const settingsRef = doc(db, 'settings', 'fees');
            const settingsSnap = await getDoc(settingsRef);
            const globalFees = settingsSnap.exists() ? (settingsSnap.data().fees || []) : [];

            // Calculate final financial breakdown
            const financials = calculateOrderFinancials(
                { ...orderData, tip: ratingData.tip, basePrice },
                globalFees
            );

            // 1. Update Order with ONLY rating, review, tip
            const updateData = {
                rating: ratingData.clientRating,
                review: ratingData.clientReview,
                tip: ratingData.tip
            };

            await updateOrder(orderId, updateData);

            // 2. Aggregate Ratings for Washer
            if (ratingData.washerId) {
                try {
                    const q = query(
                        collection(db, 'orders'),
                        where('washerId', '==', ratingData.washerId),
                        where('status', '==', 'Completed')
                    );

                    const snapshot = await getDocs(q);
                    let totalRating = 0;
                    let count = 0;

                    snapshot.forEach(doc => {
                        const data = doc.data() as Order;
                        if (data.rating) {
                            totalRating += data.rating;
                            count++;
                        }
                    });

                    const average = count > 0 ? totalRating / count : ratingData.clientRating;

                    // 3. Update Washer Profile
                    const oneHourInMs = 60 * 60 * 1000;
                    const nextAvailableTime = Timestamp.fromMillis(Date.now() + oneHourInMs);

                    await updateDoc(doc(db, 'users', ratingData.washerId), {
                        rating: parseFloat(average.toFixed(1)),
                        status: 'Available',
                        nextAvailableTime: nextAvailableTime,
                        completedJobs: count
                    });
                } catch (washerUpdateError) {
                    console.warn('⚠️ Could not update washer profile (non-critical):', washerUpdateError);
                }
            }
        } catch (error) {
            console.error('❌ Error in submitOrderRating:', error);
            throw error;
        }
    };


    // --- PACKAGES (Using ID as doc key for stability) ---
    const savePackage = async (pkg: ServicePackage) => {
        try {
            const docRef = doc(db, 'packages', pkg.id);
            await setDoc(docRef, pkg, { merge: true });
        } catch (error) {
            console.error("Error saving package:", error);
            throw error;
        }
    };

    const deletePackage = async (packageId: string) => {
        try {
            await deleteDoc(doc(db, 'packages', packageId));
        } catch (error) {
            console.error("Error deleting package:", error);
            throw error;
        }
    };

    // --- ADDONS ---
    const saveAddon = async (addon: ServiceAddon) => {
        try {
            const docRef = doc(db, 'addons', addon.id);
            await setDoc(docRef, addon, { merge: true });
        } catch (error) {
            console.error("Error saving addon:", error);
            throw error;
        }
    };

    const deleteAddon = async (addonId: string) => {
        try {
            await deleteDoc(doc(db, 'addons', addonId));
        } catch (error) {
            console.error("Error deleting addon:", error);
            throw error;
        }
    };

    // --- USERS (Updates) ---
    const updateUserProfile = async (userId: string, updates: Partial<TeamMember | ClientUser>) => {
        try {
            const docRef = doc(db, 'users', userId);
            await setDoc(docRef, updates, { merge: true });
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            throw error;
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            const docRef = doc(db, 'users', userId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("❌ Error deleting user:", error);
            throw error;
        }
    };

    const addClient = async (clientData: ClientUser) => {
        try {
            const docRef = doc(db, 'users', clientData.id);
            const dataToSave = {
                ...clientData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };
            await setDoc(docRef, dataToSave, { merge: true });
        } catch (error) {
            console.error("❌ Error adding client to Firestore:", error);
            throw error;
        }
    };

    const saveVehicleType = async (typeData: any) => {
        try {
            const docRef = doc(db, 'vehicle_types', typeData.id || `vt_${Date.now()}`);
            await setDoc(docRef, typeData, { merge: true });
        } catch (error) {
            console.error("Error saving vehicle type:", error);
            throw error;
        }
    };

    const deleteVehicleType = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'vehicle_types', id));
        } catch (error) {
            console.error("Error deleting vehicle type:", error);
            throw error;
        }
    };

    // --- APPLICATIONS ---
    const submitWasherApplication = async (applicationData: Partial<TeamMember>) => {
        try {
            const newId = `app_${Date.now()}`;
            const docRef = doc(db, 'washer_applications', newId);
            const dataToSave = {
                ...applicationData,
                id: newId,
                role: 'washer',
                status: 'Applicant',
                joinedDate: new Date().toISOString(),
                completedJobs: 0,
                rating: 0
            };
            await setDoc(docRef, dataToSave);
            return newId;
        } catch (error) {
            console.error("Error submitting application:", error);
            throw error;
        }
    };

    const approveWasherApplication = async (appId: string, appData: any) => {
        try {
            const emailId = appData.email.toLowerCase();
            const approvedRef = doc(db, 'approved_washers', emailId);

            await setDoc(approvedRef, {
                ...appData,
                role: 'washer',
                status: 'Active',
                approvedAt: new Date().toISOString()
            });

            await deleteDoc(doc(db, 'washer_applications', appId));

            const NotificationService = await import('../services/NotificationService').then(m => m.NotificationService);
            await NotificationService.sendEmail(
                appData.email,
                '🎉 Welcome to the Team! Your Washer Application Has Been Approved',
                `Hi ${appData.name},\n\nGreat news! Your application to join our car wash team has been approved!\n\nYou can now log in to the Washer Panel using the same credentials you used when you applied:\n\nEmail: ${appData.email}\n\nSimply visit our app and log in. You'll automatically be directed to the Washer Dashboard where you can start accepting jobs.\n\nWelcome aboard!\n\nBest regards,\nThe Car Wash Team`
            );
        } catch (error) {
            console.error("Error approving washer application:", error);
            throw error;
        }
    };

    const rejectWasherApplication = async (appId: string) => {
        try {
            await deleteDoc(doc(db, 'washer_applications', appId));
        } catch (error) {
            console.error("Error rejecting washer application:", error);
            throw error;
        }
    };

    // --- GPS TRACKING ---
    const updateOrderLocation = async (orderId: string, location: { lat: number; lng: number }) => {
        try {
            const docRef = doc(db, 'orders', orderId);
            await updateDoc(docRef, {
                washerLocation: {
                    ...location,
                    lastUpdated: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error("Error updating GPS location:", error);
        }
    };

    // --- DISCOUNTS ---
    const createDiscount = async (discountData: Omit<Discount, 'id' | 'usageCount'>) => {
        try {
            const newId = `disc_${Date.now()}`;
            const docRef = doc(db, 'discounts', newId);
            await setDoc(docRef, {
                ...discountData,
                id: newId,
                usageCount: 0
            });
            return newId;
        } catch (error) {
            console.error("Error creating discount:", error);
            throw error;
        }
    };

    const updateDiscount = async (discountId: string, updates: Partial<Discount>) => {
        try {
            const docRef = doc(db, 'discounts', discountId);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Error updating discount:", error);
            throw error;
        }
    };

    const deleteDiscount = async (discountId: string) => {
        try {
            await deleteDoc(doc(db, 'discounts', discountId));
        } catch (error) {
            console.error("Error deleting discount:", error);
            throw error;
        }
    };

    const validateDiscount = async (code: string, orderTotal: number): Promise<Discount | null> => {
        try {
            const q = query(collection(db, 'discounts'), where('code', '==', code.toUpperCase()));
            const snapshot = await getDocs(q);

            if (snapshot.empty) return null;

            const discount = snapshot.docs[0].data() as Discount;

            if (!discount.active) return null;
            if (discount.validFrom && new Date(discount.validFrom) > new Date()) return null;
            if (discount.validUntil && new Date(discount.validUntil) < new Date()) return null;
            if (discount.usageLimit && discount.usageCount >= discount.usageLimit) return null;
            if (discount.minimumOrderAmount && orderTotal < discount.minimumOrderAmount) return null;

            return discount;
        } catch (error) {
            console.error("Error validating discount:", error);
            return null;
        }
    };

    const incrementDiscountUsage = async (discountId: string) => {
        try {
            const docRef = doc(db, 'discounts', discountId);
            const snapshot = await getDocs(query(collection(db, 'discounts'), where('id', '==', discountId)));
            if (!snapshot.empty) {
                const currentCount = snapshot.docs[0].data().usageCount || 0;
                await updateDoc(docRef, { usageCount: currentCount + 1 });
            }
        } catch (error) {
            console.error("Error incrementing discount usage:", error);
        }
    };

    // --- DEDUCTIONS ---
    const createDeduction = async (deductionData: Omit<Deduction, 'id' | 'status'>) => {
        try {
            const newId = `ded_${Date.now()}`;
            const docRef = doc(db, 'deductions', newId);
            await setDoc(docRef, {
                ...deductionData,
                id: newId,
                status: 'pending'
            });
            return newId;
        } catch (error) {
            console.error("Error creating deduction:", error);
            throw error;
        }
    };

    const updateDeduction = async (deductionId: string, updates: Partial<Deduction>) => {
        try {
            const docRef = doc(db, 'deductions', deductionId);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Error updating deduction:", error);
            throw error;
        }
    };

    const deleteDeduction = async (deductionId: string) => {
        try {
            await deleteDoc(doc(db, 'deductions', deductionId));
        } catch (error) {
            console.error("Error deleting deduction:", error);
            throw error;
        }
    };

    // --- BONUSES ---
    const createBonus = async (bonusData: Omit<Bonus, 'id' | 'status'>) => {
        try {
            const newId = `bon_${Date.now()}`;
            const docRef = doc(db, 'bonuses', newId);
            await setDoc(docRef, {
                ...bonusData,
                id: newId,
                status: 'pending'
            });
            return newId;
        } catch (error) {
            console.error("Error creating bonus:", error);
            throw error;
        }
    };

    const updateBonus = async (bonusId: string, updates: Partial<Bonus>) => {
        try {
            const docRef = doc(db, 'bonuses', bonusId);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Error updating bonus:", error);
            throw error;
        }
    };

    const deleteBonus = async (bonusId: string) => {
        try {
            await deleteDoc(doc(db, 'bonuses', bonusId));
        } catch (error) {
            console.error("Error deleting bonus:", error);
            throw error;
        }
    };

    // --- PAYMENTS ---
    const createPayment = async (paymentData: Omit<WasherPayment, 'id'>) => {
        try {
            const newId = `pay_${Date.now()}`;
            const docRef = doc(db, 'payments', newId);
            await setDoc(docRef, {
                ...paymentData,
                id: newId
            });
            return newId;
        } catch (error) {
            console.error("Error creating payment:", error);
            throw error;
        }
    };


    const cancelOrder = async (orderId: string, applyFeeInput: boolean = false) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            return await runTransaction(db, async (transaction) => {
                const orderSnap = await transaction.get(orderRef);
                if (!orderSnap.exists()) {
                    throw new Error("Order not found");
                }

                const orderData = orderSnap.data() as Order;
                console.log("🔍 CancelOrder Transaction - Data:", orderData);

                // Enforce fee if washer was assigned
                // User: "si ya la agarro el cliente cobras 10... dale los 10 dolares a el completes"
                const hasWasher = !!(orderData.washerId && orderData.washerId.trim() !== "");
                const isNotPending = orderData.status !== "Pending";
                const shouldChargeFee = hasWasher && isNotPending;

                console.log("🔍 CancelOrder - Logic:", { hasWasher, isNotPending, shouldChargeFee });

                const updateData: any = {
                    status: 'Cancelled',
                    updatedAt: Timestamp.now()
                };

                if (shouldChargeFee) {
                    updateData.price = 10;
                    updateData.cancellationFee = 10;
                    updateData.washerEarnings = 10; // 100% to washer
                    updateData.appRevenue = 0;
                    updateData.paymentStatus = 'Pending'; // Needs to be charged
                } else {
                    updateData.price = 0;
                    updateData.washerEarnings = 0;
                }

                console.log("🔥 Updating Order in Firestore:", orderId, updateData);
                transaction.update(orderRef, updateData);
                console.log(`✅ Transaction step for ${orderId} completed locally.`);

                // We'll handle notifications outside transaction or allow them to be slightly delayed
                return { orderData, shouldChargeFee };
            }).then(async ({ orderData, shouldChargeFee }) => {
                // Notifications
                if (orderData.washerId) {
                    await addNotification(
                        orderData.washerId,
                        'Order Cancelled ❌',
                        shouldChargeFee
                            ? `Order cancelled. You receive $10 cancellation fee.`
                            : `Order cancelled by client.`,
                        shouldChargeFee ? 'success' : 'error',
                        'WASHER_DASHBOARD',
                        orderId
                    );
                }

                if (orderData.clientId) {
                    await addNotification(
                        orderData.clientId,
                        'Order Cancelled',
                        shouldChargeFee
                            ? 'Order cancelled. A $10 fee applies as a washer was assigned.'
                            : 'Order cancelled successfully.',
                        'info',
                        'CLIENT_HOME',
                        orderId
                    );
                }
            });

        } catch (error) {
            console.error("Error cancelling order:", error);
            throw error;
        }
    };

    const testPushNotification = async (userId: string) => {
        try {
            const testRef = doc(collection(db, 'test_notifications'));
            await setDoc(testRef, {
                userId,
                title: 'Prueba de Notificación 🔔',
                body: 'Si ves esto, las notificaciones push están funcionando correctamente.',
                timestamp: Date.now(),
                status: 'pending'
            });
            console.log("Test notification triggered for user:", userId);
        } catch (error) {
            console.error("Error triggering test notification:", error);
            throw error;
        }
    };

    // --- PAYROLL PERIODS ---
    const createPayrollPeriod = async (periodData: Omit<PayrollPeriod, 'id'>) => {
        try {
            const newId = `period_${Date.now()}`;
            const docRef = doc(db, 'payroll_periods', newId);
            await setDoc(docRef, {
                ...periodData,
                id: newId
            });
            return newId;
        } catch (error) {
            console.error("Error creating payroll period:", error);
            throw error;
        }
    };

    const updatePayrollPeriod = async (periodId: string, updates: Partial<PayrollPeriod>) => {
        try {
            const docRef = doc(db, 'payroll_periods', periodId);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Error updating payroll period:", error);
            throw error;
        }
    };

    // --- ISSUES ---
    const createIssue = async (issueData: Omit<IssueReport, 'id' | 'timestamp' | 'status'>) => {
        try {
            // Remove undefined fields to avoid Firestore errors
            const cleanData: any = {
                clientId: issueData.clientId,
                clientEmail: issueData.clientEmail,
                subject: issueData.subject,
                description: issueData.description,
                timestamp: Date.now(),
                status: 'Open'
            };

            // Only add orderId if it exists and is not undefined
            if (issueData.orderId && issueData.orderId !== undefined) {
                cleanData.orderId = issueData.orderId;
            }

            // Only add image if it exists
            if (issueData.image) {
                cleanData.image = issueData.image;
            }

            await addDoc(collection(db, 'issues'), cleanData);
            return "success";
        } catch (error) {
            console.error("Error creating issue:", error);
            throw error;
        }
    };

    const updateIssue = async (id: string, updates: Partial<IssueReport>) => {
        try {
            const docRef = doc(db, 'issues', id);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Error updating issue:", error);
            throw error;
        }
    };

    // --- MESSAGES ---
    const sendMessage = async (senderId: string, receiverId: string, orderId: string, content: string, type: 'text' | 'image' = 'text') => {
        try {
            await addDoc(collection(db, 'messages'), {
                senderId,
                receiverId,
                orderId,
                content,
                type,
                timestamp: Date.now(),
                read: false
            });

            // Auto-generate notification for the receiver
            await addNotification(
                receiverId,
                'New Message',
                type === 'image' ? 'Sent you an image' : content.length > 50 ? `${content.substring(0, 47)}...` : content,
                'info',
                'CLIENT_HOME', // This is a general link, the client/washer will handle specialized opening
                orderId
            );

            return "success";
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    };

    // --- NOTIFICATIONS ---
    const addNotification = async (userId: string, title: string, message: string, type: NotificationType = 'info', linkTo?: any, relatedId?: string) => {
        try {
            // Filter out undefined fields to avoid Firestore "invalid data" error
            const notificationData: any = {
                userId,
                title,
                message,
                type,
                read: false,
                timestamp: Date.now()
            };

            if (linkTo !== undefined) notificationData.linkTo = linkTo;
            if (relatedId !== undefined) notificationData.relatedId = relatedId;

            await addDoc(collection(db, 'notifications'), notificationData);
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error;
        }
    };

    const markNotificationRead = async (id: string) => {
        try {
            const docRef = doc(db, 'notifications', id);
            await updateDoc(docRef, { read: true });
        } catch (error) {
            console.error("Error marking notification read:", error);
            throw error;
        }
    };

    return {
        createOrder, updateOrder, grabOrder, cancelOrder,
        savePackage, deletePackage,
        saveAddon, deleteAddon,
        updateUserProfile, deleteUser, addClient,
        saveVehicleType, deleteVehicleType,

        submitWasherApplication, approveWasherApplication, rejectWasherApplication,
        updateOrderLocation,
        // Payment system
        createDiscount, updateDiscount, deleteDiscount, validateDiscount, incrementDiscountUsage,
        createDeduction, updateDeduction, deleteDeduction,
        createBonus, updateBonus, deleteBonus,
        createPayment,
        createPayrollPeriod, updatePayrollPeriod,
        createIssue, updateIssue,
        sendMessage,
        addNotification, markNotificationRead,
        submitOrderRating,
        testPushNotification,
        saveServiceArea: async (area: ServiceArea) => {
            await setDoc(doc(db, 'settings', 'service_area'), area);
        }
    };
};
