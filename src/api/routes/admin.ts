import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Logger } from 'winston';
import { Container } from 'typedi';
import AdminService from '@/services/admin';
const route = Router();

export default (app: Router) => {
    app.use('/admin', route);

    route.get('/get_managers',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling get all managers endpoint by admin with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Admin", next)
        if(isValidRole){
            const AdminServiceInstance = Container.get(AdminService);
            const { managerDetails } = await AdminServiceInstance.getManagers();
            return res.status(201).json({ managerDetails });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });
    route.delete('/delete_manager',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling delete manager endpoint by admin with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Admin", next)
        if(isValidRole){
            const AdminServiceInstance = Container.get(AdminService);
            const { status } = await AdminServiceInstance.deleteManager(req.body._id);
            return res.status(201).json({ "status":status });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });
    route.put('/refresh_qr',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling Update restaurant qr endpoint by admin with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Admin", next)
        if(isValidRole){
            const AdminServiceInstance = Container.get(AdminService);
            const { restaurantDetails } = await AdminServiceInstance.refreshQR();
            return res.status(201).json({ restaurantDetails });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });

}