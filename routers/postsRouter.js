import express from "express";
import { index, show, create, update, modify, destroy } from '../controllers/postControllers.js';

const router = express.Router();


router.get('/', index);
router.get('/:id', show);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id', modify);
router.delete('/:id', destroy);


export default router;

