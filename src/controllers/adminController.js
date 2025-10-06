const prisma = require("../config/db");

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delet user by id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update user by id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name,last_name, email, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { first_name,last_name, email, role },
    });

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getAllUsers,
  deleteUser,
  updateUser,
};
