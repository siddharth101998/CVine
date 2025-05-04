//const bcrypt = require('bcrypt');
const User = require("../models/User");
const Badges = require("../models/Badges");

const getUserProfile = async (req, res) => {
  try {
    console.log("fecth started");
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const user = await User.findById(id).select("-password"); // Exclude password from response
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const incrementLoginCount = async (userId) => {
  try {
    /* const { id } = req.params;
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });}*/

    /* 
        if (!user) {
          return res
          .status(404)
          .json({ success: false, message: "User not found." });
          } */

    let incUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { loggedInCount: 1 } },
      { new: true }
    );
    return incUser;
    /* res
      .status(200)
      .json({ success: true, message: "Login count updated.", data: user }); */
  } catch (error) {
    console.error("Error updating login count:", error);
    return false;
    /* res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message }); */
  }
};

const createUser = async (req, res) => {
  try {
    console.log("create started")
    const { email, password, firstName } = req.body;
    console.log(req.body);
    if (!email || !password || !firstName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    //const hashedPassword = await bcrypt.hash(password, 10);
    console.log(firstName)
    const newUser = new User({
      email,
      password: password,
      username:firstName,
      userType: "Normal",
    });

    await newUser.save();
    console.log(newUser, "new user");
    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, fullName, badges } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (username) user.username = username;
    if (fullName) user.fullName = fullName;
    if (badges) user.badges = badges;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "User details updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("login started")

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email/User does not exists" });
    }
    const incrementLoginCountUser = await incrementLoginCount(user.id);

    if (!incrementLoginCount) {
      return res.status(400).json({ message: "Login count not updated" });
    }

    const badges = await Badges.find({});
    const newBadgesAwarded = [];

    for (const badge of badges) {
      const isConditionMet = checkBadgeConditions(
        incrementLoginCountUser,
        badge.badgeConditions
      );

      if (isConditionMet && !user.badges.includes(badge._id)) {
        newBadgesAwarded.push({
          badgeId: badge._id,
          badgeLogo: badge.badgeLogo,
        });
        user.badges.push(badge._id);
      }
    }

    if (newBadgesAwarded.length > 0) {
      await user.save();
    }

    res.status(200).json({
      message: "Login successful!",
      user: incrementLoginCountUser,
      badgesAwarded: newBadgesAwarded,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const checkBadgeConditions = (user, condition) => {
  console.log(condition, "condition");
  const { field, operator, value } = condition[0];

  if (
    user[field] === undefined ||
    user[field] === null ||
    !operator ||
    value === undefined ||
    value === null
  ) {
    return false;
  }

  switch (operator) {
    case ">":
      return user[field] > value;
    case ">=":
      return user[field] >= value;
    case "<":
      return user[field] < value;
    case "<=":
      return user[field] <= value;
    case "===":
      return user[field] == value;
    default:
      return false;
  }
};

module.exports = {
  createUser,
  updateUser,
  getUserProfile,
  incrementLoginCount,
  loginUser,
};
