import { Service, Inject } from 'typedi';
import { IFoodDTO, IFood } from '@/interfaces/IFood';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { IRecommendation } from '@/interfaces/IFood';

@Service()
export default class RecommendationService {
  constructor(
    @Inject('foodModel') private foodModel: Models.FoodModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Inject('orderItemModel') private orderItemModel: Models.OrderItemModel,
    @Inject('dineTableModel') private dineTableModel: Models.DineTableModel,
    @Inject('orderModel') private orderModel: Models.OrderModel,

  ) {
  }
  
  public async getFoodRecommendation(rawRecommendations:Object):Promise<{recommendationDetails:IRecommendation[]}>{
    try {
        const foodNames = rawRecommendations["Name"];
        var values = []
        
        this.logger.silly("%o",rawRecommendations["Describe"]['37'])
        let recommendationDetails =[] as IRecommendation[];
        var k=0;
        for(var i in foodNames){
            const curFoodRecord = await this.foodModel.find({name:foodNames[i]});
            if(!curFoodRecord){
                continue;
            }
            const curRecommendedFood = {} as IRecommendation;
            curRecommendedFood._id = curFoodRecord[0]._id;
            curRecommendedFood.name = curFoodRecord[0].name;
            curRecommendedFood.price = curFoodRecord[0].price;
            curRecommendedFood.category = curFoodRecord[0].category;
            curRecommendedFood.description = rawRecommendations["Describe"][i];

            curRecommendedFood.type = rawRecommendations["Veg_Non"][i];
            recommendationDetails[k++] = curRecommendedFood
        }
        return {recommendationDetails:recommendationDetails}
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
  

  
}
