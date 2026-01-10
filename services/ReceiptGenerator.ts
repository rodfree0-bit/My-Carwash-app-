import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { Order } from '../types';
import { ReceiptTemplate } from '../components/Receipt/ReceiptTemplate';

export interface ReceiptData {
    order: Order;
    companyName?: string;
    companyLogo?: string;
    companyAddress?: string;
    companyPhone?: string;
}

export class ReceiptGenerator {
    /**
     * Generates HTML string from receipt template
     */
    static generateHTML(data: ReceiptData): string {
        const receiptElement = createElement(ReceiptTemplate, data);
        const htmlString = renderToString(receiptElement);

        // Wrap in complete HTML document
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibo - ${data.order.id}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f3f4f6;
        }
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    ${htmlString}
</body>
</html>
        `.trim();
    }

    /**
     * Prepares receipt data for email sending
     */
    static prepareEmailData(order: Order, receiptHTML: string) {
        return {
            to: order.clientId, // This should be the client's email
            subject: `Recibo de Servicio - ${order.service}`,
            html: receiptHTML,
            orderId: order.id,
            clientName: order.clientName,
            date: order.date,
            total: (order.price || 0) + (order.tip || 0) - (order.discountAmount || 0)
        };
    }

    /**
     * Triggers Firebase Function to send receipt email
     * This will call a Cloud Function that handles the actual email sending
     */
    static async sendReceiptEmail(order: Order, companyInfo?: {
        name?: string;
        logo?: string;
        address?: string;
        phone?: string;
    }): Promise<boolean> {
        try {
            // Generate HTML
            const receiptHTML = this.generateHTML({
                order,
                companyName: companyInfo?.name,
                companyLogo: companyInfo?.logo,
                companyAddress: companyInfo?.address,
                companyPhone: companyInfo?.phone
            });

            // Prepare email data
            const emailData = this.prepareEmailData(order, receiptHTML);

            // Call Firebase Function
            // Note: This endpoint needs to be created in Firebase Functions
            const response = await fetch('https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendReceipt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                throw new Error('Failed to send receipt email');
            }

            return true;
        } catch (error) {
            console.error('Error sending receipt email:', error);
            return false;
        }
    }

    /**
     * Downloads receipt as HTML file
     * Fallback option if email sending fails
     */
    static downloadReceipt(order: Order, companyInfo?: any) {
        const receiptHTML = this.generateHTML({
            order,
            ...companyInfo
        });

        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recibo-${order.id.substring(0, 8)}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
