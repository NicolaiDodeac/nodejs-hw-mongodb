import {
  deleteContact,
  getContact,
  getContacts,
  postContact,
  upsertContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage, sortBy, sortOrder } = req.query;
  const { _id: userId } = req.user;

  const filter = parseFilterParams(req.query);
  filter.userId = userId;
  const data = await getContacts({ page, perPage, sortBy, sortOrder, filter });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await getContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id: ${id}!`,
    data,
  });
};

export const postContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const data = await postContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};
export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { data } = await upsertContact(
    { _id: id, userId },
    { ...req.body, userId },
  );

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};
export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await deleteContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const { data, isNew } = await upsertContact(
    { _id: id, userId },
    { ...req.body, userId },
    { upsert: true },
  );
  const status = isNew ? 201 : 200;
  const message = isNew
    ? 'Contact was inserted successfully'
    : 'Contact was updated successfully';

  res.json({
    status,
    message,
    data,
  });
};
