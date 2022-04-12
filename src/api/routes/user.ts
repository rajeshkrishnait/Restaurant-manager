import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
    return res.json({ user: req.currentUser }).status(200);
  });

  route.put('/update_profile', 
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
    }),
  }),
  middlewares.isAuth, middlewares.updateUserProfile, middlewares.attachCurrentUser, (req: Request, res: Response) =>{
    return res.json({ user: req.currentUser }).status(200);
  });
};
