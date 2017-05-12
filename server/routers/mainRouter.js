import express from 'express';
const mainRouter = express.Router();
import { mainController } from '../controllers';

mainRouter.get('/', mainController.index);
mainRouter.get('/about', mainController.getAbout);
export {
    mainRouter
}