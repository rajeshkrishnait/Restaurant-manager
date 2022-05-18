import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Logger } from 'winston';
import { Container } from 'typedi';
import RecommendationService from '@/services/Recommendation';
import axios from 'axios';
const route = Router();

export default (app: Router) => {
    app.use('/recommendation', route);

    route.get('/get_recommendation/:_name',
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling get recommendation endpoint by user with body: %o', req.body );
    try {
        const recommendations = await axios.post('http://localhost:5000/recommend_knn_api', { name: req.params._name });
        console.log(recommendations)
        return res.json({recommendation:recommendations.data}) // { hello: 'world' }
        }
        catch (e) {
        logger.error('error: %o', e);
        return next(e);
        }
    });
    route.get('/recommend_svd_api',
    // middlewares.attachTokens,
    // middlewares.resAuth,
    // middlewares.dineAuth,
    async(req:Request, res:Response, next:NextFunction) =>{
    const logger:Logger = Container.get('logger');
    logger.debug('Calling get recommendation endpoint by user with body: %o', req.body );
    try {
        const rawRecommendations = await axios.post('http://localhost:5000/recommend_svd_api', {data:req.body});
        const RecommendationInstance = Container.get(RecommendationService);
        const recommendationDetails = await RecommendationInstance.getFoodRecommendation(rawRecommendations.data)
        return res.json({recommendationDetails:recommendationDetails.recommendationDetails}) // { hello: 'world' }
        }
        catch (e) {
        logger.error('error: %o', e);
        return res.json({status:false, message:"failed to get recommendations"});
        }
    });
}