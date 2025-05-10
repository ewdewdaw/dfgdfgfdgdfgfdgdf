import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvIcTg-fl-nCtt-itk9pnikxACwTB14oM",
  authDomain: "omebgle.firebaseapp.com",
  databaseURL: "https://omebgle-default-rtdb.firebaseio.com/",
  projectId: "omebgle",
  storageBucket: "omebgle.appspot.com",
  messagingSenderId: "128737467266",
  appId: "1:128737467266:web:901505ef15ec99e2074d9b",
  measurementId: "G-7229HP84V5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };