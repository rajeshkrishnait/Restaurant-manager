import { Service, Inject } from 'typedi';
import { IFoodDTO, IFood } from '@/interfaces/IFood';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';

@Service()
export default class ManagerService {
  constructor(
    @Inject('foodModel') private foodModel: Models.FoodModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
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
        foodRecord.inMenu = foodInput.inMenu?foodInput.inMenu:foodRecord.inMenu
        foodRecord.image = foodInput.image?foodInput.image:foodRecord.image
        console.log(foodRecord)
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
  
}
