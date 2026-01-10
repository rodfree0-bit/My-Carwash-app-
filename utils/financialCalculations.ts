import { Order } from '../types';

export interface FinancialBreakdown {
    // Costos base
    servicesSubtotal: number;
    asapFee: number;
    discountAmount: number;
    subtotalAfterDiscount: number;

    // Fees aplicados
    fees: {
        name: string;
        percentage: number;
        amount: number;
    }[];
    totalFees: number;

    // Total cliente
    clientTotal: number;
    tipAmount: number;
    grandTotal: number;

    // Ganancias washer
    washerCommissionRate: number;
    washerBaseEarnings: number;
    washerTipEarnings: number;
    washerGrossEarnings: number;

    // Ganancias app
    appRevenue: number;

    // Snapshot de configuración
    globalFeesSnapshot: { name: string; percentage: number }[];
    discountCodeSnapshot?: string;
}

/**
 * Calculates the complete financial breakdown for an order.
 */
export const calculateOrderFinancials = (
    order: Partial<Order>,
    globalFees: { name: string; percentage: number }[] = []
): FinancialBreakdown => {
    // 1. Calculate Base Costs
    const baseServicePrice = order.basePrice || order.price || 0;
    const waitingCharge = order.waitingCharge || 0;
    const discountAmount = order.discountAmount || 0;

    // Services Subtotal includes base price + waiting charge
    const servicesSubtotal = baseServicePrice + waitingCharge;
    const asapFee = 0; // Not yet implemented

    // Subtotal after discount
    const subtotalAfterDiscount = servicesSubtotal + asapFee - discountAmount;

    // 2. Calculate Fees
    const fees: { name: string; percentage: number; amount: number }[] = [];
    let totalFees = 0;

    if (globalFees && globalFees.length > 0) {
        totalFees = globalFees.reduce((sum, fee) => {
            const amount = subtotalAfterDiscount * (fee.percentage / 100);
            fees.push({
                name: fee.name,
                percentage: fee.percentage,
                amount
            });
            return sum + amount;
        }, 0);
    }

    // 3. Client Totals
    const clientTotal = subtotalAfterDiscount;
    const tipAmount = order.tip || 0;
    const grandTotal = clientTotal + tipAmount;

    // 4. Washer Earnings
    // Washer gets (Client Total - Fees) + Tip
    const washerBaseEarnings = clientTotal - totalFees;
    const washerTipEarnings = tipAmount;
    const washerGrossEarnings = washerBaseEarnings + washerTipEarnings;

    // Calculate effective commission rate (Washer Base / Client Total) * 100
    // If clientTotal is 0, avoid division by zero
    const washerCommissionRate = clientTotal > 0 ? (washerBaseEarnings / clientTotal) * 100 : 0;

    // 5. App Revenue
    const appRevenue = totalFees;

    return {
        servicesSubtotal,
        asapFee,
        discountAmount,
        subtotalAfterDiscount,
        fees,
        totalFees,
        clientTotal,
        tipAmount,
        grandTotal,
        washerCommissionRate,
        washerBaseEarnings,
        washerTipEarnings,
        washerGrossEarnings,
        appRevenue,
        globalFeesSnapshot: globalFees,
        discountCodeSnapshot: order.discountCode
    };
};
