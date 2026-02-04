import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear el objeto serviceAccount usando las variables de entorno
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

// Validar que las credenciales estén configuradas
if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    console.error('❌ Firebase credentials incomplete:', {
        hasProjectId: !!serviceAccount.projectId,
        hasClientEmail: !!serviceAccount.clientEmail,
        hasPrivateKey: !!serviceAccount.privateKey,
    });
} else {
    console.log('✅ Firebase credentials loaded. Project:', serviceAccount.projectId);
}

// Inicializar Firebase con validación
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error: any) {
    console.error('❌ Firebase initialization error:', {
        code: error.code,
        message: error.message,
    });
}

export { admin };
export const auth = admin.auth();
