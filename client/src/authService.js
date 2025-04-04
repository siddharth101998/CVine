import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import axios from "axios"; // Import Axios
import { useAuth } from "./context/AuthContext";
// Register User

export const registerUser = async (email, password, firstName) => {
  try {
    console.log("register started", password);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log(" firebase register finsihed");
    // Call backend API to create the user in MongoDB
    const res = await axios.post("http://localhost:5002/user/", {
      email,
      password,
      firstName
    });

    return res.data.data;
  } catch (error) {
    throw error;
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    return user;
  } catch (error) {
    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
