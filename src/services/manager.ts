import { Service, Inject } from 'typedi';
import { IFoodDTO, IFood } from '@/interfaces/IFood';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { IOrderItems } from '@/interfaces/IOrderItems';

@Service()
export default class ManagerService {
  constructor(
    @Inject('foodModel') private foodModel: Models.FoodModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Inject('orderItemModel') private orderItemModel: Models.OrderItemModel,
    @Inject('dineTableModel') private dineTableModel: Models.DineTableModel,
    @Inject('orderModel') private orderModel: Models.OrderModel,

  ) {
  }
  public async createFood(foodInputDTO: IFoodDTO): Promise<{ status: Boolean}> {
    try {
      this.logger.silly('creating food');
      const foodRecord = await this.foodModel.create({
        ...foodInputDTO,
      });
      if (!foodRecord) {
        throw new Error('dining table cannot be created');
      }
      return { status:true };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async updateFood(foodInput:IFood): Promise<{foodDetail:IFood}>{
      try{
        const foodRecord = await this.foodModel.findById(foodInput._id);
        if(!foodRecord){
            throw new Error("food record not found")
        }
        foodRecord.name = foodInput.name?foodInput.name:foodRecord.name
        foodRecord.price = foodInput.price?foodInput.price:foodRecord.price
        foodRecord.category = foodInput.category?foodInput.category:foodRecord.category
        // foodRecord.inMenu = foodInput.inMenu?foodInput.inMenu:foodRecord.inMenu
        foodRecord.inMenu = foodInput.inMenu;
        foodRecord.image = foodInput.image?foodInput.image:foodRecord.image
        await foodRecord.save()
        return {foodDetail:foodRecord}
      }catch{

      }
  }
  public async getFood(): Promise<{ foodDetails: IFood[]}> {
    try {

      const foodRecords = await this.foodModel.find();
      if (!foodRecords) {
        throw new Error('manager Records not found');
      }
      return { foodDetails:foodRecords };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getMenuFood(): Promise<{ foodDetails: IFood[]}> {
    try {

      const foodRecords = await this.foodModel.find({inMenu:true});
      if (!foodRecords) {
        throw new Error('manager Records not found');
      }
      return { foodDetails:foodRecords };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async deleteFood(foodId:String): Promise<{ status: boolean}> {
    try {
      const foodRecord = await this.foodModel.findByIdAndDelete(foodId);
      if (!foodRecord) {
        throw new Error('cannot delete manager');
      }
      return { status:true };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getOrders(): Promise<{orderDetails:IOrderItems[]}>{
    try{
      const orderRecord = await this.orderItemModel.find({order_item_status:{$ne:"HAPPY MEAL"}});
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
  public async updateOrder(order_item_id:String, status:String){
    try{
        const orderRecord = await this.orderItemModel.findById(order_item_id);
        this.logger.debug(order_item_id)
        if(!orderRecord){
            throw new Error("error:record not found");
        }
        orderRecord.order_item_status = status;
        await orderRecord.save();
    }catch(e){
        this.logger.error(e);
        throw e
    }
  }
}
