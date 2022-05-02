import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Logger } from 'winston';
import { Container } from 'typedi'
import CustomerService from '@/services/customer';

const route = Router();

export default (app:Router)=>{
    app.use('/customer', route)
    route.get('/get_foods', 
    middlewares.isAuth,
    async (req:Request, res:Response, next:NextFunction) =>{
        const logger:Logger = Container.get('logger')
        logger.debug('calling get_foods endpoint by customer with body: %o', req.body )
        try{
            const isValidRole = await middlewares.checkRole(req, "Customer", next)
            if(isValidRole){
              const customerServiceInstance = Container.get(CustomerService);
              const { foodDetails } = await customerServiceInstance.getFoods();
              return res.status(201).json({ foodDetails });
            }else{
              return res.json("Not Authorized")
            }
        }catch(e){
            logger.error('error: %o', e);
            return next(e);
        }
    });
    route.post('/validate_restaurant', 
    async (req:Request, res:Response, next:NextFunction) =>{
        const logger:Logger = Container.get('logger')
        logger.debug('calling validate_restaurant endpoint by customer with body: %o', req.body )
        try{
              const customerServiceInstance = Container.get(CustomerService);
              const { accessToken } = await customerServiceInstance.validateRestaurant(req.body.qr_code);
              return res.status(201).json({ status:true, token:accessToken });
        }catch(e){
            logger.error('error: %o', e);
            return res.json({status:false, message:"Restaurant not validated"})
        }
    });
    route.post('/validate_dine',
    middlewares.resAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling validate Dining table endpoint by customer with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Customer", next)
        if(isValidRole){
            const customerServiceInstance = Container.get(CustomerService);
            const { accessToken } = await customerServiceInstance.validateDine(req.body.qr_code);
            return res.status(201).json({ status:true, token:accessToken });
          }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        return res.json({status:false,message:"Dine QR not valid"});
        }
    });

}