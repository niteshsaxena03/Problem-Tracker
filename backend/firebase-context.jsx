import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  where,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-B--d14TxwKm8KwP-egdarpA73YUGDRY",
  authDomain: "problem-tracker-cefc5.firebaseapp.com",
  projectId: "problem-tracker-cefc5",
  storageBucket: "problem-tracker-cefc5.firebasestorage.app",
  messagingSenderId: "120253727637",
  appId: "1:120253727637:web:128a14851ed6d72926ac9c",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  const getUserDetailsByEmail = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return userData;
      } else {
        console.warn("No matching documents.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      return null;
    }
  };

  const createUserDocument = async (name, email) => {
    try {
      const userRef = doc(db, "users", email);
      await setDoc(userRef, {
        name: name,
        email: email,
        unsolvedQuestions: [],
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  };

  const signUpUserWithEmailAndPassword = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await createUserDocument(name, email);
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const loginUserWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const logOut = () => {
    return signOut(firebaseAuth);
  };

  const isLoggedIn = !!user;

  return (
    <FirebaseContext.Provider
      value={{
        signUpUserWithEmailAndPassword,
        loginUserWithEmailAndPassword,
        isLoggedIn,
        user,
        logOut,
        getUserDetailsByEmail,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
