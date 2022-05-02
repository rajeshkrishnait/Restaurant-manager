import jwt from 'express-jwt';
import config from '@/config';
import { Container } from 'typedi';
import { Logger, loggers } from 'winston';




export default async function attachTokens (req, res, next) {
  const Logger : Logger = Container.get('logger');

  try{
    const tokenArray = req.headers.authorization.split(' ')
    const resToken = tokenArray[1].toString().split('||')[0]
    const dineToken = tokenArray[1].toString().split('||')[1]
    const otpToken = tokenArray[1].toString().split('||')[2]
    req.resToken = resToken
    req.dineToken = dineToken
    req.otpToken = otpToken
    return next();
  }
  catch(e){
    Logger.error(e);
    return next(e)
  }
};
