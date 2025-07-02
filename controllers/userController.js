import userModel from "../models/userModel.js";

export const updateProfileController = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating profile", error });
  }
};
