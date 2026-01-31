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
                        console.log('📦 FIRESTORE: Loaded packages:', packagesData.length);
                        setPackages(packagesData);
                        setPackagesError(null);
                    } catch (error: any) {
                        console.error('❌ Error processing packages:', error);
                        setPackagesError(error.message || 'Error processing packages');
                    }
                },
                (error) => {
                    if (error.code === 'already-exists' || error.message?.includes('Target ID already exists')) {
                        console.warn('⚠️ Firestore glitch: Target ID already exists (Packages). Data should still sync.');
                        return;
                    }
                    console.error('❌ Error loading packages from Firestore:', error);
                    setPackagesError(error.message || 'Error loading packages from Firestore');
                }
            );


            const unsubAddons = onSnapshot(
                collection(db, 'addons'),
                (snapshot) => {
                    try {
                        setAddons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceAddon)));
                    } catch (error) {
                        console.error('❌ Error processing addons:', error);
                    }
                },
                (error) => {
                    if (error.code === 'already-exists' || error.message?.includes('Target ID already exists')) return;
                    console.error('❌ Error loading addons:', error);
                }
            );

            const unsubVehicleTypes = onSnapshot(
                collection(db, 'vehicle_types'),
                (snapshot) => {
                    try {
                        setVehicleTypes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                    } catch (error) {
                        console.error('❌ Error processing vehicle types:', error);
                    }
                },
                (error) => {
                    if (error.code === 'already-exists' || error.message?.includes('Target ID already exists')) return;
                    console.error('❌ Error loading vehicle types:', error);
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
                    if (error.code === 'already-exists' || error.message?.includes('Target ID already exists')) return;
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
            q = query(collection(db, 'orders'), where('washerId', '==', user.uid), orderBy('createdAt', 'desc'), limit(50));
        } else if (role === 'client') {
            q = query(collection(db, 'orders'), where('clientId', '==', user.uid), orderBy('createdAt', 'desc'), limit(30));
        } else if (role === 'admin') {
            // Admins: Only load last 3 months to avoid thousands of orders
            q = query(collection(db, 'orders'), where('date', '>=', last3Months), orderBy('date', 'desc'), orderBy('createdAt', 'desc'), limit(150));
        }

        const compareDates = (a: any, b: any) => {
            const getVal = (v: any) => {
                if (!v) return 0;
                if (typeof v === 'string') return new Date(v).getTime();
                if (v && typeof v.toMillis === 'function') return v.toMillis();
                if (v instanceof Date) return v.getTime();
                return 0;
            };
            return getVal(b) - getVal(a);
        };

        if (!q) {
            setLoading(false);
            return;
        }

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(data);
            setLoading(false);
        }, (error) => {
            console.error('❌ Error loading orders from Firestore:', error);
            if (error.code === 'failed-precondition') {
                console.warn('⚠️ Firestore Index missing. Falling back to non-ordered query. Link to fix:', error.message);
                // Fallback: If index missing, try without orderBy
                const fallbackQ = role === 'washer'
                    ? query(collection(db, 'orders'), where('washerId', '==', user.uid), limit(50))
                    : role === 'client'
                        ? query(collection(db, 'orders'), where('clientId', '==', user.uid), limit(30))
                        : query(collection(db, 'orders'), where('date', '>=', last3Months), limit(150));

                onSnapshot(fallbackQ, (snapshot) => {
                    const fallbackData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                    setOrders([...fallbackData].sort((a, b) => compareDates(a.createdAt || a.date, b.createdAt || b.date)));
                }, (err) => {
                    console.error('❌ Error in fallback order listener:', err);
                });
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
                    return unique.sort((a, b) => compareDates(a.date, b.date));
                });
            }, (err) => {
                console.error('❌ Error loading pending orders (Washer):', err);
            });
        }

        return () => {
            unsub();
            unsubPending();
        };
    }, [user?.uid, role, last3Months]);

    // 3. USERS (Local Profile Sync + Admin View)
    useEffect(() => {
        if (!user?.uid) return;

        // A. Always sync the current user's OWN document
        const unsubSelf = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
            if (snapshot.exists()) {
                const userData = { id: snapshot.id, ...snapshot.data() } as any;
                if (userData.role === 'admin' || userData.role === 'washer') {
                    setTeam(prev => {
                        const others = prev.filter(t => t.id !== userData.id);
                        return [...others, userData];
                    });
                } else {
                    setClients(prev => {
                        const others = prev.filter(c => c.id !== userData.id);
                        return [...others, userData];
                    });
                }
            }
        });

        // B. If Admin, sync the whole collection (limited)
        let unsubAll = () => { };
        if (role === 'admin') {
            const q = query(collection(db, 'users'), limit(500));
            unsubAll = onSnapshot(q,
                (snapshot) => {
                    const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
                    setTeam(allUsers.filter(u => u.role === 'admin' || u.role === 'washer'));
                    setClients(allUsers.filter(u => u.role === 'client' || !u.role));
                },
                (error) => {
                    console.error('❌ Error loading users (Admin):', error);
                }
            );
        }

        return () => {
            unsubSelf();
            unsubAll();
        };
    }, [user?.uid, role]);

    // 4. MESSAGES & NOTIFICATIONS (Last 7 Days Only)
    useEffect(() => {
        if (!user) return;

        const qMsg = query(collection(db, 'messages'), where('timestamp', '>=', sLast7Days), limit(100));
        const unsubMsg = onSnapshot(qMsg,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
                setMessages(data.sort((a, b) => {
                    const at = (a.timestamp as any)?.toMillis?.() || a.timestamp || 0;
                    const bt = (b.timestamp as any)?.toMillis?.() || b.timestamp || 0;
                    return at - bt;
                }));
            },
            (error) => {
                console.error('❌ Error loading messages:', error);
            }
        );

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

        const unsubNotif = onSnapshot(qNotif,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
                setNotifications(data.sort((a, b) => {
                    const at = (a.timestamp as any)?.toMillis?.() || a.timestamp || 0;
                    const bt = (b.timestamp as any)?.toMillis?.() || b.timestamp || 0;
                    return bt - at;
                }));
            },
            (error) => {
                console.error('❌ Error loading notifications:', error);
            }
        );

        let qDiscounts;
        if (role === 'admin') {
            qDiscounts = query(collection(db, 'discounts'), limit(100));
        } else if (role === 'client') {
            qDiscounts = query(collection(db, 'discounts'), where('clientId', '==', user.uid), limit(20));
        } else {
            setDiscounts([]);
            return;
        }

        const unsubDiscounts = onSnapshot(
            qDiscounts,
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

        const unsubIssues = onSnapshot(
            query(collection(db, 'issues'), limit(50)),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IssueReport));
                setIssues(data.sort((a, b) => {
                    const at = (a.timestamp as any)?.toMillis?.() || a.timestamp || 0;
                    const bt = (b.timestamp as any)?.toMillis?.() || b.timestamp || 0;
                    return bt - at;
                }));
            },
            (error) => {
                console.error('❌ Error loading issues (Admin):', error);
            }
        );

        const unsubDeductions = onSnapshot(collection(db, 'deductions'),
            (snapshot) => {
                setDeductions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deduction)));
            },
            (error) => {
                console.error('❌ Error loading deductions (Admin):', error);
            }
        );

        const unsubBonuses = onSnapshot(collection(db, 'bonuses'),
            (snapshot) => {
                setBonuses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bonus)));
            },
            (error) => {
                console.error('❌ Error loading bonuses (Admin):', error);
            }
        );

        const unsubPayments = onSnapshot(query(collection(db, 'payments'), limit(50)),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WasherPayment));
                setPayments(data.sort((a, b) => (b.paidDate || '').localeCompare(a.paidDate || '')));
            },
            (error) => {
                console.error('❌ Error loading payments (Admin):', error);
            }
        );

        const unsubPeriods = onSnapshot(query(collection(db, 'payroll_periods'), limit(12)),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PayrollPeriod));
                setPayrollPeriods(data.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || '')));
            },
            (error) => {
                console.error('❌ Error loading payroll periods (Admin):', error);
            }
        );

        const unsubWasherApps = onSnapshot(query(collection(db, 'washer_applications'), limit(50)),
            (snapshot) => {
                setWasherApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => {
                console.error('❌ Error loading washer applications (Admin):', error);
            }
        );

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

    return useMemo(() => ({
        orders, clients, team, packages, packagesError, addons, vehicleTypes,
        discounts, deductions, bonuses, payments, payrollPeriods, issues,
        messages, notifications, serviceArea, washerApplications,
        loading
    }), [
        orders, clients, team, packages, packagesError, addons, vehicleTypes,
        discounts, deductions, bonuses, payments, payrollPeriods, issues,
        messages, notifications, serviceArea, washerApplications,
        loading
    ]);
};
