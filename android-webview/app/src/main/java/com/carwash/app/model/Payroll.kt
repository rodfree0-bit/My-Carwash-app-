package com.carwash.app.model

/**
 * Payroll Period model - 100% parity with Web
 */
data class PayrollPeriod(
    val id: String = "",
    val startDate: String = "", // ISO date
    val endDate: String = "", // ISO date
    val status: String = "open", // open, closed, paid
    val closedDate: String = "",
    val closedBy: String = "" // Admin ID
)

/**
 * Washer Payment model
 */
data class WasherPayment(
    val id: String = "",
    val washerId: String = "",
    val washerName: String = "",
    val periodId: String = "",
    val baseEarnings: Double = 0.0,
    val tips: Double = 0.0,
    val bonuses: Double = 0.0,
    val deductions: Double = 0.0,
    val totalPaid: Double = 0.0,
    val completedJobs: Int = 0,
    val paidDate: String = "",
    val paidBy: String = "", // Admin ID
    val paidByName: String = "",
    val notes: String = "",
    val orderIds: List<String> = emptyList(), // List of order IDs included
    val paymentMethod: String = "" // cash, transfer, check, other
)

/**
 * Deduction model
 */
data class Deduction(
    val id: String = "",
    val washerId: String = "",
    val washerName: String = "",
    val amount: Double = 0.0,
    val type: String = "", // penalty, advance, equipment, insurance, other
    val description: String = "",
    val date: String = "",
    val createdBy: String = "", // Admin ID
    val createdByName: String = "",
    val appliedToPeriodId: String = "", // If already applied to a payment
    val status: String = "pending" // pending, applied, cancelled
)

/**
 * Bonus model
 */
data class Bonus(
    val id: String = "",
    val washerId: String = "",
    val washerName: String = "",
    val amount: Double = 0.0,
    val reason: String = "",
    val date: String = "",
    val createdBy: String = "", // Admin ID
    val createdByName: String = "",
    val appliedToPeriodId: String = "",
    val status: String = "pending" // pending, applied, cancelled
)

/**
 * Payroll Status constants
 */
object PayrollStatus {
    const val OPEN = "open"
    const val CLOSED = "closed"
    const val PAID = "paid"
}

/**
 * Deduction Type constants
 */
object DeductionType {
    const val PENALTY = "penalty"
    const val ADVANCE = "advance"
    const val EQUIPMENT = "equipment"
    const val INSURANCE = "insurance"
    const val OTHER = "other"
}

/**
 * Payment Method constants
 */
object PaymentMethod {
    const val CASH = "cash"
    const val TRANSFER = "transfer"
    const val CHECK = "check"
    const val OTHER = "other"
}
