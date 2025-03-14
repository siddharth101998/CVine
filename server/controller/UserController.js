//const bcrypt = require('bcrypt');
const User = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const user = await User.findById(id).select("-password"); // Exclude password from response
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const incrementLoginCount = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $inc: { loggedInCount: 1 } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, message: "Login count updated.", data: user });
    } catch (error) {
        console.error("Error updating login count:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists." });
        }

        //const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: password,
            userType: "Normal"
        });

        await newUser.save();
        console.log("usercreated")
        res.status(201).json({ success: true, message: "User created successfully.", data: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, fullName, badges } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (username) user.username = username;
        if (fullName) user.fullName = fullName;
        if (badges) user.badges = badges;


        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({ success: true, message: "User details updated successfully.", data: user });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email " });
        }

        res.status(200).json({
            message: "Login successful!",
            user: user
        });

    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    createUser,
    updateUser,
    getUserProfile,
    incrementLoginCount, loginUser
};
