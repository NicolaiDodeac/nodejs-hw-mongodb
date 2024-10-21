import {
  deleteContact,
  getContacts,
  getContactsById,
  postContact,
  upsertContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
// import { parsePaginationParams } from '../middlewares/parsePaginationParams.js';

export const getContactsController = async (req, res) => {
  // const { page, perPage } = parsePaginationParams(req.query);
  const { page, perPage } = req.query;
  const data = await getContacts({ page, perPage });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
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

export const postContactController = async (req, res) => {
  const data = await postContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};
export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const { data } = await upsertContact(id, req.body);

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
  const data = await deleteContact(id);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

// export const upsertContactController = async (req, res) => {
//   const { id } = req.params;
//   const { data, isNew } = await upsertContact(id, req.body, { upsert: true });
//   const status = isNew ? 201 : 200;
//   const message = isNew
//     ? 'Contact was inserted successfully'
//     : 'Contact was updated successfully';

//   res.json({
//     status,
//     message,
//     data,
//   });
// };
