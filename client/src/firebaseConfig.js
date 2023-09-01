// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD626MbZ0v65GebZ8qM5MN17jiyLKlYZP8",
    authDomain: "inventory-b0b4e.firebaseapp.com",
    projectId: "inventory-b0b4e",
    storageBucket: "inventory-b0b4e.appspot.com",
    messagingSenderId: "710038201502",
    appId: "1:710038201502:web:4ba0e04916ba0ecc53478f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);