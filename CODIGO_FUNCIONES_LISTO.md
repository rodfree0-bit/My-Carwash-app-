# ✅ SOLUCIÓN FINAL: Código Listo para Copiar

## 🎯 Lo que necesitas hacer

**Solo 3 pasos simples:**

1. Inicia sesión en Google Cloud Console
2. Copia y pega el código que te doy
3. Configura 6 funciones (te doy la configuración exacta)

---

## 📋 CÓDIGO COMPLETO (Copiar TODO)

Este es el archivo `functions/index.js` completo. **Cópialo ahora:**

```javascript
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

// Helper function
async function sendNotification(userId, title, body, data = {}) {
    try {
        const userDoc = await getFirestore().collection("users").doc(userId).get();
        if (!userDoc.exists) {
            console.log(`User ${userId} not found`);
            return;
        }
        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;
        if (!fcmToken) {
            console.log(`No FCM Token found for user ${userId}`);
            return;
        }
        const message = {
            notification: { title: title, body: body },
            token: fcmToken,
            data: data
        };
        const response = await getMessaging().send(message);
        console.log(`✅ Notification sent to ${userId}:`, response);
    } catch (error) {
        console.error(`❌ Error sending notification to ${userId}:`, error);
    }
}

// 1. NEW ORDER
exports.onNewOrderCreated = onDocumentCreated({
    document: "orders/{orderId}",
    region: "us-central1"
}, async (event) => {
    const orderData = event.data.data();
    const orderId = event.params.orderId;
    console.log(`🆕 New order: ${orderId}`);
    const adminsSnapshot = await getFirestore().collection("users").where("role", "==", "admin").get();
    const notifications = [];
    adminsSnapshot.forEach((adminDoc) => {
        notifications.push(sendNotification(adminDoc.id, "🆕 New Order Received!", 
            `${orderData.clientName || 'A client'} ordered ${orderData.service || 'car wash'}`,
            { type: "new_order", orderId: orderId, screen: "ADMIN_DASHBOARD" }));
    });
    await Promise.all(notifications);
    return null;
});

// 2. ORDER STATUS UPDATE
exports.onOrderStatusUpdated = onDocumentUpdated({
    document: "orders/{orderId}",
    region: "us-central1"
}, async (event) => {
    const newData = event.data.after.data();
    const oldData = event.data.before.data();
    if (newData.status === oldData.status) return null;
    
    const orderId = event.params.orderId;
    const clientId = newData.clientId;
    const washerId = newData.washerId;
    
    let title = "", body = "", targetUserId = "";
    
    if (newData.status === "Assigned" && oldData.status === "New") {
        title = "Washer Assigned! 🚗";
        body = `${newData.washerName || 'A washer'} has been assigned to your order.`;
        targetUserId = clientId;
        if (washerId) {
            await sendNotification(washerId, "🚗 New Order Assigned to You!",
                `You've been assigned to ${newData.clientName || 'a client'}'s order`,
                { type: "order_assigned", orderId: orderId });
        }
    } else if (newData.status === "En Route") {
        title = "Washer En Route! 📍";
        body = `${newData.washerName || 'Your washer'} is on the way.`;
        targetUserId = clientId;
    } else if (newData.status === "Arrived") {
        title = "Washer Arrived! 👋";
        body = `${newData.washerName || 'The washer'} has arrived.`;
        targetUserId = clientId;
    } else if (newData.status === "Washing") {
        title = "Washing Started 🧼";
        body = "Your vehicle is being washed now.";
        targetUserId = clientId;
    } else if (newData.status === "Completed") {
        title = "All Done! ✨";
        body = "Your car wash is complete. Please rate your service.";
        targetUserId = clientId;
    } else if (newData.status === "Cancelled") {
        if (washerId && oldData.status !== "New") {
            await sendNotification(washerId, "Order Cancelled ❌",
                `Order #${orderId.substring(0, 8)} has been cancelled.`,
                { type: "order_cancelled", orderId: orderId });
        }
        title = "Order Cancelled ❌";
        body = "Your order has been cancelled.";
        targetUserId = clientId;
    }
    
    if (targetUserId && title) {
        await sendNotification(targetUserId, title, body,
            { type: "order_update", orderId: orderId });
    }
    return null;
});

// 3. NEW ISSUE
exports.onNewIssueReported = onDocumentCreated({
    document: "issues/{issueId}",
    region: "us-central1"
}, async (event) => {
    const issueData = event.data.data();
    const issueId = event.params.issueId;
    const adminsSnapshot = await getFirestore().collection("users").where("role", "==", "admin").get();
    const notifications = [];
    adminsSnapshot.forEach((adminDoc) => {
        notifications.push(sendNotification(adminDoc.id, "🐛 New Issue Reported",
            `${issueData.userName || 'A user'} reported: ${issueData.description?.substring(0, 50) || 'an issue'}`,
            { type: "new_issue", issueId: issueId }));
    });
    await Promise.all(notifications);
    return null;
});

// 4. NEW WASHER APPLICATION
exports.onNewWasherApplication = onDocumentCreated({
    document: "washer_applications/{applicationId}",
    region: "us-central1"
}, async (event) => {
    const applicationData = event.data.data();
    const applicationId = event.params.applicationId;
    const adminsSnapshot = await getFirestore().collection("users").where("role", "==", "admin").get();
    const notifications = [];
    adminsSnapshot.forEach((adminDoc) => {
        notifications.push(sendNotification(adminDoc.id, "👤 New Washer Application",
            `${applicationData.name || 'Someone'} applied to become a washer`,
            { type: "new_washer_application", applicationId: applicationId }));
    });
    await Promise.all(notifications);
    return null;
});

// 5. NEW MESSAGE
exports.onNewMessage = onDocumentCreated({
    document: "messages/{messageId}",
    region: "us-central1"
}, async (event) => {
    const messageData = event.data.data();
    const recipientId = messageData.recipientId;
    if (!recipientId) return null;
    const senderDoc = await getFirestore().collection("users").doc(messageData.senderId).get();
    const senderName = senderDoc.exists ? (senderDoc.data().name || "Someone") : "Someone";
    await sendNotification(recipientId, `💬 ${senderName}`,
        messageData.text?.substring(0, 100) || "New message",
        { type: "new_message", orderId: messageData.orderId || "", senderId: messageData.senderId });
    return null;
});

// 6. WASHER APPROVED
exports.onWasherApproved = onDocumentCreated({
    document: "approved_washers/{email}",
    region: "us-central1"
}, async (event) => {
    const email = event.params.email;
    const usersSnapshot = await getFirestore().collection("users").where("email", "==", email).limit(1).get();
    if (!usersSnapshot.empty) {
        const userId = usersSnapshot.docs[0].id;
        await sendNotification(userId, "🎉 Application Approved!",
            "Congratulations! Your washer application has been approved.",
            { type: "application_approved" });
    }
    return null;
});
```

---

## 📦 package.json (Copiar también)

```json
{
  "name": "carwash-notifications",
  "version": "1.0.0",
  "dependencies": {
    "firebase-admin": "^13.6.0",
    "firebase-functions": "^7.0.1"
  }
}
```

---

## 🔧 CONFIGURACIÓN DE CADA FUNCIÓN

### Función 1: onNewOrderCreated
- **Event**: `google.cloud.firestore.document.v1.created`
- **Path**: `orders/{orderId}`
- **Entry point**: `onNewOrderCreated`

### Función 2: onOrderStatusUpdated
- **Event**: `google.cloud.firestore.document.v1.updated`
- **Path**: `orders/{orderId}`
- **Entry point**: `onOrderStatusUpdated`

### Función 3: onNewIssueReported
- **Event**: `google.cloud.firestore.document.v1.created`
- **Path**: `issues/{issueId}`
- **Entry point**: `onNewIssueReported`

### Función 4: onNewWasherApplication
- **Event**: `google.cloud.firestore.document.v1.created`
- **Path**: `washer_applications/{applicationId}`
- **Entry point**: `onNewWasherApplication`

### Función 5: onNewMessage
- **Event**: `google.cloud.firestore.document.v1.created`
- **Path**: `messages/{messageId}`
- **Entry point**: `onNewMessage`

### Función 6: onWasherApproved
- **Event**: `google.cloud.firestore.document.v1.created`
- **Path**: `approved_washers/{email}`
- **Entry point**: `onWasherApproved`

---

## 🚀 PASOS FINALES

1. **Inicia sesión** en: https://console.cloud.google.com/functions/add?project=my-carwashapp-e6aba

2. **Para cada función:**
   - Environment: `2nd gen`
   - Region: `us-central1`
   - Runtime: `Node.js 18`
   - Trigger: `Cloud Firestore`
   - Pega el código JavaScript completo
   - Pega el package.json
   - Click "DEPLOY"

3. **Espera** 2-3 minutos por función

4. **Verifica** en: https://console.firebase.google.com/project/my-carwashapp-e6aba/functions

---

**¿Necesitas ayuda con algún paso específico?** Avísame.
