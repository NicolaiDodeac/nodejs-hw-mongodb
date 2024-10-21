import { typeList } from '../constants/contacts.js';

const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) => typeList.includes(contactType);

  if (isContactType(contactType)) return contactType;
};

const parseIsFavourite = (isFavourite) => {
  const favorites = isFavourite === 'true' ? true : false;
  return favorites;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
