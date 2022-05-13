import { Service, Inject } from 'typedi';
import { IFood, IFoodDTO } from '@/interfaces/IFood';
import jwt from 'jsonwebtoken';
import config from '@/config';
import { IOrderCartItems } from '@/interfaces/IOrderItems';
import { IOrderItems } from '@/interfaces/IOrderItems';

import { v4 as uuidv4 } from 'uuid';

@Service()
export default class CustomerService{
    constructor(
        @Inject('foodModel') private foodModel:Models.FoodModel,
        @Inject('logger') private logger,
        @Inject('dineTableModel') private dineTableModel: Models.DineTableModel,
        @Inject('restaurantModel') private restaurantModel: Models.RestaurantModel,
        @Inject('orderModel') private orderModel: Models.OrderModel,
        @Inject('orderItemModel') private orderItemModel: Models.OrderItemModel,
        
    ){
    }
    public async getFoods():Promise<{foodDetails:IFood[]}>{
        try{
            const foodRecords = await this.foodModel.find({inMenu:true});
            if (!foodRecords) {
                    throw new Error('manager Records not found');
            }
            return { foodDetails:foodRecords };
        }catch(e){
            this.logger.error(e);
            throw e
        }
    }
    public async validateRestaurant(qrCode:String):Promise<{accessToken:String}>{
        try{
            const restaurantRecord = await this.restaurantModel.find({qr:qrCode});
            this.logger.silly(restaurantRecord)
            if(restaurantRecord.length === 0){
                throw new Error("error:record not found");
            }
            const token = this.generateResToken();
            return {accessToken:token}
        }catch(e){
            this.logger.error(e);
            throw e
        }
    }
    public async validateDine(qrCode:String):Promise<{accessToken:String}>{
        try{
            const dineRecord = await this.dineTableModel.find({qrCode:qrCode});
            if(dineRecord.length === 0){
                throw new Error("error:record not found");
            }
            const _id = dineRecord[0]._id
            const name = dineRecord[0].name;
            const token = await this.generateDineToken(_id, name);
            return {accessToken:token}
        }catch(e){
            this.logger.error(e);
            throw e
        }
    }
    public async makeOrder(order_id:String, orderCartItem:IOrderCartItems[], dine_id:String, email:String):Promise<{orderDetails:String}>{
      try{
        if(order_id){
          for(var i=0;i<orderCartItem.length;i++){
            const orderItemRecord = await this.orderItemModel.create({
                food_id:orderCartItem[i].food_id,
                order_id:order_id,
                quantity:orderCartItem[i].quantity,
                comment:orderCartItem[i].comment,
            })
          }
          return {orderDetails:order_id}
        }else{
          const order_id = await uuidv4();
          const total = await this.getPriceOf(orderCartItem)
          const orderRecord = await this.orderModel.create({
            order_id:order_id,
            email_id:email,
            dine_id:dine_id,
            total:total,
          })
          for(var i=0;i<orderCartItem.length;i++){
            const orderItemRecord = await this.orderItemModel.create({
                food_id:orderCartItem[i].food_id,
                order_id:order_id,
                quantity:orderCartItem[i].quantity,
                comment:orderCartItem[i].comment,
            })
          }
          return {orderDetails:order_id}
      }
      }catch(e){
        this.logger.error(e);
        throw e;
      }
    }
    public async getOrders(): Promise<{orderDetails:IOrderItems[]}>{
      try{
        const orderRecord = await this.orderItemModel.find();
        if(!orderRecord){
          throw new Error("Cannot get order items")
        }
        let newOrderRecord =[] as IOrderItems[];
        for(let i=0;i<orderRecord.length;i++){
          let curRecord = {} as IOrderItems;
          const foodRecord = await this.foodModel.findById(orderRecord[i].food_id);
          const curOrderRecord = await this.orderModel.find({order_id:orderRecord[i].order_id});
          const dineRecord = await this.dineTableModel.findById(curOrderRecord[0].dine_id)
          curRecord.order_item_id = await orderRecord[i]._id;
          curRecord.food_id = await orderRecord[i].food_id;
          curRecord.food_name =await foodRecord.name;
          curRecord.dine_id =await curOrderRecord[0].dine_id;
          curRecord.dine_name =await dineRecord.name;
          curRecord.order_id =await orderRecord[i].order_id;
          curRecord.quantity =await orderRecord[i].quantity;
          curRecord.comment =await orderRecord[i].comment;
          curRecord.order_item_status =await orderRecord[i].order_item_status;
          newOrderRecord[i]=curRecord;
        }
        this.logger.silly("%o", newOrderRecord[0])
        return{orderDetails:newOrderRecord}
      }
      catch(e){
        this.logger.error(e);
        throw e;
      }
    }
    private generateResToken() {
        const role = "Customer"
        this.logger.silly(`Sign JWT for customer`);
        return jwt.sign(
          {
            role:role,
          },
          config.resSecret,
          {
            expiresIn:'2h'
          },
        );
      }
      private generateDineToken(id:String, name:String) {
        const role = "Customer"
        this.logger.silly(`Sign JWT for _id %o`, id);
        return jwt.sign(
          {
            role:role,
            _id:id,
            _name:name
          },
          config.dineSecret,
          {
            expiresIn:'2h'
          },
        );
      }
      private async getPriceOf(orderCartItem:IOrderCartItems[]){
        let total = 0;
        for(var i = 0; i < orderCartItem.length; i++){
          const curFoodRecord = await this.foodModel.findById(orderCartItem[i].food_id)
          total = total + ( curFoodRecord.price *  orderCartItem[i].quantity);
        }
        return total;
      }
}
