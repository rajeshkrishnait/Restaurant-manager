import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Logger } from 'winston';
import { Container } from 'typedi'
import CustomerService from '@/services/customer';
import { IOrderCartItems } from '@/interfaces/IOrderItems';

const route = Router();

export default (app:Router)=>{
    app.use('/customer', route)
    route.get('/get_foods', 
    middlewares.attachTokens,
    middlewares.resAuth,
    middlewares.dineAuth,
    middlewares.otpAuth,
    async (req:Request, res:Response, next:NextFunction) =>{
        const logger:Logger = Container.get('logger')
        logger.debug('calling get_foods endpoint by customer with body: %o', req.body )
        try{
              const customerServiceInstance = Container.get(CustomerService);
              const { foodDetails } = await customerServiceInstance.getFoods();
              return res.status(201).json({ foodDetails });
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
    route.post('/make_order',
    middlewares.attachTokens,
    middlewares.resAuth,
    middlewares.dineAuth,
    middlewares.otpAuth,
    async (req:Request, res:Response, next:NextFunction)=>{
        const logger:Logger = Container.get('logger');
        logger.debug('calling make order endpoint by customer with body: %o', req.body);
        try{
        const customerServiceInstance = Container.get(CustomerService);
        const dinePayload = await middlewares.getPayload(req.dineToken)
        const customerPayload = await middlewares.getPayload(req.otpToken)
        const {orderDetails} = await customerServiceInstance.makeOrder(req.body.order_id, req.body.food as IOrderCartItems[], dinePayload._id,customerPayload.email );
        return res.status(201).json({status:true, orderId:orderDetails, message:"created successfully"});
        }
        catch(e){
            return res.json({status:false, message:"Order creation failed"});
        }
    })
    route.get('/get_orders',
    middlewares.attachTokens,
    middlewares.resAuth,
    middlewares.dineAuth,
    middlewares.otpAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling get orders endpoint by customer with body: %o', req.body );
    try{
        const customerServiceInstance = Container.get(CustomerService);
        const customerPayload = await middlewares.getPayload(req.otpToken)
        const { orderDetails } =await customerServiceInstance.getOrders(customerPayload.email);
        return res.status(201).json({status:true, "orders":orderDetails});
        } catch (e) {
        logger.error('error: %o', e);
        return res.json({status:false, message:"failed to get orders"});
        }
    });
}