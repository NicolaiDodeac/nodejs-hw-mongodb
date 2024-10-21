import ContactsCollection from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({ page, perPage: limit }) => {
  const skip = (page - 1) * limit;
  const data = await ContactsCollection.find().skip(skip).limit(limit);
  const count = await ContactsCollection.find().countDocuments();
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
