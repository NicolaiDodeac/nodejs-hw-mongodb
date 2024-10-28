import { Router } from 'express';
import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  addContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { parsePaginationParams } from '../middlewares/parsePaginationParams.js';
import { parseSortParamsDecorator } from '../utils/parceSortParamsDecorator.js';
import { sortByListContacts } from '../db/models/Contact.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get(
  '/',
  parsePaginationParams,
  parseSortParamsDecorator(sortByListContacts),
  ctrlWrapper(contactsController.getContactsController),
);
contactsRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(contactsController.getContactsByIdController),
);
contactsRouter.post(
  '/',
  validateBody(addContactSchema),
  ctrlWrapper(contactsController.postContactController),
);

contactsRouter.patch(
  '/:id',
  validateBody(updateContactSchema),
  isValidId,
  ctrlWrapper(contactsController.patchContactController),
);

contactsRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(contactsController.deleteContactController),
);

// contactsRouter.put(
//   '/:id',
//   isValidId,
//   ctrlWrapper(contactsController.upsertContactController),
// );

export default contactsRouter;
