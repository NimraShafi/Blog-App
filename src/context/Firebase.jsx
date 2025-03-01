import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFin2qo2Y2kX6PmhwG79CnhqHQEfjYUg0",
  authDomain: "blog-application-3830f.firebaseapp.com",
  projectId: "blog-application-3830f",
  storageBucket: "blog-application-3830f.firebasestorage.app",
  messagingSenderId: "803079259789",
  appId: "1:803079259789:web:a7e29006c63071d77104c4",
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

const createUserInFirestore = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  const userData = {
    email: user.email,
    username: user.displayName || "Anonymous",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, userData, { merge: true });
};

const signupUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  await createUserInFirestore(userCredential.user);
  return userCredential;
};

const signinWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

const signinWithGoogle = async () => {
  const userCredential = await signInWithPopup(firebaseAuth, googleProvider);
  await createUserInFirestore(userCredential.user);
  return userCredential;
};

const createBlogPost = async (userId, title, content) => {
  if (!userId) throw new Error("User must be logged in to create a blog post.");

  const blogsCollection = collection(db, "blogs");

  const newBlog = {
    userId, 
    title,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(blogsCollection, newBlog);
  console.log("Blog Created with ID:", docRef.id);
  return docRef;
};

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setUser(user);
      if (user) {
        await createUserInFirestore(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  const logoutUser = async () => {
    try {
      await signOut(firebaseAuth); 
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPassword,
        signinWithEmailAndPassword,
        signinWithGoogle,
        createBlogPost,
        isLoggedIn,
        user,
        logoutUser,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
