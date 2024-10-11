import { getContacts, getContactsById } from '../services/contacts.js';
import createHttpError from 'http-errors';
export const getContactsController = async (req, res, next) => {
  const data = await getContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { id } = req.params;
  const data = await getContactsById(id);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id: ${id}!`,
    data,
  });
};
