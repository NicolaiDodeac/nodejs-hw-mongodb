import createHttpError from 'http-errors';
import { env } from '../utils/env.js';
import {
  deleteContact,
  getContact,
  getContacts,
  postContact,
  upsertContact,
} from '../services/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

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
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const data = await postContact({ ...req.body, userId, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
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
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const { data, isNew } = await upsertContact(
    { _id: id, userId },
    { ...req.body, userId, photo: photoUrl },
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
export const patchContactController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await upsertContact(
    { _id: id, userId },
    {
      ...req.body,
      photo: photoUrl,
    },
  );

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result,
  });
};
