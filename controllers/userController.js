const bcrypt = require("bcrypt");
const prisma = require("../config/prismaClient");
const userSchema = require("../Validations/userValidation");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

// Create User
const createUser = async (req, res) => {
  try {
    const { email, password, firstname, middlename, lastname } = req.body;

    // Validate request body using Joi
    const { error } = userSchema.userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        middlename,
      },
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email},
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({ message: "Login successfully", token });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createUser, loginUser };
