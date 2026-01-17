const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { email, password, nombre, rol } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, nombre, rol });
    await user.save();
    res.json({ message: "Usuario registrado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
