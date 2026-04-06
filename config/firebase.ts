import { initializeApp } from "firebase/app";
// 1. ADD THIS LINE
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAfDuA7YNUHrxhlcMsj8dFl6shT4pQw8YM",
  authDomain: "fordago-f0028.firebaseapp.com",
  projectId: "fordago-f0028",
  // 2. ADD THIS LINE (Check your Firebase Console for the exact URL)
  databaseURL: "https://fordago-f0028-default-rtdb.asia-southeast1.firebasedatabase.app", 
  storageBucket: "fordago-f0028.firebasestorage.app",
  messagingSenderId: "886761925170",
  appId: "1:886761925170:web:c7224f154d43e23ba16a2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. ADD AND EXPORT THIS
export const database = getDatabase(app);