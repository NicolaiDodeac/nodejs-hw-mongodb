import ContactsCollection from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage: limit = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * limit;

  const contactsQuery = ContactsCollection.find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }

  const data = await contactsQuery;
  const count = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();
  const paginationData = calcPaginationData({ count, page, perPage: limit });

  return {
    page,
    perPage: limit,
    ...paginationData,
    count,
    data,
  };
};

export const getContactsById = (id) => ContactsCollection.findById(id);

export const getContact = (filter) => ContactsCollection.findOne(filter);

export const postContact = (payload) => ContactsCollection.create(payload);

export const upsertContact = async (filter, payload, options = {}) => {
  const result = await ContactsCollection.findOneAndUpdate(filter, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  return {
    data: result.value,
    isNew: Boolean(result.lastErrorObject.upserted),
  };
};

export const deleteContact = (filter) =>
  ContactsCollection.findByIdAndDelete(filter);

export const upsertContactById = async (_id, payload, options = {}) => {
  const result = await ContactsCollection.findByIdAndUpdate({ _id }, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  return {
    data: result.value,
    isNew: Boolean(result.lastErrorObject.upserted),
  };
};
