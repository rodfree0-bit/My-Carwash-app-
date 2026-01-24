import React, { useState, useEffect } from 'react';
import { i18n } from '../services/i18n';
import { doc, updateDoc, onSnapshot, getDoc, collection, query, where, addDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface LoyaltyTier {
    name: string;
    minPoints: number;
    discount: number;
    color: string;
    benefits: string[];
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
    {
        name: i18n.t('tier_bronze'),
        minPoints: 0,
        discount: 0,
        color: '#CD7F32',
        benefits: [i18n.t('benefit_bronze_1'), i18n.t('benefit_bronze_2')]
    },
    {
        name: i18n.t('tier_silver'),
        minPoints: 5,
        discount: 5,
        color: '#C0C0C0',
        benefits: [i18n.t('benefit_silver_1'), i18n.t('benefit_silver_2')]
    },
    {
        name: i18n.t('tier_gold'),
        minPoints: 10,
        discount: 10,
        color: '#FFD700',
        benefits: [i18n.t('benefit_gold_1'), i18n.t('benefit_gold_2')]
    },
    {
        name: i18n.t('tier_diamond'),
        minPoints: 15,
        discount: 15,
        color: '#E5E4E2',
        benefits: [i18n.t('benefit_diamond_1'), i18n.t('benefit_diamond_2')]
    }
];

interface LoyaltyProgramProps {
    userId: string;
}

export const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({ userId }) => {
    const [points, setPoints] = useState(0);
    const [claimedMilestones, setClaimedMilestones] = useState<number[]>([]);
    const [currentTier, setCurrentTier] = useState<LoyaltyTier>(LOYALTY_TIERS[0]);
    const [nextTier, setNextTier] = useState<LoyaltyTier | null>(LOYALTY_TIERS[1]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const [userCoupons, setUserCoupons] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribeUser = onSnapshot(
            doc(db, 'users', userId),
            (docSnap) => {
                const data = docSnap.data();
                const userPoints = data?.loyaltyPoints || 0;
                const claimed = data?.claimedMilestones || [];
                setPoints(userPoints);
                setClaimedMilestones(claimed);

                // Determine current tier
                const tier = [...LOYALTY_TIERS]
                    .reverse()
                    .find(t => userPoints >= t.minPoints) || LOYALTY_TIERS[0];
                setCurrentTier(tier);

                // Determine next tier
                const currentIndex = LOYALTY_TIERS.indexOf(tier);
                setNextTier(currentIndex < LOYALTY_TIERS.length - 1 ? LOYALTY_TIERS[currentIndex + 1] : null);

                setLoading(false);
            },
            (error) => {
                console.error('❌ Error listening to user profile in LoyaltyProgram:', error);
                setLoading(false);
            }
        );

        // Fetch user specific tokens
        const q = query(collection(db, 'discounts'), where('clientId', '==', userId), where('active', '==', true));
        const unsubscribeCoupons = onSnapshot(q, (snapshot: any) => {
            const coupons = snapshot.docs.map((d: any) => ({
                id: d.id,
                ...d.data()
            }));
            setUserCoupons(coupons);
        }, (error) => {
            console.error('❌ Error fetching user tokens in LoyaltyProgram:', error);
        });

        return () => {
            unsubscribeUser();
            unsubscribeCoupons();
        };
    }, [userId]);

    const handleClaimReward = async (milestone: number, discountValue: number) => {
        if (claiming || claimedMilestones.includes(milestone)) return;

        setClaiming(true);
        try {
            // Generate a unique code
            const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
            const uniqueCode = `VALE-${discountValue}-${randomStr}`;

            // 1. Create the discount in Firestore
            await addDoc(collection(db, 'discounts'), {
                code: uniqueCode,
                type: 'percentage',
                value: discountValue,
                description: `Loyalty Reward - ${milestone} Washes`,
                active: true,
                usageLimit: 1,
                usageCount: 0,
                applicableTo: 'total',
                clientId: userId,
                createdBy: 'system',
                createdDate: serverTimestamp() as any
            });

            // 2. Update user document
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                claimedMilestones: arrayUnion(milestone)
            });

            alert(`Congratulations! Your code is: ${uniqueCode}\n\nCopy it to use it on your next order.`);
        } catch (error: any) {
            console.error('Error claiming reward:', error);
            const errorMsg = error.message?.includes('permission-denied')
                ? 'Authorization error. Please contact support.'
                : `Error: ${error.message || 'Please try again.'}`;
            alert(`Error claiming reward: ${errorMsg}`);
        } finally {
            setClaiming(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Code copied to clipboard!');
    };

    const progressToNextTier = nextTier
        ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
        : 100;

    const pointsNeeded = nextTier ? nextTier.minPoints - points : 0;

    if (loading) {
        return <div className="flex items-center justify-center p-8"><div className="spinner" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Current Tier Card */}
            <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${currentTier.color}20 0%, ${currentTier.color}05 100%)`,
                    borderColor: `${currentTier.color}40`,
                    borderWidth: '2px'
                }}
            >
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">{i18n.t('loyalty_current_level')}</p>
                            <h2 className="text-4xl font-bold" style={{ color: currentTier.color }}>
                                {currentTier.name}
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-400 mb-1">{i18n.t('loyalty_completed_washes')}</p>
                            <p className="text-4xl font-bold">{points}</p>
                        </div>
                    </div>

                    {nextTier && (
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">{i18n.t('loyalty_next_goal')}: {nextTier.name}</span>
                                <span className="font-semibold">{pointsNeeded} {i18n.t('loyalty_more_washes')}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(progressToNextTier, 100)}%`,
                                        background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Decorative background */}
                <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                    style={{ background: currentTier.color, transform: 'translate(30%, -30%)' }}
                />
            </div>

            {/* Loyalty Tiers Grid */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-primary">{i18n.t('loyalty_rewards')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {LOYALTY_TIERS.map((tier) => {
                        const isReached = points >= tier.minPoints;
                        const isClaimed = claimedMilestones.includes(tier.minPoints);
                        const canClaim = tier.minPoints > 0 && isReached && !isClaimed;

                        return (
                            <div
                                key={tier.name}
                                className={`rounded-xl p-4 border-2 transition-all ${tier.name === currentTier.name
                                    ? 'scale-105 shadow-lg'
                                    : 'opacity-60 hover:opacity-100'
                                    }`}
                                style={{
                                    borderColor: tier.name === currentTier.name ? tier.color : '#ffffff20',
                                    background: `${tier.color}10`
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg" style={{ color: tier.color }}>
                                        {tier.name}
                                    </h4>
                                    {isClaimed && (
                                        <span className="material-symbols-outlined text-green-400 text-sm">verified</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 mb-3">{tier.minPoints} {i18n.t('loyalty_required_washes')}</p>
                                {tier.discount > 0 && (
                                    <p className="text-xl font-bold mb-3">{tier.discount}% {i18n.t('discount_off')}</p>
                                )}

                                {canClaim ? (
                                    <button
                                        onClick={() => handleClaimReward(tier.minPoints, tier.discount)}
                                        disabled={claiming}
                                        className="w-full py-2 bg-primary text-black rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors"
                                    >
                                        {claiming ? i18n.t('loyalty_generating') : i18n.t('loyalty_claim_coupon')}
                                    </button>
                                ) : isClaimed ? (
                                    <div className="py-2 text-center text-green-400 text-xs font-bold border border-green-500/20 rounded-lg">
                                        {i18n.t('loyalty_reclaimed')}
                                    </div>
                                ) : tier.minPoints > 0 && (
                                    <div className="py-2 text-center text-slate-500 text-xs font-bold border border-white/10 rounded-lg">
                                        {i18n.t('loyalty_locked')}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mis Cupones */}
            {userCoupons.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-primary">{i18n.t('loyalty_my_coupons')}</h3>
                    <div className="space-y-3">
                        {userCoupons.map((coupon) => (
                            <button
                                key={coupon.id}
                                onClick={() => copyToClipboard(coupon.code)}
                                disabled={coupon.usageCount > 0}
                                className={`w-full flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 transition-all text-left group
                                    ${coupon.usageCount === 0 ? 'hover:bg-white/5 hover:border-primary/30 active:scale-[0.98]' : 'opacity-50 grayscale cursor-not-allowed'}
                                `}
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-lg tracking-wider text-primary group-hover:text-white transition-colors">{coupon.code}</p>
                                        <span className="material-symbols-outlined text-xs text-slate-500">content_copy</span>
                                    </div>
                                    <p className="text-xs text-slate-400">{coupon.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-xl text-green-400">{coupon.value}% OFF</p>
                                    {coupon.usageCount > 0 ? (
                                        <span className="text-[10px] text-slate-500 uppercase px-2 py-0.5 bg-white/5 rounded">{i18n.t('loyalty_used')}</span>
                                    ) : (
                                        <span className="text-[10px] text-green-400 uppercase px-2 py-0.5 bg-green-500/10 rounded">{i18n.t('loyalty_available')}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* How it works */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">{i18n.t('loyalty_how_works')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">local_car_wash</span>
                        <div>
                            <p className="font-semibold mb-1">{i18n.t('loyalty_step1_title')}</p>
                            <p className="text-sm text-slate-400">{i18n.t('loyalty_step1_desc')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">stars</span>
                        <div>
                            <p className="font-semibold mb-1">{i18n.t('loyalty_step2_title')}</p>
                            <p className="text-sm text-slate-400">{i18n.t('loyalty_step2_desc')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">confirmation_number</span>
                        <div>
                            <p className="font-semibold mb-1">{i18n.t('loyalty_step3_title')}</p>
                            <p className="text-sm text-slate-400">{i18n.t('loyalty_step3_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-400 italic">{i18n.t('loyalty_footer')}</p>
            </div>
        </div>
    );
};

// Function to add points after order completion (1 order = 1 point)
export const addLoyaltyPoints = async (userId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const currentPoints = userSnap.exists() ? (userSnap.data()?.loyaltyPoints || 0) : 0;

        await updateDoc(userRef, {
            loyaltyPoints: currentPoints + 1
        });

        return 1;
    } catch (error) {
        console.error('Error adding loyalty points:', error);
        return 0;
    }
};
