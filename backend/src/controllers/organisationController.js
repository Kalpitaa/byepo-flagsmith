import Organisation from '../models/Organisation.js';

export const getOrganisations = async (req, res, next) => {
  try {
    const organisations = await Organisation.find().select('_id name slug').sort({ name: 1 });
    res.status(200).json({ success: true, data: { organisations, count: organisations.length } });
  } catch (error) {
    next(error);
  }
};