import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, getDoc, onSnapshot, serverTimestamp, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
        icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
            }
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.feature-card, .step, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Add hover effect to pricing cards
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        if (this.classList.contains('featured')) {
            this.style.transform = 'scale(1.05)';
        } else {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Download button placeholders (replace # with actual links)
const downloadButtons = [
    'appStoreBtnHero',
    'playStoreBtnHero',
    'appStoreBtnFooter',
    'playStoreBtnFooter'
];

downloadButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', (e) => {
            // Remove this alert and the preventDefault when you add real links
            e.preventDefault();
            alert('Add your App Store or Google Play Store link here!\n\nReplace the # in the href attribute with your actual store URL.');
        });
    }
});

// Support Chat Widget
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const startChatBtn = document.getElementById('startChatBtn');
const chatInputArea = document.querySelector('.chat-input-container'); // Corrected selector based on HTML

// Elements
const chatNameInput = document.getElementById('chatName');
const chatContactInput = document.getElementById('chatContact');
const chatLocationInput = document.getElementById('chatLocation');

// Toggle chat window
chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        checkChatState();
    }
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

function checkChatState() {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
        showChatInterface();
    } else {
        showFormInterface();
    }
}

function showFormInterface() {
    chatForm.style.display = 'flex';
    chatMessages.style.display = 'none';
    chatInputArea.style.display = 'none';
}

// REAL-TIME CHAT LOGIC (Firebase SDK)
let unsubscribe = null;

function addMessageToUI(text, type, id) {
    // Avoid duplicates
    if (document.getElementById(`msg-${id}`)) return;

    const msgDiv = document.createElement('div');
    msgDiv.id = `msg-${id}`;
    msgDiv.className = `chat-message ${type}`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function subscribeToMessages(ticketId) {
    if (unsubscribe) unsubscribe(); // Unsubscribe previous listener if any

    const q = query(
        collection(db, 'supportTickets', ticketId, 'messages'),
        orderBy('timestamp', 'asc')
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                const role = data.senderRole;
                const message = data.message;
                const id = change.doc.id;

                if (role === 'admin' || role === 'system') {
                    addMessageToUI(message, 'bot', id);
                } else if (role === 'client') {
                    addMessageToUI(message, 'user', id);
                }
            }
        });
    }, (error) => {
        console.error("Chat listener error:", error);
    });
}

function showChatInterface() {
    chatForm.style.display = 'none';
    chatMessages.style.display = 'block';
    chatInputArea.style.display = 'flex';

    // Initial clear
    chatMessages.innerHTML = '';
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'chat-message bot';
    welcomeDiv.innerHTML = '<p>Welcome! How can we help you today?</p>';
    chatMessages.appendChild(welcomeDiv);

    const ticketId = localStorage.getItem('supportTicketId');
    if (ticketId) {
        subscribeToMessages(ticketId);
    }

    setTimeout(() => chatInput.focus(), 100);
}

// Handle Form Submission
startChatBtn.addEventListener('click', () => {
    const name = chatNameInput.value.trim();
    const contact = chatContactInput.value.trim();
    const location = chatLocationInput.value.trim();

    if (!name || !contact) {
        alert('Please fill in Name and Phone/Email');
        return;
    }

    const userData = {
        name: name,
        contact: contact,
        location: location
    };

    localStorage.setItem('chatUser', JSON.stringify(userData));
    showChatInterface();
});

// Send message function
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Temporarily disable
    chatInput.disabled = true;
    chatSend.disabled = true;

    // Clear input
    chatInput.value = '';

    try {
        const userData = JSON.parse(localStorage.getItem('chatUser') || '{"name": "Visitor", "contact": "Unknown", "location": "Unknown"}');

        // STRATEGY: Use localStorage as primary source of truth for ticketId
        // This avoids dependency on Firestore index which may not be ready
        let ticketId = localStorage.getItem('supportTicketId');

        // Verify the ticket still exists and is open
        if (ticketId) {
            try {
                const ticketDoc = await getDoc(doc(db, 'supportTickets', ticketId));
                if (!ticketDoc.exists() || ticketDoc.data().status !== 'open') {
                    console.log("Stored ticket no longer valid, will create new one");
                    ticketId = null;
                    localStorage.removeItem('supportTicketId');
                }
            } catch (err) {
                console.warn("Error verifying ticket:", err);
                ticketId = null;
                localStorage.removeItem('supportTicketId');
            }
        }

        // Create new ticket if none found
        if (!ticketId) {
            const sourceInfo = `Landing Page - ${userData.location || 'No Location'} (${userData.contact})`;

            const docRef = await addDoc(collection(db, 'supportTickets'), {
                userId: 'web_visitor_' + Date.now(),
                userRole: 'client',
                userName: userData.name,
                userEmail: userData.contact,
                status: 'open',
                source: sourceInfo,
                createdAt: serverTimestamp(),
                lastMessageAt: serverTimestamp(),
                unreadByClient: 0,
                unreadByAdmin: 1
            });

            ticketId = docRef.id;
            console.log("Created new ticket:", ticketId);
            localStorage.setItem('supportTicketId', ticketId);
            subscribeToMessages(ticketId);
        } else {
            console.log("Using existing ticket:", ticketId);
        }

        // Send the message to the identified ticket
        if (ticketId) {
            await addDoc(collection(db, 'supportTickets', ticketId, 'messages'), {
                senderId: 'web_visitor_' + Date.now(),
                senderName: userData.name,
                senderRole: 'client', // Required for notification trigger
                message: message,
                timestamp: serverTimestamp(),
                read: false
            });

            // Update ticket metadata
            await updateDoc(doc(db, 'supportTickets', ticketId), {
                lastMessageAt: serverTimestamp(),
                unreadByAdmin: 1,
                status: 'open'
            });
        }

    } catch (error) {
        console.error('Error sending message:', error);
        const errorMessageDiv = document.createElement('div');
        errorMessageDiv.className = 'chat-message bot';
        errorMessageDiv.innerHTML = `<p>Error sending message. Please try again.</p>`;
        chatMessages.appendChild(errorMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } finally {
        // Re-enable input
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.focus();
    }
}

// Send on button click
chatSend.addEventListener('click', sendMessage);

// Send on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
