import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from '@/services/auth';
import { IUserInputDTO } from '@/interfaces/IUser';
import { IRestaurantRoleDTO } from '@/interfaces/IRestaurantRole';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import { eq } from 'lodash';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/create_managers',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        phone: Joi.string().required(),
        role: Joi.string().required(),
        status:Joi.string().required(),
        restaurant: Joi.string().required(),
      }),
    }), middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger:Logger = Container.get('logger');
      logger.debug('Calling Create Managers endpoint for from admin with body: %o', req.body );
      try {
        const isValidRole = await middlewares.checkRole(req, "Admin", next)
        if(isValidRole){
          const otpServiceInstance = Container.get(AuthService);
          const { user } = await otpServiceInstance.SignUp(req.body as IRestaurantRoleDTO);
          return res.status(201).json({ user });
        }else{
          return res.json("Not Authorized")
        }
      } catch (e) {
        logger.error('error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger:Logger = Container.get('logger');
      logger.debug('Calling Sign-In endpoint with body: %o', req.body);
      try {
        const { username, password } = req.body;
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.SignIn(username, password);
        return res.json({ user, token }).status(200);
      } catch (e) {
        logger.error('error: %o',  e );
        return next(e);
      }
    },
  );

  route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
    const logger:Logger = Container.get('logger');
    logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
    try {
      return res.status(200).end();
    } catch (e) {
      logger.error('error %o', e);
      return next(e);
    }
  });
};
