import React from 'react';
import { Order } from '../../types';

interface ReceiptTemplateProps {
    order: Order;
    companyName?: string;
    companyLogo?: string;
    companyAddress?: string;
    companyPhone?: string;
}

export const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({
    order,
    companyName = "Premium Car Wash",
    companyLogo = "",
    companyAddress = "Los Angeles, CA",
    companyPhone = ""
}) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    const subtotal = order.basePrice || order.price || 0;
    const tip = order.tip || 0;
    const discount = order.discountAmount || 0;
    const total = subtotal + tip - discount;

    return (
        <div className="receipt-container" style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px',
            backgroundColor: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            color: '#333'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #3b82f6', paddingBottom: '20px' }}>
                {companyLogo && (
                    <img src={companyLogo} alt={companyName} style={{ maxWidth: '150px', marginBottom: '10px' }} />
                )}
                <h1 style={{ margin: '10px 0', color: '#3b82f6', fontSize: '32px' }}>{companyName}</h1>
                <p style={{ margin: '5px 0', color: '#666' }}>{companyAddress}</p>
                {companyPhone && <p style={{ margin: '5px 0', color: '#666' }}>{companyPhone}</p>}
            </div>

            {/* Receipt Title */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px', color: '#1f2937', margin: '0' }}>RECIBO DE SERVICIO</h2>
                <p style={{ color: '#666', margin: '10px 0' }}>Orden #{order.id.substring(0, 8).toUpperCase()}</p>
            </div>

            {/* Service Details */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '18px' }}>Detalles del Servicio</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px 0', color: '#666' }}>Fecha:</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>
                                {formatDate(order.date)} - {order.time}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px 0', color: '#666' }}>Cliente:</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{order.clientName}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px 0', color: '#666' }}>Vehículo:</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{order.vehicle}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px 0', color: '#666' }}>Servicio:</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{order.service}</td>
                        </tr>
                        {order.addons && order.addons.length > 0 && (
                            <tr>
                                <td style={{ padding: '8px 0', color: '#666' }}>Extras:</td>
                                <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>
                                    {order.addons.join(', ')}
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td style={{ padding: '8px 0', color: '#666' }}>Dirección:</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{order.address}</td>
                        </tr>
                        {order.washerName && (
                            <tr>
                                <td style={{ padding: '8px 0', color: '#666' }}>Técnico:</td>
                                <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{order.washerName}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Photos Section */}
            {order.photos?.after && (
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '18px' }}>Service Photos</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        {Object.entries(order.photos.after).map(([key, url]) => (
                            url && (
                                <div key={key} style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={url as string} alt={key} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                    <p style={{ textAlign: 'center', margin: '5px', fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Pricing */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '18px' }}>Resumen de Pago</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '10px 0', fontSize: '16px' }}>Subtotal:</td>
                            <td style={{ padding: '10px 0', textAlign: 'right', fontSize: '16px' }}>{formatCurrency(subtotal)}</td>
                        </tr>
                        {tip > 0 && (
                            <tr>
                                <td style={{ padding: '10px 0', fontSize: '16px', color: '#10b981' }}>Propina:</td>
                                <td style={{ padding: '10px 0', textAlign: 'right', fontSize: '16px', color: '#10b981' }}>
                                    {formatCurrency(tip)}
                                </td>
                            </tr>
                        )}
                        {discount > 0 && (
                            <tr>
                                <td style={{ padding: '10px 0', fontSize: '16px', color: '#ef4444' }}>
                                    Descuento {order.discountCode && `(${order.discountCode})`}:
                                </td>
                                <td style={{ padding: '10px 0', textAlign: 'right', fontSize: '16px', color: '#ef4444' }}>
                                    -{formatCurrency(discount)}
                                </td>
                            </tr>
                        )}
                        <tr style={{ borderTop: '2px solid #3b82f6' }}>
                            <td style={{ padding: '15px 0', fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Total:</td>
                            <td style={{ padding: '15px 0', textAlign: 'right', fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                                {formatCurrency(total)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Rating */}
            {order.clientRating && (
                <div style={{ marginBottom: '30px', textAlign: 'center', padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '18px' }}>Calificación del Cliente</h3>
                    <div style={{ fontSize: '24px', color: '#f59e0b' }}>
                        {'★'.repeat(order.clientRating)}{'☆'.repeat(5 - order.clientRating)}
                    </div>
                    {order.clientReview && (
                        <p style={{ margin: '10px 0 0 0', fontStyle: 'italic', color: '#666' }}>"{order.clientReview}"</p>
                    )}
                </div>
            )}

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
                <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                    ¡Gracias por confiar en {companyName}!
                </p>
                <p style={{ color: '#666', fontSize: '12px', margin: '5px 0' }}>
                    Este recibo fue generado automáticamente el {new Date().toLocaleDateString('es-ES')}
                </p>
            </div>
        </div>
    );
};
