import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import { Container } from 'typedi';
import ManagerService from '@/services/manager';
const route = Router();

export default (app: Router) => {
    app.use('/manager', route);

    route.post('/create_food',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling create food endpoint by manager with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Manager", next)
        if(isValidRole){
            const ManagerServiceInstance = Container.get(ManagerService);
            const { status } = await ManagerServiceInstance.createFood(req.body);
            return res.status(201).json({ status });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });
    route.get('/get_food',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling get Food endpoint by manager with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Manager", next)
        if(isValidRole){
            const ManagerServiceInstance = Container.get(ManagerService);
            const { foodDetails } = req.query.inMenu?await ManagerServiceInstance.getMenuFood():await ManagerServiceInstance.getFood();
            return res.status(201).json({ "status":foodDetails});
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });
    route.put('/update_food',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling Update food by Manager with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Manager", next)
        if(isValidRole){
            const ManagerServiceInstance = Container.get(ManagerService);
            const { foodDetail } = await ManagerServiceInstance.updateFood(req.body);
            return res.status(201).json({ foodDetail });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });
    route.delete('/delete_food/:_id',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling delete food endpoint by manager with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Manager", next)
        if(isValidRole){
            const ManagerServiceInstance = Container.get(ManagerService);
            const { status } = await ManagerServiceInstance.deleteFood(req.params._id);
            return res.status(201).json({ "status":status });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });
    route.get('/get_orders',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling get orders endpoint by manager with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Manager", next)
        if(isValidRole){
            const ManagerServiceInstance = Container.get(ManagerService);
            const { orderDetails } =await ManagerServiceInstance.getOrders();
            return res.status(201).json({ "orders":orderDetails});
        }else{
            return res.json({status:false,message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return res.json({status:false, message:"failed to get orders"});
        }
    });
    route.patch('/update_order_status',
    middlewares.isAuth,
    async (req:Request, res:Response, next:NextFunction)=>{
        const logger:Logger = Container.get('logger');
        logger.debug('calling update order status endpoint by manager with body: %o', req.body);
        try{
        const ManagerServiceInstance = Container.get(ManagerService);
        await ManagerServiceInstance.updateOrder(req.body.order_item_id, req.body.status);
        return res.status(201).json({status:true, message:"updated successfully"});
        }
        catch(e){
            return res.json({status:false, message:"update failed"});
        }
    })
}