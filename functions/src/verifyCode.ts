/**
 * Cloud Function: Verificar Código
 * 
 * Valida el código ingresado por el usuario y crea/autentica la cuenta
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const verifyCode = functions.https.onCall(async (data, context) => {
    const { email, code } = data;

    // Validar parámetros
    if (!email || !code) {
        throw new functions.https.HttpsError('invalid-argument', 'Email and code are required');
    }

    try {
        const codeDoc = await admin.firestore().collection('verification_codes').doc(email).get();

        if (!codeDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'No verification code found for this email');
        }

        const codeData = codeDoc.data()!;

        // Verificar si ya fue usado
        if (codeData.verified) {
            throw new functions.https.HttpsError('failed-precondition', 'Code already used');
        }

        // Verificar expiración
        if (codeData.expiresAt.toMillis() < Date.now()) {
            throw new functions.https.HttpsError('deadline-exceeded', 'Code has expired');
        }

        // Verificar intentos (máximo 5)
        if (codeData.attempts >= 5) {
            throw new functions.https.HttpsError('resource-exhausted', 'Too many attempts. Request a new code.');
        }

        // Verificar código
        if (codeData.code !== code) {
            // Incrementar intentos
            await admin.firestore().collection('verification_codes').doc(email).update({
                attempts: admin.firestore.FieldValue.increment(1)
            });

            throw new functions.https.HttpsError('invalid-argument', 'Invalid verification code');
        }

        // Código válido - Marcar como verificado
        await admin.firestore().collection('verification_codes').doc(email).update({
            verified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Crear o obtener usuario
        let user;
        try {
            user = await admin.auth().getUserByEmail(email);
        } catch (error) {
            // Usuario no existe, crearlo
            user = await admin.auth().createUser({
                email,
                emailVerified: true
            });

            // Crear perfil en Firestore
            await admin.firestore().collection('users').doc(user.uid).set({
                id: user.uid,
                email,
                role: 'client',
                name: email.split('@')[0],
                phone: '',
                address: '',
                photo: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3b82f6&color=fff`,
                savedVehicles: [],
                savedCards: [],
                savedAddresses: [],
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        // Generar custom token para autenticación
        const customToken = await admin.auth().createCustomToken(user.uid);

        console.log(`✅ User ${email} verified successfully`);

        return {
            success: true,
            token: customToken,
            userId: user.uid
        };

    } catch (error: any) {
        console.error('❌ Error verifying code:', error);

        // Re-throw HttpsErrors
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        throw new functions.https.HttpsError('internal', 'Failed to verify code');
    }
});
