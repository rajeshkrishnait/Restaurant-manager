import { Service, Inject } from 'typedi';
import { IDine, IDineDTO } from '@/interfaces/IDine';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { v4 as uuidv4 } from 'uuid';

@Service()
export default class DineTableService {
  constructor(
    @Inject('dineTableModel') private dineTableModel: Models.DineTableModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }

  public async createTable(tableInputDTO: IDineDTO): Promise<{ tableDetails: IDine}> {
    try {
      const qr = uuidv4();
      this.logger.silly('creating qr');
      const tableRecord = await this.dineTableModel.create({
        ...tableInputDTO,
        qrCode:qr
      });
      if (!tableRecord) {
        throw new Error('dining table cannot be created');
      }
      const tableDetails = tableRecord.toObject();
      return { tableDetails };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async refreshQR(tableID: String): Promise<{ tableDetails: IDine}> {
    try {
      const qr = uuidv4();
      this.logger.silly('creating qr');
      const tableRecord = await this.dineTableModel.findById( tableID );

      if (!tableRecord) {
        throw new Error('dining table not found');
      }
      tableRecord.qrCode = qr
      await tableRecord.save()
      return { tableDetails:tableRecord };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getAllTableDetails(occupied:string): Promise<{ tableDetails: IDine[]}> {
    try {
      const tableRecord = (occupied=="true")? await this.dineTableModel.find({status:true}):
                          (occupied == "false"?await this.dineTableModel.find({status:false}):
                          await this.dineTableModel.find({}));
      if (!tableRecord) {
        throw new Error('dining table cannot be created');
      }
      const tableDetails = tableRecord;
      return { tableDetails };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async updateTable(tableInput:IDine): Promise<{tableDetail:IDine}>{
    try{
      const tableRecord = await this.dineTableModel.findById(tableInput._id);
      if(!tableRecord){
          throw new Error("table record not found")
      }
      tableRecord.name = tableInput.name?tableInput.name:tableRecord.name
      tableRecord.status = tableInput.status?tableInput.status:tableRecord.status
      await tableRecord.save()
      return {tableDetail:tableRecord}
    }catch{

    }
}
  public async deleteTable(tableId:String): Promise<{ status: boolean}> {
    try {
      const tableRecord = await this.dineTableModel.findByIdAndDelete(tableId);
      if (!tableRecord) {
        throw new Error('cannot delete table');
      }
      return { status:true };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getCurrentQr(tableId:String): Promise<{ currentQr: String}> {
    try {
      const tableRecord = await this.dineTableModel.findById( tableId);
      if (!tableRecord) {
        throw new Error('Restaurant record not found');
      }
      const qrRecord = tableRecord.qrCode
      return { currentQr:qrRecord };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
