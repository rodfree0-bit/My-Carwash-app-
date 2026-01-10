import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy, doc, limit, Timestamp } from 'firebase/firestore';
import { Order, ClientUser, TeamMember, ServicePackage, ServiceAddon, Notification, Discount, Deduction, Bonus, WasherPayment, PayrollPeriod, IssueReport, Message, ServiceArea } from '../types';

export const useFirestoreData = (user?: any, role?: string) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [clients, setClients] = useState<ClientUser[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [addons, setAddons] = useState<ServiceAddon[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [deductions, setDeductions] = useState<Deduction[]>([]);
    const [bonuses, setBonuses] = useState<Bonus[]>([]);
    const [payments, setPayments] = useState<WasherPayment[]>([]);
    const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([]);
    const [issues, setIssues] = useState<IssueReport[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [washerApplications, setWasherApplications] = useState<any[]>([]);
    const [serviceArea, setServiceArea] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [packagesError, setPackagesError] = useState<string | null>(null);

    // Filter times for pruning historical data
    const last3Months = useMemo(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 3);
        return d.toISOString().split('T')[0]; // For 'date' string field in orders
    }, []);

    const sLast7Days = useMemo(() => Date.now() - (7 * 24 * 60 * 60 * 1000), []);

    // 1. PUBLIC DATA (Fixed Configurations)
    useEffect(() => {
        try {
            const unsubPackages = onSnapshot(
                collection(db, 'packages'),
                (snapshot) => {
                    try {
                        const packagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServicePackage));
                        console.log('📦 FIRESTORE: Loaded packages:', packagesData.length, packagesData);
                        setPackages(packagesData);
                        setPackagesError(null);
                    } catch (error: any) {
                        console.error('❌ Error processing packages:', error);
                        setPackagesError(error.message || 'Error processing packages');
                        setPackages([]); // Fallback to empty array
                    }
                },
                (error) => {
                    console.error('❌ Error loading packages from Firestore:', error);
                    setPackagesError(error.message || 'Error loading packages from Firestore');
                    setPackages([]); // Fallback to empty array
                }
            );


            const unsubAddons = onSnapshot(
                collection(db, 'addons'),
                (snapshot) => {
                    try {
                        setAddons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceAddon)));
                    } catch (error) {
                        console.error('❌ Error processing addons:', error);
                        setAddons([]);
                    }
                },
                (error) => {
                    console.error('❌ Error loading addons:', error);
                    setAddons([]);
                }
            );

            const unsubVehicleTypes = onSnapshot(
                collection(db, 'vehicle_types'),
                (snapshot) => {
                    try {
                        setVehicleTypes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                    } catch (error) {
                        console.error('❌ Error processing vehicle types:', error);
                        setVehicleTypes([]);
                    }
                },
                (error) => {
                    console.error('❌ Error loading vehicle types:', error);
                    setVehicleTypes([]);
                }
            );

            const unsubServiceArea = onSnapshot(
                doc(db, 'settings', 'service_area'),
                (snapshot) => {
                    try {
                        if (snapshot.exists()) {
                            setServiceArea({ id: snapshot.id, ...snapshot.data() } as unknown as ServiceArea);
                        }
                    } catch (error) {
                        console.error('❌ Error processing service area:', error);
                    }
                },
                (error) => {
                    console.error('❌ Error loading service area:', error);
                }
            );



            return () => {
                unsubPackages();
                unsubAddons();
                unsubVehicleTypes();
                unsubServiceArea();

            };
        } catch (error) {
            console.error('❌ Critical error setting up Firestore listeners:', error);
            return () => { }; // Return empty cleanup function
        }
    }, []);

    // 2. ORDERS (Role-specific and Optimized)
    useEffect(() => {
        if (!user) {
            setOrders([]);
            return;
        }

        let q;
        if (role === 'washer') {
            q = query(collection(db, 'orders'), where('washerId', '==', user.uid), limit(50));
        } else if (role === 'client') {
            q = query(collection(db, 'orders'), where('clientId', '==', user.uid), limit(30));
        } else if (role === 'admin') {
            // Admins: Only load last 3 months to avoid thousands of orders
            q = query(collection(db, 'orders'), where('date', '>=', last3Months), limit(150));
        } else {
            return;
        }

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

            if (role === 'washer') {
                // Secondary listener for Pending orders (handled separately to avoid query limitations)
                setOrders(prev => {
                    const assigned = data;
                    const pending = prev.filter(o => o.status === 'Pending' && o.washerId !== user.uid);
                    const combined = [...assigned, ...pending];
                    const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                    return unique.sort((a, b) => b.date.localeCompare(a.date));
                });
            } else {
                // Sort by date desc in client side to avoid index requirement
                const sortedData = [...data].sort((a, b) => b.date.localeCompare(a.date));
                setOrders(sortedData);
            }
            setLoading(false);
        }, (error) => {
            console.error('❌ Error loading orders from Firestore:', error);
            if (error.code === 'failed-precondition') {
                console.warn('⚠️ Firestore Index missing. Falling back to non-ordered query. Link to fix:', error.message);
            }
            setLoading(false);
        });

        // Pending listener for washers
        let unsubPending = () => { };
        if (role === 'washer') {
            const qPending = query(collection(db, 'orders'), where('status', '==', 'Pending'), limit(30));
            unsubPending = onSnapshot(qPending, (snapshot) => {
                const pendingData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(prev => {
                    const assigned = prev.filter(o => o.washerId === user.uid);
                    const combined = [...assigned, ...pendingData];
                    const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                    return unique.sort((a, b) => b.date.localeCompare(a.date));
                });
            });
        }

        return () => {
            unsub();
            unsubPending();
        };
    }, [user?.uid, role, last3Months]);

    // 3. USERS (Admin Only - Limited)
    useEffect(() => {
        if (!user || role !== 'admin') {
            setClients([]);
            setTeam([]);
            return;
        }

        const q = query(collection(db, 'users'), limit(500)); // Still semi-heavy but limited
        const unsub = onSnapshot(q, (snapshot) => {
            const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
            setTeam(allUsers.filter(u => u.role === 'admin' || u.role === 'washer'));
            setClients(allUsers.filter(u => u.role === 'client' || !u.role));
        });

        return unsub;
    }, [user?.uid, role]);

    // 4. MESSAGES & NOTIFICATIONS (Last 7 Days Only)
    useEffect(() => {
        if (!user) return;

        const qMsg = query(collection(db, 'messages'), where('timestamp', '>=', sLast7Days), limit(100));
        const unsubMsg = onSnapshot(qMsg, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            // Sort by timestamp asc for chat flow safely handling Timestamp objects
            setMessages(data.sort((a, b) => {
                const at = (a.timestamp as any)?.toMillis?.() || a.timestamp || 0;
                const bt = (b.timestamp as any)?.toMillis?.() || b.timestamp || 0;
                return at - bt;
            }));
        });

        let qNotif;
        if (role === 'washer') {
            // Washers receive their own notifications + global washer announcements
            qNotif = query(
                collection(db, 'notifications'),
                where('userId', 'in', [user.uid, 'washer-broadcast']),
                limit(50)
            );
        } else {
            // Clients only receive their own notifications
            qNotif = query(
                collection(db, 'notifications'),
                where('userId', '==', user.uid),
                limit(50)
            );
        }

        const unsubNotif = onSnapshot(qNotif, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            // Sort by timestamp desc safely handling Timestamp objects
            setNotifications(data.sort((a, b) => {
                const at = (a.timestamp as any)?.toMillis?.() || a.timestamp || 0;
                const bt = (b.timestamp as any)?.toMillis?.() || b.timestamp || 0;
                return bt - at;
            }));
        });

        const unsubDiscounts = onSnapshot(
            collection(db, 'discounts'),
            (snapshot) => {
                try {
                    setDiscounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discount)));
                } catch (error) {
                    console.error('❌ Error processing discounts:', error);
                    setDiscounts([]);
                }
            },
            (error) => {
                console.error('❌ Error loading discounts:', error);
                setDiscounts([]);
            }
        );

        return () => {
            unsubMsg();
            unsubNotif();
            unsubDiscounts();
        };
    }, [user?.uid, sLast7Days]);

    // 5. ADMIN SPECIFIC COLLECTIONS
    useEffect(() => {
        if (!user || role !== 'admin') {
            setDeductions([]);
            setBonuses([]);
            setPayments([]);
            setPayrollPeriods([]);
            setIssues([]);
            setDeductions([]);
            setBonuses([]);
            setPayments([]);
            setPayrollPeriods([]);
            setIssues([]);
            // setDiscounts([]) REMOVED - Moved to Public
            setWasherApplications([]);
            return;
        }

        // unsubDiscounts REMOVED - Moved to Public

        const unsubIssues = onSnapshot(query(collection(db, 'issues'), limit(50)), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IssueReport));
            setIssues(data.sort((a, b) => {
                const at = (a.timestamp as any)?.toMillis?.() || a.timestamp || 0;
                const bt = (b.timestamp as any)?.toMillis?.() || b.timestamp || 0;
                return bt - at;
            }));
        });

        const unsubDeductions = onSnapshot(collection(db, 'deductions'), (snapshot) => {
            setDeductions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deduction)));
        });

        const unsubBonuses = onSnapshot(collection(db, 'bonuses'), (snapshot) => {
            setBonuses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bonus)));
        });

        const unsubPayments = onSnapshot(query(collection(db, 'payments'), limit(50)), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WasherPayment));
            setPayments(data.sort((a, b) => (b.paidDate || '').localeCompare(a.paidDate || '')));
        });

        const unsubPeriods = onSnapshot(query(collection(db, 'payroll_periods'), limit(12)), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PayrollPeriod));
            setPayrollPeriods(data.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || '')));
        });

        const unsubWasherApps = onSnapshot(query(collection(db, 'washer_applications'), limit(50)), (snapshot) => {
            setWasherApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            // unsubDiscounts(); REMOVED
            unsubIssues();
            unsubDeductions();
            unsubBonuses();
            unsubPayments();
            unsubPeriods();
            unsubWasherApps();
        };
    }, [user?.uid, role]);

    return {
        orders, clients, team, packages, packagesError, addons, vehicleTypes,
        discounts, deductions, bonuses, payments, payrollPeriods, issues,
        messages, notifications, serviceArea, washerApplications,
        loading
    };
};
