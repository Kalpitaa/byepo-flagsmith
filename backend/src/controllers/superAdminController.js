import { generateToken } from '../config/jwt.js';
import Organisation from '../models/Organisation.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (email !== process.env.SUPER_ADMIN_EMAIL || password !== process.env.SUPER_ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken({ role: 'super_admin', email: process.env.SUPER_ADMIN_EMAIL });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { token, user: { email: process.env.SUPER_ADMIN_EMAIL, role: 'super_admin' } },
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganisation = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Organisation name is required.' });
    }

    const organisation = await Organisation.create({ name: name.trim() });

    res.status(201).json({
      success: true,
      message: 'Organisation created successfully.',
      data: { organisation },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganisations = async (req, res, next) => {
  try {
    const organisations = await Organisation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { organisations, count: organisations.length },
    });
  } catch (error) {
    next(error);
  }
};