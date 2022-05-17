import 'reflect-metadata'; // We need this in order to use @Decorators

import config from './config';

import express from 'express';

import Logger from './loaders/logger';

// import middlewares from 'api/middlewares';

import { IOrderCartItems } from '@/interfaces/IOrderItems';

import { Container } from 'typedi'

import CustomerService from '@/services/customer';
import ManagerService from '@/services/manager';


async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });
  const server    = require('http').createServer(app);
  const io        = require('socket.io')(server);
  
  io.on('connection', socket => {
    socket.join(config.restaurantName)

    socket.on("createOrderRoom",async function(data){
      console.log("customer subscribed to "+data.order_id)
      socket.join(data.order_id)
      try{
        const customerServiceInstance = Container.get(CustomerService);
        const  orderDetails  =await customerServiceInstance.getOrders(data.order_id);
        io.to(data.order_id).emit('showOrder', {
          status:true,
          order:orderDetails
        })
      }catch(e){
        socket.emit('showOrder',{
          status:false,
          message:"failed to checkout"
        })
      }
    })
    socket.on('updateOrder', async function(data){
      console.log("manager subscribed to "+data.order_id)
      socket.join(data.order_id)
      try{
        const ManagerServiceInstance = Container.get(ManagerService);
        const orderItemDetails = await ManagerServiceInstance.updateOrder(data.order_item_id, data.status);
        
        io.to(data.order_id).emit('showOrder', {
        status:true,
        orderItemDetails: orderItemDetails
        });

        io.to(config.restaurantName).emit('updatedOrderItem',{
          status:true,
          orderItemDetails:orderItemDetails
        })
      }catch(e){
        io.to(data.order_id).emit('showOrder', {
          status:false,
          orderItemDetails: "Could not update order item status"
          });
      }
    })
  })

  
  server.listen(config.port, () => {
    Logger.info(`
       Server listening on port: ${config.port} 
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });

}

startServer();
