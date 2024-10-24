// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import "firebase/auth";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx676YkPSJXva50Tm3uACfL8lhcyvfoIU",
  authDomain: "iteamoa.firebaseapp.com",
  projectId: "iteamoa",
  storageBucket: "iteamoa.appspot.com",
  messagingSenderId: "331957991763",
  appId: "1:331957991763:web:3cedac477038c7638ac9a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;