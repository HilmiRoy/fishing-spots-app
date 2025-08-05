import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB90c-rE-Ii7Smlhllp47OUCVg1tLgn0pU",
  authDomain: "strike-zone-81dd0.firebaseapp.com",
  projectId: "strike-zone-81dd0",
  storageBucket: "strike-zone-81dd0.appspot.com",
  messagingSenderId: "802854048058",
  appId: "1:802854048058:web:fa7e9e0c90f50ae1238003",
  measurementId: "G-WK6DBYL8Q8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// --- Helper functions for AdminDashboard ---
export async function getPendingSpots() {
  const querySnapshot = await getDocs(collection(db, "fishingSpots"));
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(spot => spot.approved === false);
}

export async function approveSpot(spotId) {
  const spotRef = doc(db, "fishingSpots", spotId);
  await updateDoc(spotRef, { approved: true });
}

export async function rejectSpot(spotId) {
  const spotRef = doc(db, "fishingSpots", spotId);
  await deleteDoc(spotRef);
}

export async function getApprovedSpots() {
  const querySnapshot = await getDocs(collection(db, "fishingSpots"));
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(spot => spot.approved === true);
}

export async function deleteSpot(spotId) {
  const spotRef = doc(db, "fishingSpots", spotId);
  await deleteDoc(spotRef);
}