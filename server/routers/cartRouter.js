import { cartController } from '../controllers';
import passport from 'passport';
import {isAuthenticated} from '../middleware';
import { Router } from "express";
const router = Router();

router.get("/add-to-cart/:productId",isAuthenticated, cartController.addToCart);
router.get("/", isAuthenticated, cartController.getCart);

export default router;