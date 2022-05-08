import jwt from 'express-jwt';
import config from '@/config';


const getTokenFromHeader = req => {
  if(req.dineToken){
    console.log(req.dineTOken)
      return req.dineToken 
  }
}
const dineAuth = jwt({
  secret: config.dineSecret, // The _secret_ to sign the JWTs
  algorithms: [config.jwtAlgorithm], // JWT Algorithm
  userProperty: 'token', // Use req.token to store the JWT
  getToken: getTokenFromHeader, // How to extract the JWT from the request

});

export default dineAuth;
