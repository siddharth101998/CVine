import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios"; // Import Axios
import { useAuth } from "./context/AuthContext";
// Register User

export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Call backend API to create the user in MongoDB
        await axios.post("http://localhost:5002/user/", {
            email,
            password,

        });

        return user;
    } catch (error) {
        throw error;
    }
};

// Login User
export const loginUser = async (email, password) => {
    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
