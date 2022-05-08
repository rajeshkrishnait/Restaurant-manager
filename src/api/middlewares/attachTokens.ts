import jwt from 'express-jwt';
import config from '@/config';
import { Container } from 'typedi';
import { Logger, loggers } from 'winston';



const getTokenFromHeader = req => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return req.headers.authorization;
};
export default async function attachTokens (req, res, next) {
  const Logger : Logger = Container.get('logger');

  try{
    const tokens = getTokenFromHeader(req);
    const resToken = tokens.toString().split('||')[0]
    const dineToken = tokens.toString().split('||')[1]
    const otpToken = tokens.toString().split('||')[2]
    // console.log(JSON.parse(resToken) )

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
