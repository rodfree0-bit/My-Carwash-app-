import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    User
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'washer' | 'client';
    phone?: string;
    address?: string;
    savedAddresses?: Array<{ id: string; label: string; address: string; icon: string }>;
    savedVehicles?: any[];
    savedCards?: Array<{ id: string; brand: string; last4: string; expiry: string }>;
    avatar?: string;
    createdAt: string;
}

class AuthService {
    // Register new user
    async register(email: string, password: string, userData: Partial<UserProfile>) {
        console.log('🔵 Starting registration for:', email);

        try {
            // Create Firebase Auth user
            console.log('📝 Creating Firebase Auth user...');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('✅ Firebase Auth user created:', user.uid);

            // Send email verification
            console.log('📧 Sending verification email...');
            await sendEmailVerification(user);
            console.log('✅ Verification email sent');

            // Update display name
            if (userData.name) {
                console.log('👤 Updating display name...');
                await updateProfile(user, { displayName: userData.name });
                console.log('✅ Display name updated');
            }

            // Check for Washer Approval Invitation
            const emailKey = email.toLowerCase();
            const approvedRef = doc(db, 'approved_washers', emailKey);
            const approvedSnap = await getDoc(approvedRef);

            let finalRole = userData.role || 'client';
            let finalData: any = { ...userData };

            if (approvedSnap.exists()) {
                console.log('🎉 Found approved washer invitation during registration!');
                const approvedData = approvedSnap.data();
                finalRole = 'washer';
                finalData = {
                    ...finalData,
                    ...approvedData, // Merge washer data (license, vehicle, etc)
                    status: 'Active' // Ensure active status
                };

                // Delete invitation to prevent reuse
                await deleteDoc(approvedRef);
            }

            // Create user profile in Firestore
            const userProfile: UserProfile = {
                id: user.uid,
                email: user.email!,
                name: finalData.name || 'User',
                role: finalRole as any,
                phone: finalData.phone || '',
                address: finalData.address || '',
                avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalData.name || 'User')}&background=136dec&color=fff&size=200&bold=true`,
                createdAt: new Date().toISOString(),
                // Add washer specific fields if role is washer
                ...(finalRole === 'washer' ? {
                    driverLicense: finalData.driverLicense,
                    insuranceNumber: finalData.insuranceNumber,
                    vehiclePlate: finalData.vehiclePlate,
                    vehicleModel: finalData.vehicleModel,
                    completedJobs: 0,
                    rating: 5.0,
                    status: 'Active',
                    joinedDate: new Date().toISOString()
                } : {
                    savedVehicles: [] // Client specific
                })
            } as any;

            console.log('💾 Saving user profile to Firestore...', userProfile);
            await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
            console.log('✅ User profile saved to Firestore successfully!');

            // Verify it was saved
            const savedDoc = await getDoc(doc(db, 'users', user.uid));
            if (savedDoc.exists()) {
                console.log('✅ VERIFIED: User profile exists in Firestore');
            } else {
                console.error('❌ ERROR: User profile NOT found in Firestore after save!');
                throw new Error('Failed to save user profile to Firestore');
            }

            return { user, profile: userProfile };
        } catch (error: any) {
            console.error('❌ Registration error:', error);
            throw new Error(error.message || 'Registration failed');
        }
    }

    // Login user
    async login(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2FA: Verificar que el email esté verificado
            if (!user.emailVerified) {
                throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
            }

            // Get user profile from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (!userDoc.exists()) {
                // AUTO-RECOVERY FOR SUPER ADMIN
                if (this.isAdminEmail(user.email || '')) {
                    console.warn('⚠️ Admin profile missing in Firestore. Recreating automatically...');
                    const adminProfile: UserProfile = {
                        id: user.uid,
                        email: user.email!,
                        name: user.displayName || 'Admin',
                        role: 'admin',
                        createdAt: new Date().toISOString(),
                        avatar: user.photoURL || `https://ui-avatars.com/api/?name=Admin&background=136dec&color=fff`
                    };
                    await setDoc(doc(db, 'users', user.uid), adminProfile, { merge: true });
                    return { user, profile: adminProfile };
                }

                throw new Error('User profile not found. Please contact support.');
            }

            return { user, profile: userDoc.data() as UserProfile };
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed');
        }
    }

    // Logout user
    async logout() {
        try {
            await signOut(auth);
        } catch (error: any) {
            console.error('Logout error:', error);
            throw new Error(error.message || 'Logout failed');
        }
    }

    // Reset password
    async resetPassword(email: string) {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            console.error('Password reset error:', error);
            throw new Error(error.message || 'Password reset failed');
        }
    }

    // Get current user profile
    async getCurrentUserProfile(userId: string): Promise<UserProfile | null> {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return userDoc.data() as UserProfile;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error; // Propagate error to prevent data wipe in App.tsx
        }
    }

    // Check if email is admin
    isAdminEmail(email: string): boolean {
        const adminEmails = ['rodfree0@gmail.com']; // Super admin emails
        return adminEmails.includes(email.toLowerCase());
    }

    // Resend verification email
    async resendVerificationEmail(user: User) {
        try {
            if (user.emailVerified) {
                throw new Error('Email is already verified');
            }
            await sendEmailVerification(user);
            console.log('✅ Verification email resent');
        } catch (error: any) {
            console.error('Error resending verification email:', error);
            throw new Error(error.message || 'Failed to resend verification email');
        }
    }
}

export const authService = new AuthService();
