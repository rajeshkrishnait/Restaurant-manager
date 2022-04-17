import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import jobsLoader from './jobs';
import Logger from './logger';
import './events';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('DB loaded and connected!');


  const userModel = {
    name: 'userModel',
    model: require('../models/user').default,
  };
  const restaurantRoleModel = {
    name: 'restaurantRoleModel',
    model: require('../models/RestaurantRoles').default,
  }
  const otpModel = {
    name:'otpModel',
    model:require('../models/Otp').default
  }
  const dineTableModel = {
    name:'dineTableModel',
    model:require('../models/dineTable').default
  }
  const foodModel = {
    name:'foodModel',
    model:require('../models/Food').default
  }
  const restaurantModel = {
    name:'restaurantModel',
    model:require('../models/restaurant').default
  }
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    models: [
      userModel,
      restaurantRoleModel,
      otpModel,
      dineTableModel,
      foodModel,
      restaurantModel
    ],
  });
  Logger.info('Dependency Injector loaded');

  await jobsLoader({ agenda });
  Logger.info('Jobs loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};
