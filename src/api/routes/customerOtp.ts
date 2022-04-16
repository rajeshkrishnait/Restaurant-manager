import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import OtpService from '@/services/OTP';
import { IOtp } from '@/interfaces/IOtp';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';

const route = Router();

export default (app:Router) =>{
    app.use('/otp', route)
    route.post('/email_route', 
    celebrate({
        body:Joi.object({
            email: Joi.string().required(),
        }), 
    }), async (req:Request, res:Response, next:NextFunction) =>{
        const logger:Logger = Container.get('logger');
      logger.debug('Calling Otp endpoint for Sending Otp through email with body: %o', req.body );
      try {
        const otpServiceInstance = Container.get(OtpService);
        const { otpDetails } = await otpServiceInstance.SendOtpByMail(req.body.email);
        return res.status(201).json({ otpDetails});
      } catch (e) {
        logger.error('error: %o', e);
        return next(e);
      }
    });
    route.post('/verify_otp', 
    celebrate({
        body:Joi.object({
            email: Joi.string().required(),
        }), 
    }), async (req:Request, res:Response, next:NextFunction) =>{
        const logger:Logger = Container.get('logger');
      logger.debug('Calling Otp endpoint for Sending Otp through email with body: %o', req.body );
      try {
        const otpServiceInstance = Container.get(OtpService);
        const { status, token } = await otpServiceInstance.verify(req.body);
        return res.status(201).json({ status});
      } catch (e) {
        logger.error('error: %o', e);
        return next(e);
      }
    });
};