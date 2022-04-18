import { Service, Inject } from 'typedi';
import { IFood, IFoodDTO } from '@/interfaces/IFood';
import { IRestaurant} from '@/interfaces/IRestaurant';
import { v4 as uuidv4 } from 'uuid';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { models } from 'mongoose';


@Service()
export default class CustomerService{
    constructor(
        @Inject('foodModel') private foodModel:Models.FoodModel,
        @Inject('logger') private logger,
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
}