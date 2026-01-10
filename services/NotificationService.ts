export interface NotificationPayload {
    to: string; // Phone number or Email
    subject?: string; // For Email
    body: string;
    type: 'SMS' | 'EMAIL';
}

export const NotificationService = {
    /**
     * Simulates sending an SMS. In production, connect this to Twilio.
     */
    sendSMS: async (phone: string, message: string): Promise<boolean> => {
        console.log(`[SIMULATION] Sending SMS to ${phone}: ${message}`);
        // Here you would call fetch('https://api.twilio.com/...')
        return true;
    },

    /**
     * Simulates sending an Email. In production, connect this to SendGrid/Resend.
     */
    sendEmail: async (email: string, subject: string, body: string): Promise<boolean> => {
        console.log(`[SIMULATION] Sending Email to ${email} | Subject: ${subject} | Body: ${body}`);
        // Here you would call fetch('https://api.resend.com/...')
        return true;
    },

    /**
     * Helper to notify a user about an order update
     */
    notifyOrderUpdate: async (user: { phone?: string, email?: string }, orderId: string, status: string) => {
        const message = `Your order #${orderId} has been updated to: ${status}`;

        if (user.phone) {
            await NotificationService.sendSMS(user.phone, message);
        }

        if (user.email) {
            await NotificationService.sendEmail(user.email, `Order Update #${orderId}`, message);
        }
    }
};
