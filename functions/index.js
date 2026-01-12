const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const functions = require("firebase-functions"); // v1 para scheduled functions
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");
const { GoogleGenerativeAI } = require("@google/generative-ai");

initializeApp();

// ============================================
// HELPER FUNCTION: Send Notification
// ============================================
async function sendNotification(userId, title, body, data = {}) {
    try {
        const userDoc = await getFirestore().collection("users").doc(userId).get();
        if (!userDoc.exists) {
            console.log(`User ${userId} not found`);
            return;
        }

        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken) {
            console.log(`No FCM Token found for user ${userId}`);
            return;
        }

        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: fcmToken,
            data: data,
            android: {
                priority: "high",
                notification: {
                    channelId: "carwash_notifications",
                    priority: "high",
                    sound: "default",
                    defaultSound: true,
                    defaultVibrateTimings: true
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: "default",
                        badge: 1
                    }
                }
            }
        };

        const response = await getMessaging().send(message);
        console.log(`✅ Notification sent to ${userId}:`, response);
    } catch (error) {
        console.error(`❌ Error sending notification to ${userId}:`, error);
    }
}

// ============================================
// 1. NEW ORDER CREATED - Notify Admins Only
// ============================================
exports.onNewOrderCreated = onDocumentCreated({
    document: "orders/{orderId}",
    database: "(default)",
    region: "us-central1"
}, async (event) => {
    const orderData = event.data.data();
    const orderId = event.params.orderId;

    console.log(`🆕 New order created: ${orderId}`);

    // Extract city from address
    let city = "location";
    if (orderData.address) {
        const parts = orderData.address.split(',');
        if (parts.length > 1) {
            city = parts[1].trim();
        }
    }

    const price = orderData.price || 0;

    // Get all Admins and Washers to notify
    const usersSnapshot = await getFirestore()
        .collection("users")
        .where("role", "in", ["admin", "washer"])
        .get();

    console.log(`Found ${usersSnapshot.size} potential recipients (Admins/Washers)`);

    const notifications = [];
    usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Skip if no FCM token
        if (!userData.fcmToken) return;

        notifications.push(
            sendNotification(
                userId,
                "New Order Available",
                `New order in ${city} - $${price}`,
                {
                    type: "new_order",
                    orderId: orderId,
                    screen: userData.role === 'admin' ? "ADMIN_DASHBOARD" : "WASHER_JOB_DETAILS",
                    targetRole: userData.role,
                    targetUserId: userId
                }
            )
        );
    });

    if (notifications.length > 0) {
        await Promise.all(notifications);
        console.log(`✅ Notified ${notifications.length} users (Admins/Washers) about new order ${orderId}`);
    } else {
        console.log(`⚠️ No notifications sent (0 recipients with FCM tokens)`);
    }

    return null;
});


// ============================================
// 2. ORDER STATUS UPDATED - Notify Client
// ============================================
exports.onOrderStatusUpdated = onDocumentUpdated({
    document: "orders/{orderId}",
    database: "(default)"
}, async (event) => {
    const change = event.data;
    if (!change) return null;

    const newData = change.after.data();
    const oldData = change.before.data();

    // Check if status changed
    if (newData.status === oldData.status) {
        return null;
    }

    const orderId = event.params.orderId;
    const clientId = newData.clientId;
    const washerId = newData.washerId;

    console.log(`📝 Order ${orderId} status: ${oldData.status} → ${newData.status}`);

    let notificationTitle = "";
    let notificationBody = "";
    let targetUserId = "";

    // Notify CLIENT about status changes
    if (newData.status === "Assigned" && (oldData.status === "Pending" || oldData.status === "New")) {
        // Notify CLIENT
        notificationTitle = "Washer Assigned";
        notificationBody = `${newData.washerName || 'A washer'} has been assigned to your order.`;
        targetUserId = clientId;
        const clientTargetRole = 'client';

        // ALSO Notify WASHER that they got assigned
        if (washerId) {
            await sendNotification(
                washerId,
                "New Order Assigned",
                `You have been assigned the order of ${newData.clientName || 'a client'} at ${newData.address || 'location'}`,
                { type: "order_assigned", orderId: orderId, screen: "WASHER_JOBS", targetUserId: washerId, targetRole: 'washer' }
            );
        }
    }
    else if (newData.status === "En Route") {
        notificationTitle = "Washer En Route";
        notificationBody = `${newData.washerName || 'Your washer'} is on the way.`;
        targetUserId = clientId;
    }
    else if (newData.status === "Arrived") {
        notificationTitle = "Washer Arrived";
        notificationBody = `${newData.washerName || 'The washer'} has arrived at your location.`;
        targetUserId = clientId;
    }
    else if (newData.status === "Washing") {
        notificationTitle = "Wash Started";
        notificationBody = "Your vehicle is being washed now.";
        targetUserId = clientId;
    }
    else if (newData.status === "Completed") {
        notificationTitle = "Order Complete";
        notificationBody = "Your wash is complete. Please rate the service.";
        targetUserId = clientId;
    }
    else if (newData.status === "Cancelled") {
        // Notify washer ONLY if order was actively in progress or assigned
        // status check: active statuses where washer should know
        const manufacturingStatuses = ["Pending", "New", "Draft"];
        if (washerId && !manufacturingStatuses.includes(oldData.status)) {
            await sendNotification(
                washerId,
                "Job Cancelled",
                `Order #${orderId.substring(0, 8)} was cancelled by the client.`,
                { type: "order_cancelled", orderId: orderId, screen: "WASHER_JOBS", targetUserId: washerId, targetRole: 'washer' }
            );
        } else {
            console.log(`   ⏭️ Skipping WASHER notification (washerId: ${washerId}, oldStatus: ${oldData.status})`);
        }

        // Always notify Admin about cancellation
        const adminsSnapshot = await getFirestore()
            .collection("users")
            .where("role", "==", "admin")
            .get();

        console.log(`   📢 Sending ADMIN notifications to ${adminsSnapshot.size} admin(s)`);
        adminsSnapshot.forEach((adminDoc) => {
            console.log(`      → Admin ID: ${adminDoc.id}`);
            sendNotification(
                adminDoc.id,
                "Order Cancelled",
                `Order #${orderId} was cancelled by client.`,
                { type: "order_cancelled", orderId: orderId, screen: "ADMIN_ORDERS", targetUserId: adminDoc.id, targetRole: 'admin' }
            );
        });

        // Notify client (confirmation)
        notificationTitle = "Order Cancelled";
        notificationBody = "Your order has been cancelled successfully.";
        targetUserId = clientId;
        console.log(`   📱 Will send CLIENT notification to: ${clientId}`);
    }

    // Send notification
    if (targetUserId && notificationTitle) {
        console.log(`📤 Sending notification "${notificationTitle}" to user: ${targetUserId}`);
        await sendNotification(
            targetUserId,
            notificationTitle,
            notificationBody,
            { type: "order_update", orderId: orderId, screen: "CLIENT_TRACKING", targetUserId: targetUserId, targetRole: 'client' }
        );
    }

    return null;
});

// ============================================
// 3. NEW ISSUE REPORTED - Notify Admins
// ============================================
exports.onNewIssueReported = onDocumentCreated({
    document: "issues/{issueId}",
    database: "(default)"
}, async (event) => {
    const issueData = event.data.data();
    const issueId = event.params.issueId;

    console.log(`🐛 New issue reported: ${issueId}`);

    // Get all admins
    const adminsSnapshot = await getFirestore()
        .collection("users")
        .where("role", "==", "admin")
        .get();

    // Send notification to each admin
    const notifications = [];
    adminsSnapshot.forEach((adminDoc) => {
        const adminId = adminDoc.id;
        notifications.push(
            sendNotification(
                adminId,
                "🐛 New Issue Reported",
                `${issueData.userName || 'A user'} reported: ${issueData.description?.substring(0, 50) || 'an issue'}`,
                {
                    type: "new_issue",
                    issueId: issueId,
                    screen: "ADMIN_DASHBOARD",
                    targetUserId: adminId,
                    targetRole: 'admin'
                }
            )
        );
    });

    await Promise.all(notifications);
    console.log(`✅ Notified ${adminsSnapshot.size} admins about new issue ${issueId}`);
    return null;
});

// ============================================
// 4. NEW WASHER APPLICATION - Notify Admins
// ============================================
exports.onNewWasherApplication = onDocumentCreated({
    document: "washer_applications/{applicationId}",
    database: "(default)"
}, async (event) => {
    const applicationData = event.data.data();
    const applicationId = event.params.applicationId;

    console.log(`👤 New washer application: ${applicationId}`);

    // Get all admins
    const adminsSnapshot = await getFirestore()
        .collection("users")
        .where("role", "==", "admin")
        .get();

    // Send notification to each admin
    const notifications = [];
    adminsSnapshot.forEach((adminDoc) => {
        const adminId = adminDoc.id;
        notifications.push(
            sendNotification(
                adminId,
                "👤 New Washer Application",
                `${applicationData.name || 'Someone'} applied to be a washer`,
                {
                    type: "new_washer_application",
                    applicationId: applicationId,
                    screen: "ADMIN_TEAM",
                    targetUserId: adminId,
                    targetRole: 'admin'
                }
            )
        );
    });

    await Promise.all(notifications);
    console.log(`✅ Notified ${adminsSnapshot.size} admins about new application ${applicationId}`);
    return null;
});

// ============================================
// 5. NEW MESSAGE - Notify Recipient
// ============================================
exports.onNewMessage = onDocumentCreated({
    document: "messages/{messageId}",
    database: "(default)"
}, async (event) => {
    const messageData = event.data.data();
    const messageId = event.params.messageId;

    console.log(`💬 New message: ${messageId}`);

    const senderId = messageData.senderId;
    const recipientId = messageData.recipientId;
    const orderId = messageData.orderId;

    if (!recipientId) {
        console.log("No recipient specified");
        return null;
    }

    // Get sender info
    const senderDoc = await getFirestore().collection("users").doc(senderId).get();
    const senderName = senderDoc.exists ? (senderDoc.data().name || "Someone") : "Someone";

    // Send notification to recipient
    await sendNotification(
        recipientId,
        `💬 ${senderName}`,
        messageData.text?.substring(0, 100) || "New message",
        {
            type: "new_message",
            orderId: orderId || "",
            senderId: senderId,
            screen: "CHAT",
            targetUserId: recipientId
        }
    );

    console.log(`✅ Notified ${recipientId} about new message from ${senderName}`);
    return null;
});

// ============================================
// 6. WASHER APPLICATION APPROVED - Notify Applicant
// ============================================
exports.onWasherApproved = onDocumentCreated({
    document: "approved_washers/{email}",
    database: "(default)"
}, async (event) => {
    const approvalData = event.data.data();
    const email = event.params.email;

    console.log(`✅ Washer approved: ${email}`);

    // Try to find user by email
    const usersSnapshot = await getFirestore()
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

    if (!usersSnapshot.empty) {
        const userId = usersSnapshot.docs[0].id;
        await sendNotification(
            userId,
            "🎉 Application Approved!",
            "Congratulations! Your washer application has been approved. You can now accept jobs.",
            {
                type: "application_approved",
                screen: "WASHER_JOBS",
                targetUserId: userId,
                targetRole: 'washer'
            }
        );
        console.log(`✅ Notified ${userId} about approval`);
    }

    return null;
});

// ============================================
// 7. NEW SUPPORT MESSAGE - Notify Admins
// ============================================
exports.onNewSupportMessage = onDocumentCreated({
    document: "supportTickets/{ticketId}/messages/{messageId}",
    database: "(default)",
    region: "us-central1"
}, async (event) => {
    const messageData = event.data.data();
    const { ticketId } = event.params;

    console.log(`💬 New support message in ticket: ${ticketId}`);

    // Only notify for client or washer messages (ignore admin's own responses and system messages)
    if (messageData.senderRole === 'admin' || messageData.senderId === 'system') {
        console.log(`Skipping notification - sender is ${messageData.senderRole || messageData.senderId}`);
        return null;
    }

    try {
        // Get ticket info
        const ticketSnap = await getFirestore().collection('supportTickets').doc(ticketId).get();

        if (!ticketSnap.exists) {
            console.log(`Ticket ${ticketId} not found`);
            return null;
        }

        const ticketData = ticketSnap.data();
        const senderName = messageData.senderName || ticketData?.userName || 'User';
        const ticketSource = ticketData?.source || '';
        let messageBody = messageData.message || 'Sent a message';

        // Add source context to notification
        if (ticketSource) {
            messageBody = `[${ticketSource}] ${messageBody}`;
        }

        // Get all admins
        const adminsSnapshot = await getFirestore()
            .collection("users")
            .where("role", "==", "admin")
            .get();

        if (adminsSnapshot.empty) {
            console.log('No admin users found to notify');
            return null;
        }

        // Send notification to each admin
        const notifications = [];
        adminsSnapshot.forEach((adminDoc) => {
            notifications.push(
                sendNotification(
                    adminDoc.id,
                    `💬 ${senderName}`,
                    messageBody,
                    {
                        type: "support_message",
                        ticketId: ticketId,
                        screen: "ADMIN_SUPPORT",
                        targetUserId: adminDoc.id,
                        targetRole: 'admin'
                    }
                )
            );
        });

        await Promise.all(notifications);
        console.log(`✅ Notified ${adminsSnapshot.size} admins about support message from ${senderName}`);
        return null;

    } catch (error) {
        console.error('❌ Error sending support notification:', error);
        return null;
    }
});

// ============================================
// 8. WAITING TIME NOTIFICATIONS - HTTP Function (v2)
// ============================================
const { onRequest } = require("firebase-functions/v2/https");

exports.notifyWaitingTime = onRequest(
    {
        timeoutSeconds: 60,
        memory: "256MiB",
        region: "us-central1"
    },
    async (req, res) => {
        const db = getFirestore();
        const now = Date.now();

        try {
            const ordersSnapshot = await db.collection('orders')
                .where('status', '==', 'Arrived')
                .where('waitingForClient', '==', true)
                .where('clientAuthorized', '==', false)
                .get();

            console.log(`Found ${ordersSnapshot.size} orders with waiting washers`);

            for (const orderDoc of ordersSnapshot.docs) {
                const order = orderDoc.data();
                const waitingStartTime = order.waitingStartTime || order.arrivedAt || now;
                const waitingMinutes = Math.floor((now - waitingStartTime) / 60000);
                const currentBlock = Math.floor(waitingMinutes / 10);
                const previousBlock = order.waitingTimeBlocks || 0;

                const waitingNotificationsSent = order.waitingNotificationsSent || [];
                const lastNotification = waitingNotificationsSent.length > 0 ? waitingNotificationsSent[waitingNotificationsSent.length - 1] : 0;
                const minutesSinceLastNotification = Math.floor((now - lastNotification) / 60000);

                if (minutesSinceLastNotification >= 1 || waitingNotificationsSent.length === 0) {
                    let notificationMessage = '';
                    let notificationTitle = 'Washer Waiting';

                    if (waitingMinutes < 10) {
                        notificationMessage = `Your washer is waiting (${waitingMinutes} min). Please authorize the service. After 10 minutes, $10 will be charged for every additional 10 minutes.`;
                    } else {
                        const blocksCharged = currentBlock;
                        const currentCharge = blocksCharged * 10;
                        notificationMessage = `Your washer has been waiting ${waitingMinutes} minutes. Current waiting charge: $${currentCharge}. Please authorize the service now.`;
                        notificationTitle = '⚠️ Waiting Charges Apply';
                    }

                    if (order.clientId) {
                        try {
                            const clientDoc = await db.collection('users').doc(order.clientId).get();
                            const clientData = clientDoc.data();
                            const fcmToken = clientData ? clientData.fcmToken : null;

                            if (fcmToken) {
                                await getMessaging().send({
                                    token: fcmToken,
                                    notification: {
                                        title: notificationTitle,
                                        body: notificationMessage
                                    },
                                    data: {
                                        orderId: orderDoc.id,
                                        type: 'waiting_time',
                                        waitingMinutes: waitingMinutes.toString(),
                                        currentCharge: (currentBlock * 10).toString(),
                                        targetUserId: order.clientId,
                                        targetRole: 'client'
                                    },
                                    android: {
                                        priority: 'high',
                                        notification: {
                                            channelId: 'waiting_alerts',
                                            priority: 'high',
                                            sound: 'default'
                                        }
                                    }
                                });

                                console.log(`Sent notification to client ${order.clientId} for order ${orderDoc.id}`);
                            }
                        } catch (error) {
                            console.error(`Error sending notification for order ${orderDoc.id}:`, error);
                        }
                    }

                    await orderDoc.ref.update({
                        waitingNotificationsSent: admin.firestore.FieldValue.arrayUnion(now)
                    });
                }

                if (currentBlock > previousBlock) {
                    const chargePerBlock = order.waitingChargePerBlock || 10;
                    const totalCharge = currentBlock * chargePerBlock;

                    await orderDoc.ref.update({
                        waitingTimeBlocks: currentBlock,
                        waitingCharge: totalCharge
                    });

                    console.log(`Updated order ${orderDoc.id}: Block ${currentBlock}, Charge $${totalCharge}`);
                }
            }

            res.status(200).json({
                success: true,
                message: `Processed ${ordersSnapshot.size} waiting orders`,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error in notifyWaitingTime function:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
);

// ============================================
// 9. TEST NOTIFICATION - Manual trigger for debugging
// ============================================
exports.onTestNotificationCreated = onDocumentCreated({
    document: "test_notifications/{testId}",
    database: "(default)",
    region: "us-central1"
}, async (event) => {
    const data = event.data.data();
    const testId = event.params.testId;

    console.log(`🧪 Test notification trigger: ${testId} for user ${data.userId}`);

    if (data.userId) {
        await sendNotification(
            data.userId,
            data.title || "Test Notification 🔔",
            data.body || "This is a test notification.",
            { type: "test", testId: testId }
        );

        // Mark as sent
        await event.data.ref.update({ status: 'sent', sentAt: admin.firestore.FieldValue.serverTimestamp() });
    }

    return null;
});

// ============================================
// 10. AUTO-CANCEL APPOINTMENTS - Scheduled every 5 minutes
// ============================================
exports.checkAppointments = onSchedule({
    schedule: 'every 5 minutes',
    timeZone: 'America/Los_Angeles',
    memory: '256MiB'
}, async (event) => {
    const db = getFirestore();
    const now = new Date();
    const currentTimestamp = now.getTime();
    const bufferMinutes = 10; // 10 minute buffer

    try {
        // Find pending orders
        const ordersSnapshot = await db.collection('orders')
            .where('status', '==', 'Pending')
            .get();

        console.log(`Checking ${ordersSnapshot.size} pending orders for auto-cancellation...`);

        const cancellationPromises = [];

        for (const orderDoc of ordersSnapshot.docs) {
            const order = orderDoc.data();

            // Skip ASAP orders for auto-cancellation (only scheduled ones)
            if (order.date === 'ASAP' || order.time === 'ASAP') continue;
            if (order.washerId) continue;

            // Parse date (YYYY-MM-DD) and time (HH:mm)
            if (!order.date || !order.time) continue;

            const [year, month, day] = order.date.split('-').map(Number);
            const [hour, minute] = order.time.split(':').map(Number);

            if (!year || isNaN(hour)) {
                console.log(`⚠️ Invalid date/time format for order ${orderDoc.id}: ${order.date} ${order.time}`);
                continue;
            }

            // Scheduled time in local Date objects
            const scheduledTime = new Date(year, month - 1, day, hour, minute).getTime();

            // If expired (Current time > scheduled + buffer)
            if (currentTimestamp > (scheduledTime + bufferMinutes * 60000)) {
                console.log(`🚩 Order ${orderDoc.id} expired. Scheduled: ${order.date} ${order.time}. Cancelling...`);

                // 1. Update order status
                cancellationPromises.push(
                    orderDoc.ref.update({
                        status: 'Cancelled',
                        cancelReason: 'No washers available at the moment',
                        cancelledAt: admin.firestore.FieldValue.serverTimestamp()
                    })
                );

                // 2. Notify client
                if (order.clientId) {
                    cancellationPromises.push(
                        sendNotification(
                            order.clientId,
                            "Appointment Update",
                            "Sorry, no washers are available at the moment, please try to schedule again later",
                            {
                                type: "order_cancelled_auto",
                                orderId: orderDoc.id,
                                screen: "CLIENT_ORDERS",
                                targetUserId: order.clientId,
                                targetRole: 'client'
                            }
                        )
                    );
                }
            }
        }

        if (cancellationPromises.length > 0) {
            await Promise.all(cancellationPromises);
            console.log(`✅ Successfully handled ${cancellationPromises.length} cancellation actions.`);
        }

        return null;
    } catch (error) {
        console.error('Error in checkAppointments function:', error);
        return null;
    }
});

// ============================================
// 11. DAILY SEO UPDATE - Gemini AI Powered
// ============================================
exports.scheduledSeoUpdate = onSchedule({
    schedule: "0 0 * * *", // Every day at midnight
    timeZone: "America/Los_Angeles",
    memory: "256MiB",
    region: "us-central1"
}, async (event) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY not found in environment variables");
        return null;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
        You are a professional SEO expert for a premium mobile car wash and detailing business in Los Angeles.
        Generate a daily expert tip for car care that will attract local customers and improve SEO.
        
        The tip must be:
        1. Professional, helpful, and concise.
        2. Written in English.
        3. Focused on a specific topic (e.g., paint protection, interior cleaning, ceramic coating benefits, wheel care, etc.).
        4. Include relevant keywords for Los Angeles mobile car wash.
        
        Return the result EXACTLY in the following JSON format:
        {
            "title": "A catchy and SEO-optimized title",
            "content": "The expert advice in 2-3 short paragraphs",
            "keywords": ["keyword1", "keyword2", "keyword3"]
        }
    `;

    try {
        console.log("🤖 Requesting new SEO content from Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean and parse JSON
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonContent = JSON.parse(cleanedText);

        const db = getFirestore();
        await db.collection('seo_content').doc('daily_tip').set({
            ...jsonContent,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log("✅ Daily SEO tip updated successfully in Firestore");
    } catch (error) {
        console.error("❌ Error generating or saving SEO tip:", error);
    }

    return null;
});

// ============================================
// 12. SQUARE PAYMENT INTEGRATION
// ============================================

// Helper: Verify Auth Token
async function verifyAuth(req) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('⚠️ Missing or invalid authorization header');
            return null;
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        return { uid: decodedToken.uid, email: decodedToken.email || '' };
    } catch (error) {
        console.error('❌ Auth verification failed:', error);
        return null;
    }
}

// Helper: Rate Limiting
async function checkPaymentRateLimit(userId) {
    try {
        const db = getFirestore(); // Admin SDK
        const rateLimitRef = db.collection('rate_limits').doc(`${userId}_payment`);
        const rateLimitDoc = await rateLimitRef.get();
        const now = Date.now();
        const windowMs = 60 * 60 * 1000; // 1 hour
        const maxAttempts = 15;

        if (!rateLimitDoc.exists) {
            await rateLimitRef.set({
                count: 1,
                windowStart: admin.firestore.Timestamp.now(),
                lastAttempt: admin.firestore.Timestamp.now(),
                action: 'payment_attempt',
                userId
            });
            return { allowed: true };
        }

        const data = rateLimitDoc.data();
        const windowStartMs = data.windowStart.toMillis();
        const windowEndMs = windowStartMs + windowMs;

        if (now > windowEndMs) {
            await rateLimitRef.set({
                count: 1,
                windowStart: admin.firestore.Timestamp.now(),
                lastAttempt: admin.firestore.Timestamp.now(),
                action: 'payment_attempt',
                userId
            });
            return { allowed: true };
        }

        if (data.count >= maxAttempts) {
            const minutesUntilReset = Math.ceil((windowEndMs - now) / (60 * 1000));
            return { allowed: false, message: `Too many payment attempts. Try again in ${minutesUntilReset} minutes.` };
        }

        await rateLimitRef.update({
            count: admin.firestore.FieldValue.increment(1),
            lastAttempt: admin.firestore.Timestamp.now()
        });

        return { allowed: true };
    } catch (error) {
        console.error('Error checking rate limit:', error);
        return { allowed: true }; // Fail open
    }
}

exports.createSquarePayment = onRequest({
    memory: "256MiB",
    region: "us-central1"
}, async (req, res) => {
    // CORS
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        // 1. Auth
        const auth = await verifyAuth(req);
        if (!auth) {
            res.status(401).json({ error: 'Unauthorized', message: 'You must be logged in' });
            return;
        }

        // 2. Rate Limit
        const rateLimit = await checkPaymentRateLimit(auth.uid);
        if (!rateLimit.allowed) {
            res.status(429).json({ error: 'Too Many Requests', message: rateLimit.message });
            return;
        }

        // 3. Input Validation
        const data = req.body;
        if (!data.amount || !data.sourceId || !data.orderId) {
            res.status(400).json({ error: 'Invalid Input', message: 'Missing required fields' });
            return;
        }

        // 4. Order Verification
        const db = getFirestore();
        const orderRef = db.collection('orders').doc(data.orderId);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        if (orderDoc.data().clientId !== auth.uid) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        // 5. Square Init
        // Use try/catch for import as well
        let SquareClient;
        try {
            const squarePkg = require("square");
            SquareClient = squarePkg.SquareClient || squarePkg.Client;
        } catch (e) {
            console.error("Failed to require square:", e);
            throw new Error("Square SDK Error");
        }

        const client = new SquareClient({
            bearerAuthCredentials: {
                accessToken: process.env.SQUARE_ACCESS_TOKEN
            },
            environment: 'sandbox'
        });

        // 6. Create Payment
        // JSON.parse(JSON.stringify(...)) hack for BigInt if needed, but Square SDK handles BigInt
        const amountInCents = BigInt(Math.round(data.amount * 100));

        const { result } = await client.paymentsApi.createPayment({
            sourceId: data.sourceId,
            idempotencyKey: data.orderId, // Simple idempotency
            amountMoney: {
                amount: amountInCents,
                currency: 'USD'
            },
            locationId: process.env.SQUARE_LOCATION_ID,
            buyerEmailAddress: auth.email,
            note: `Order ${data.orderId}`
        });

        console.log(`✅ Payment created: ${result.payment.id}`);

        // Log to security
        await db.collection('security_logs').add({
            type: 'payment_created',
            userId: auth.uid,
            paymentId: result.payment.id,
            amount: data.amount,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        // Update Order Status to Paid? Or Client handles that?
        // Usually we update order here to avoid race conditions
        await orderRef.update({
            paymentStatus: 'paid',
            paymentId: result.payment.id,
            paymentMethod: 'square',
            paidAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Handle BigInt serialization for JSON response
        const responseData = {
            paymentId: result.payment.id,
            status: result.payment.status,
            amount: data.amount
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error('Payment Error:', error);

        // Handle BigInt serialization in error if needed by not sending raw error object
        let msg = 'Payment failed';
        if (error.errors && error.errors.length > 0) {
            msg = error.errors[0].detail || error.errors[0].category;
        } else if (error.message) {
            msg = error.message;
        }

        res.status(500).json({ error: 'Payment Failed', message: msg });
    }
});
// ============================================
// GOOGLE MAPS ROUTE PROXY
// ============================================
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const axios = require("axios");

exports.calculateRouteETA = onCall({ cors: true }, async (request) => {
    // Check authentication
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { originLat, originLon, destLat, destLon } = request.data;

    // Validate inputs
    if (!originLat || !originLon || !destLat || !destLon) {
        throw new HttpsError('invalid-argument', 'Missing origin or destination coordinates.');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error("❌ Google Maps API Key missing in environment");
        throw new HttpsError('failed-precondition', 'Server configuration error.');
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLon}&destination=${destLat},${destLon}&key=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK' && data.routes.length > 0) {
            const leg = data.routes[0].legs[0];
            return {
                duration: Math.ceil(leg.duration.value / 60), // minutes
                distance: leg.distance.value / 1000, // km
                status: 'OK'
            };
        } else {
            console.error("Google Maps API returned non-OK status:", data.status);
            return {
                status: 'ERROR',
                message: data.status || 'No route found'
            };
        }
    } catch (error) {
        console.error("❌ Error fetching route:", error);
        throw new HttpsError('internal', 'Failed to fetch directions.');
    }
});
