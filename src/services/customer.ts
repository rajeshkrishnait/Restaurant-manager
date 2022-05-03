import { Service, Inject } from 'typedi';
import { IFood, IFoodDTO } from '@/interfaces/IFood';
import jwt from 'jsonwebtoken';
import config from '@/config';


@Service()
export default class CustomerService{
    constructor(
        @Inject('foodModel') private foodModel:Models.FoodModel,
        @Inject('logger') private logger,
        @Inject('dineTableModel') private dineTableModel: Models.DineTableModel,
        @Inject('restaurantModel') private restaurantModel: Models.RestaurantModel,
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
            this.logger.silly()
            if(dineRecord.length === 0){
                throw new Error("error:record not found");
            }
            const token = this.generateDineToken();
            return {accessToken:token}
        }catch(e){
            this.logger.error(e);
            throw e
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
      private generateDineToken() {
        const role = "Customer"
        this.logger.silly(`Sign JWT for customer`);
        return jwt.sign(
          {
            role:role,
          },
          config.dineSecret,
          {
            expiresIn:'2h'
          },
        );
      }
}