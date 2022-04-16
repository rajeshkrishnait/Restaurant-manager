import { Service, Inject } from 'typedi';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IDine, IDineDTO } from '@/interfaces/IDine';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';

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
      const qr = randomBytes(32);
      this.logger.silly('creating qr');
      const tableRecord = await this.dineTableModel.create({
        ...tableInputDTO,
        qrCode:qr.toString('hex')
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
      const qr = randomBytes(32);
      this.logger.silly('creating qr');
      console.log(tableID)
      const tableRecord = await this.dineTableModel.findById( tableID );

      if (!tableRecord) {
        throw new Error('dining table not found');
      }
      tableRecord.qrCode = qr.toString('hex')
      await tableRecord.save()
      return { tableDetails:tableRecord };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getAllTableDetails(): Promise<{ tableDetails: IDine[]}> {
    try {
      const tableRecord = await this.dineTableModel.find({});
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
}
