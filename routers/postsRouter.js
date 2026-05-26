import express from "express";
import { index, show, create, update, modify, destroy } from '../controllers/postControllers.js';

const router = express.Router();


router.get('/', index);
router.get('/:slug', show);
router.post('/', create);
router.put('/:slug', update);
router.patch('/:slug', modify);
router.delete('/:slug', destroy);


export default router;

