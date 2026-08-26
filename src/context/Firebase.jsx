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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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

  await setDoc(
    userRef,
    {
      email: user.email,
      username: user.displayName || "Anonymous",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

const signupUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

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
  if (!userId) {
    throw new Error("User must be logged in to create a blog post.");
  }

  const newBlog = {
    userId,
    title,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "blogs"), newBlog);

  return docRef;
};

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          try {
            await createUserInFirestore(currentUser);
          } catch (error) {
            console.error("User profile error:", error);
          }
        }
      },
    );

    return unsubscribe;
  }, []);

  const logoutUser = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPassword,
        signinWithEmailAndPassword,
        signinWithGoogle,
        createBlogPost,
        isLoggedIn: !!user,
        user,
        logoutUser,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
