package com.carwash.app.model

/**
 * Discount/Coupon model - 100% parity with Web
 */
data class Discount(
    val id: String = "",
    val code: String = "",
    val type: String = "", // percentage, fixed
    val value: Double = 0.0, // Percentage (0-100) or fixed amount
    val description: String = "",
    val active: Boolean = true,
    val validFrom: String = "",
    val validUntil: String = "",
    val usageLimit: Int = 0,
    val usageCount: Int = 0,
    val applicableTo: String = "all", // all, packages, addons, total
    val specificItems: List<String> = emptyList(), // IDs of specific packages/addons
    val minimumOrderAmount: Double = 0.0,
    val createdBy: String = "", // Admin ID
    val createdDate: String = ""
)

/**
 * Discount Type constants
 */
object DiscountType {
    const val PERCENTAGE = "percentage"
    const val FIXED = "fixed"
}

/**
 * Discount Applicable To constants
 */
object DiscountApplicableTo {
    const val ALL = "all"
    const val PACKAGES = "packages"
    const val ADDONS = "addons"
    const val TOTAL = "total"
}
