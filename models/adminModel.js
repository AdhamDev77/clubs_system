const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    admin_img: {
      type: String,
      required: true,
    },
    admin_name: {
      type: String,
      required: true,
    },
    admin_email: {
      type: String,
      required: true,
    },
    admin_password: {
      type: String,
      required: true,
    },
    admin_birth: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
