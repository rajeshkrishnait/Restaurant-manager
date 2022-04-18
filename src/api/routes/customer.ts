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
}