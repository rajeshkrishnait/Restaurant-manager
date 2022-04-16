import { Service, Inject } from 'typedi';
import { randomBytes } from 'crypto';
import { IRestaurantRole, IRestaurantRoleDTO } from '@/interfaces/IRestaurantRole';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';

@Service()
export default class AdminService {
  constructor(
    @Inject('restaurantRoleModel') private restaurantRoleModel: Models.RestaurantRoleModel,
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
//   public async refreshQR(tableID: String): Promise<{ tableDetails: IDine}> {
//     try {
//       const qr = randomBytes(32);
//       this.logger.silly('creating qr');
//       console.log(tableID)
//       const tableRecord = await this.dineTableModel.findById( tableID );

//       if (!tableRecord) {
//         throw new Error('dining table not found');
//       }
//       tableRecord.qrCode = qr.toString('hex')
//       await tableRecord.save()
//       return { tableDetails:tableRecord };
//     } catch (e) {
//       this.logger.error(e);
//       throw e;
//     }
//   }
  
}
