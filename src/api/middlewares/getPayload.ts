import { Container } from 'typedi';
import { Logger } from 'winston';


export default async function getPayload (token) {
  const Logger : Logger = Container.get('logger');
  try {
    const payload = parseJwt(token)
    return payload
  } catch (e) {
    Logger.error('Error getting payload from token %o', token);
    throw new Error("Get payload funtion failed")
  }
};

const parseJwt = (token) => {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(Buffer.from(base64, 'base64').toString());
    } catch (e) {
      return null;
    }
  };