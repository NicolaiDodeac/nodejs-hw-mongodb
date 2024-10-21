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

const contactsRouter = Router();

contactsRouter.get(
  '/contacts',
  parsePaginationParams,
  ctrlWrapper(contactsController.getContactsController),
);
contactsRouter.get(
  '/contacts/:id',
  isValidId,
  ctrlWrapper(contactsController.getContactsByIdController),
);
contactsRouter.post(
  '/contacts',
  validateBody(addContactSchema),
  ctrlWrapper(contactsController.postContactController),
);

contactsRouter.patch(
  '/contacts/:id',
  validateBody(updateContactSchema),
  isValidId,
  ctrlWrapper(contactsController.patchContactController),
);

contactsRouter.delete(
  '/contacts/:id',
  isValidId,
  ctrlWrapper(contactsController.deleteContactController),
);

// contactsRouter.put(
//   '/contacts/:id',
//   isValidId,
//   ctrlWrapper(contactsController.upsertContactController),
// );

export default contactsRouter;
