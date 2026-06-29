import { generateToken } from '../config/jwt.js';
import User from '../models/User.js';
import Organisation from '../models/Organisation.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, organisationId } = req.body;

    if (!name || !email || !password || !organisationId) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and organisation are required.',
      });
    }

    const organisation = await Organisation.findById(organisationId);
    if (!organisation) {
      return res.status(404).json({ success: false, message: 'Organisation not found.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'org_admin',
      organisation: organisationId,
    });

    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organisation: { id: organisation._id, name: organisation.name },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('organisation');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (user.role !== 'org_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This portal is for Organisation Admins only.',
      });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organisation: { id: user.organisation._id, name: user.organisation.name },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { user: req.user } });
  } catch (error) {
    next(error);
  }
};