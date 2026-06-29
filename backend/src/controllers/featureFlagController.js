import FeatureFlag from '../models/FeatureFlag.js';

export const getFlags = async (req, res, next) => {
  try {
    const organisationId = req.user.organisation._id || req.user.organisation;
    const flags = await FeatureFlag.find({ organisation: organisationId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { flags, count: flags.length } });
  } catch (error) {
    next(error);
  }
};

export const createFlag = async (req, res, next) => {
  try {
    const { feature_key, description, enabled } = req.body;
    const organisationId = req.user.organisation._id || req.user.organisation;

    if (!feature_key) {
      return res.status(400).json({ success: false, message: 'Feature key is required.' });
    }

    const flag = await FeatureFlag.create({
      feature_key: feature_key.trim().toLowerCase(),
      description: description ? description.trim() : '',
      enabled: enabled !== undefined ? enabled : false,
      organisation: organisationId,
      createdBy: req.user.id,
    });

    await flag.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Feature flag created successfully.',
      data: { flag },
    });
  } catch (error) {
    next(error);
  }
};

export const updateFlag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { feature_key, description, enabled } = req.body;
    const organisationId = req.user.organisation._id || req.user.organisation;

    const flag = await FeatureFlag.findOne({ _id: id, organisation: organisationId });
    if (!flag) {
      return res.status(404).json({ success: false, message: 'Feature flag not found.' });
    }

    if (feature_key !== undefined) flag.feature_key = feature_key.trim().toLowerCase();
    if (description !== undefined) flag.description = description.trim();
    if (enabled !== undefined) flag.enabled = enabled;

    await flag.save();
    await flag.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Feature flag updated successfully.',
      data: { flag },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFlag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organisationId = req.user.organisation._id || req.user.organisation;

    const flag = await FeatureFlag.findOneAndDelete({ _id: id, organisation: organisationId });
    if (!flag) {
      return res.status(404).json({ success: false, message: 'Feature flag not found.' });
    }

    res.status(200).json({ success: true, message: 'Feature flag deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const checkFlag = async (req, res, next) => {
  try {
    const { feature_key, organisationId } = req.query;

    if (!feature_key || !organisationId) {
      return res.status(400).json({
        success: false,
        message: 'feature_key and organisationId are required.',
      });
    }

    const flag = await FeatureFlag.findOne({
      feature_key: feature_key.trim().toLowerCase(),
      organisation: organisationId,
    });

    res.status(200).json({
      success: true,
      data: {
        feature_key: feature_key.trim().toLowerCase(),
        enabled: flag ? flag.enabled : false,
        exists: !!flag,
      },
    });
  } catch (error) {
    next(error);
  }
};