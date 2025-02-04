import { db } from './firebaseConfig';
import { TestSession } from './types';
import { collection, doc, writeBatch, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export const testsService = {
  // Save completed test results and update the participant's status atomically.
  async saveTestResults(participantId: string, testSession: TestSession): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Delete old test results for this participant
      const testResultsRef = collection(db, 'testResults');
      const oldResultsQuery = query(testResultsRef, where('participantId', '==', participantId));
      const snapshot = await getDocs(oldResultsQuery);
      snapshot.docs.forEach(docSnap => {
        batch.delete(docSnap.ref);
      });

      // Exclude any participantId already present in testSession
      const { participantId: _ignore, ...sessionData } = testSession;

      // Create a new document reference in 'testResults'
      const testResultRef = doc(collection(db, 'testResults'));
      batch.set(testResultRef, {
        ...sessionData,
        participantId,             // Use the explicit participant identifier
        timestamp: serverTimestamp() // Use server timestamp for consistency
      });

      // Prepare updating the participant document.
      const participantRef = doc(db, 'participants', participantId);
      batch.update(participantRef, {
        hasCompletedTest: true,
        lastTestDate: serverTimestamp(),
      });

      // Commit the batch to ensure both operations succeed or fail together.
      await batch.commit();
    } catch (error) {
      console.error('Error saving test results:', error);
      throw error;
    }
  }
};
