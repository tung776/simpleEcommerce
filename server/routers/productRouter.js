import { productController } from '../controllers';
import passport from 'passport';
import {isAuthenticated} from '../middleware';
import { Router } from "express";
const router = Router();


router.get('/', productController.getProducts);
router.get('/:categoryId', productController.getProductByCategoryId);
router.get('/detail/:productId', productController.getDetailProduct);

export default router;