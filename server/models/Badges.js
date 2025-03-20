const mongoose = require("mongoose");

const badgesSchema = new mongoose.Schema(
  {
    badgeLogo: { type: String, required: true },
    badgeConditions: [
      {
        field: { type: String, required: true },
        operator: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Badge", badgesSchema);
