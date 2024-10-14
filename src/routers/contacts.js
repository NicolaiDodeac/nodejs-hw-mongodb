import { Router } from 'express';
import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get(
  '/contacts',
  ctrlWrapper(contactsController.getContactsController),
);
contactsRouter.get(
  '/contacts/:id',
  isValidId,
  ctrlWrapper(contactsController.getContactsByIdController),
);
contactsRouter.post(
  '/contacts',
  ctrlWrapper(contactsController.postContactController),
);

contactsRouter.patch(
  '/contacts/:id',
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
