import { Service, Inject } from 'typedi';
import { IRestaurantRole, IRestaurantRoleDTO } from '@/interfaces/IRestaurantRole';
import { IRestaurant} from '@/interfaces/IRestaurant';
import { v4 as uuidv4 } from 'uuid';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';

@Service()
export default class AdminService {
  constructor(
    @Inject('restaurantRoleModel') private restaurantRoleModel: Models.RestaurantRoleModel,
    @Inject('restaurantModel') private restaurantModel: Models.RestaurantModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }

  public async getManagers(): Promise<{ managerDetails: IRestaurantRole[]}> {
    try {
      const managerRecords = await this.restaurantRoleModel.find({'role':'Manager'}, {password:0, salt:0});
      if (!managerRecords) {
        throw new Error('manager Records not found');
      }
      return { managerDetails:managerRecords };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async deleteManager(managerId:String): Promise<{ status: boolean}> {
    try {
      const managerRecords = await this.restaurantRoleModel.findByIdAndDelete(managerId);
      if (!managerRecords) {
        throw new Error('cannot delete manager');
      }
      return { status:true };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async refreshQR(): Promise<{ restaurantDetails: IRestaurant}> {
    try {
      const qr = uuidv4();
      this.logger.silly('creating qr');
      const restaurantRecord = await this.restaurantModel.findById( "625bab55dfa9f8cc1a0d23c5");

      if (!restaurantRecord) {
        throw new Error('Restaurant record not found');
      }
      restaurantRecord.qr = qr
      await restaurantRecord.save()
      return { restaurantDetails:restaurantRecord };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getCurrentQr(): Promise<{ currentQr: String}> {
    try {
      const restaurantRecord = await this.restaurantModel.findById( "625bab55dfa9f8cc1a0d23c5");
      if (!restaurantRecord) {
        throw new Error('Restaurant record not found');
      }
      const qrRecord = restaurantRecord.qr
      return { currentQr:qrRecord };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
