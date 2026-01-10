import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export interface Issue {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    type: 'technical' | 'payment' | 'service' | 'other';
    title: string;
    description: string;
    orderId?: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: any;
    updatedAt: any;
    resolvedAt?: any;
    adminNotes?: string;
}

class IssueService {
    private issuesCollection = collection(db, 'issues');

    async createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const docRef = await addDoc(this.issuesCollection, {
                ...issueData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            console.log('✅ Issue created:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('❌ Error creating issue:', error);
            throw error;
        }
    }

    async getUserIssues(userId: string): Promise<Issue[]> {
        try {
            const q = query(this.issuesCollection, where('userId', '==', userId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
        } catch (error) {
            console.error('❌ Error fetching user issues:', error);
            return [];
        }
    }

    async getAllIssues(): Promise<Issue[]> {
        try {
            const snapshot = await getDocs(this.issuesCollection);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
        } catch (error) {
            console.error('❌ Error fetching all issues:', error);
            return [];
        }
    }

    async updateIssueStatus(issueId: string, status: Issue['status'], adminNotes?: string): Promise<void> {
        try {
            const issueRef = doc(db, 'issues', issueId);
            const updates: any = {
                status,
                updatedAt: serverTimestamp(),
            };

            if (adminNotes) {
                updates.adminNotes = adminNotes;
            }

            if (status === 'resolved' || status === 'closed') {
                updates.resolvedAt = serverTimestamp();
            }

            await updateDoc(issueRef, updates);
            console.log('✅ Issue updated:', issueId);
        } catch (error) {
            console.error('❌ Error updating issue:', error);
            throw error;
        }
    }
}

export const issueService = new IssueService();
