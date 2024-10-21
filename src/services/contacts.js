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

  const contactsQuery = ContactsCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const data = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const count = await ContactsCollection.countDocuments(
    contactsQuery.getFilter(),
  );
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

export const postContact = (payload) => ContactsCollection.create(payload);

export const upsertContact = async (id, payload, options = {}) => {
  const result = await ContactsCollection.findByIdAndUpdate(id, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  return {
    data: result.value,
    isNew: Boolean(result.lastErrorObject.upserted),
  };
};

export const deleteContact = (id) => ContactsCollection.findByIdAndDelete(id);

// export const upsertContact = async (_id, payload, options = {}) => {
//   const result = await ContactsCollection.findOneAndUpdate({ _id }, payload, {
//     new: true,
//     includeResultMetadata: true,
//     ...options,
//   });

//   return {
//     data: result.value,
//     isNew: Boolean(result.lastErrorObject.upserted),
//   };
