// Wait for Firebase to initialize
function waitForFirebase(callback) {
    if (window.firebaseApp?.initialized) {
        callback();
    } else {
        setTimeout(() => waitForFirebase(callback), 100);
    }
}

// Chat functionality
waitForFirebase(() => {
    console.log('🔥 Firebase ready, initializing chat...');

    const { db, collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, serverTimestamp, updateDoc } = window.firebaseApp;

    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const startChatBtn = document.getElementById('startChatBtn');

    // FORCE REMOVE active class on load (cache fix)
    chatWindow.classList.remove('active');
    console.log('🔧 Forced removal of active class on init');

    let currentTicketId = null;
    let unsubscribeMessages = null;

    // Toggle chat
    chatToggle.addEventListener('click', async () => {
        console.log('🔵 Chat toggle clicked');
        chatWindow.classList.toggle('active');

        if (chatWindow.classList.contains('active')) {
            // Always show chat and input, hide form
            chatForm.style.display = 'none';
            chatMessages.style.display = 'flex';
            const inputContainer = document.querySelector('.chat-input-container');
            if (inputContainer) inputContainer.style.display = 'flex';

            if (currentTicketId) {
                console.log('🟢 Resuming existing ticket:', currentTicketId);
                listenForMessages(currentTicketId);
            } else {
                console.log('🟡 Ready for first message...');
            }
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Send message (Creates ticket if it doesn't exist)
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Display immediately in UI
        displayMessage(message, false);
        chatInput.value = '';

        try {
            if (!currentTicketId) {
                console.log('🟢 Creating ticket with first message...');
                const ticketRef = await addDoc(collection(db, 'supportTickets'), {
                    userId: 'web_' + Date.now(),
                    userRole: 'client',
                    userName: 'Website Visitor',
                    userEmail: 'Not provided',
                    userLocation: 'Not provided',
                    subject: 'Landing Page Inquiry',
                    status: 'open',
                    source: 'Página Web',
                    createdAt: serverTimestamp(),
                    lastMessageAt: serverTimestamp(),
                    unreadByClient: 0,
                    unreadByAdmin: 1
                });
                currentTicketId = ticketRef.id;
                console.log('✅ Ticket created:', currentTicketId);
                listenForMessages(currentTicketId);
            }

            // Send to Firestore
            await addDoc(collection(db, 'supportTickets', currentTicketId, 'messages'), {
                senderId: 'web_visitor',
                senderName: 'Visitor',
                senderRole: 'client',
                message: message,
                timestamp: serverTimestamp(),
                read: false
            });

            // Update ticket
            await updateDoc(doc(db, 'supportTickets', currentTicketId), {
                lastMessageAt: serverTimestamp(),
                unreadByAdmin: 1,
                status: 'open'
            });

            console.log('✅ Message sent');
        } catch (error) {
            console.error('❌ Error sending message:', error);
        }
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    console.log('✅ Chat initialized');
});
