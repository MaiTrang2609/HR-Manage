import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgZ0S3cgiV_VIwtIaaPkrdpqZFRYpe2VU",
  authDomain: "hr-manager-service-gem.firebaseapp.com",
  projectId: "hr-manager-service-gem",
  storageBucket: "hr-manager-service-gem.appspot.com",
  messagingSenderId: "286126029922",
  appId: "1:286126029922:web:4c0730d4a117ed0ba3253b",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;
