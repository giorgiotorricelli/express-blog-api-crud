import express from "express";
import { index, show, create, update, modify, destroy } from '../controllers/postControllers.js';
import errorHandlerShowAndDel from "../middlewares/errorHandler.js";

const router = express.Router();

router.get('/', index);
router.get('/:slug', errorHandlerShowAndDel, show);
router.post('/', create);
router.put('/:slug', update);
router.patch('/:slug', modify);
router.delete('/:slug', errorHandlerShowAndDel, destroy);


export default router;

