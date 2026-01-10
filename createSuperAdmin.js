// Script para crear cuenta de super admin
// Ejecutar con: node createSuperAdmin.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function createSuperAdmin() {
    const email = 'rodfree0@gmail.com';
    const password = 'Carlitos2015.';
    const name = 'Rodrigo';

    try {
        // Crear usuario en Firebase Auth
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: name,
            emailVerified: true // Auto-verificar email para admin
        });

        console.log('✅ Usuario creado en Firebase Auth:', userRecord.uid);

        // Crear perfil en Firestore
        await db.collection('users').doc(userRecord.uid).set({
            id: userRecord.uid,
            email: email,
            name: name,
            role: 'admin',
            phone: '',
            address: '',
            avatar: '',
            createdAt: new Date().toISOString(),
            isSuperAdmin: true
        });

        console.log('✅ Perfil de super admin creado en Firestore');
        console.log('\n🎉 CUENTA SUPER ADMIN CREADA:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Role: Super Admin');
        console.log('\n✅ Ya puedes iniciar sesión en la app!');

    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            console.log('⚠️  El usuario ya existe. Actualizando contraseña...');

            // Obtener usuario existente
            const user = await auth.getUserByEmail(email);

            // Actualizar contraseña
            await auth.updateUser(user.uid, {
                password: password,
                emailVerified: true
            });

            // Actualizar perfil en Firestore
            await db.collection('users').doc(user.uid).set({
                id: user.uid,
                email: email,
                name: name,
                role: 'admin',
                phone: '',
                address: '',
                avatar: '',
                createdAt: new Date().toISOString(),
                isSuperAdmin: true
            }, { merge: true });

            console.log('✅ Contraseña actualizada');
            console.log('\n🎉 CREDENCIALES ACTUALIZADAS:');
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('Role: Super Admin');
            console.log('\n✅ Ya puedes iniciar sesión en la app!');
        } else {
            console.error('❌ Error:', error.message);
        }
    }

    process.exit(0);
}

createSuperAdmin();
