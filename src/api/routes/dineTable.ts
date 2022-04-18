import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { IDineDTO } from '@/interfaces/IDine';
import DineTableService from '@/services/DineTable';
const route = Router();

export default (app: Router) => {
    app.use('/table', route);

    route.post('/create_table',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling Create Dining table endpoint by admin with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Admin", next)
        if(isValidRole){
            const DineTableServiceInstance = Container.get(DineTableService);
            const { tableDetails } = await DineTableServiceInstance.createTable(req.body as IDineDTO);
            return res.status(201).json({ tableDetails });
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
    logger.debug('Calling Update qr endpoint by admin with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Admin", next)
        if(isValidRole){
            const DineTableServiceInstance = Container.get(DineTableService);
            const { tableDetails } = await DineTableServiceInstance.refreshQR(req.body._id);
            return res.status(201).json({ tableDetails });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });

    route.get('/get_tables',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling get all tables endpoint by admin with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Admin", next)
        if(isValidRole){
            const DineTableServiceInstance = Container.get(DineTableService);
            const occupied = req.query.occupied === undefined? "allTables":req.query.occupied;
            const { tableDetails } = await DineTableServiceInstance.getAllTableDetails(occupied as string);
            return res.status(201).json({ tableDetails });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });
    route.put('/update_table',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling Update table by Admin with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Admin", next)
        if(isValidRole){
            const DineTableServiceInstance = Container.get(DineTableService);
            const { tableDetail } = await DineTableServiceInstance.updateTable(req.body);
            return res.status(201).json({ tableDetail });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });

    route.delete('/delete_table',
    middlewares.isAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling delete table endpoint by admin with body: %o', req.body );
    try {
        const isValidRole = await middlewares.checkRole(req, "Admin", next)
        if(isValidRole){
            const DineTableServiceInstance = Container.get(DineTableService);
            const { status } = await DineTableServiceInstance.deleteTable(req.body._id);
            return res.status(201).json({ "status":status });
        }else{
            return res.json({message:"Not Authorized"});
        }
        } catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });
}