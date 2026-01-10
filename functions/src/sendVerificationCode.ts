/**
 * Cloud Function: Generar y Enviar Código de Verificación
 * 
 * Genera un código de 6 dígitos, lo guarda en Firestore y lo envía por email
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Configurar transporter de email (usa las credenciales de tu email)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().email?.user || 'your-email@gmail.com',
        pass: functions.config().email?.password || 'your-app-password'
    }
});

export const sendVerificationCode = functions.https.onCall(async (data, context) => {
    const { email } = data;

    // Validar email
    if (!email || typeof email !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Email is required');
    }

    try {
        // Generar código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Guardar código en Firestore con expiración de 10 minutos
        const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000);

        await admin.firestore().collection('verification_codes').doc(email).set({
            code,
            email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt,
            attempts: 0,
            verified: false
        });

        // Enviar email con el código
        const mailOptions = {
            from: functions.config().email?.user || 'Car Wash App <noreply@carwash.com>',
            to: email,
            subject: 'Your Verification Code - Car Wash App',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">Car Wash App</h2>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1f2937; font-size: 48px; margin: 0; letter-spacing: 10px;">${code}</h1>
          </div>
          <p style="color: #6b7280;">This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);

        console.log(`✅ Verification code sent to ${email}`);

        return {
            success: true,
            message: 'Verification code sent successfully',
            expiresIn: 600 // 10 minutes in seconds
        };

    } catch (error) {
        console.error('❌ Error sending verification code:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send verification code');
    }
});
