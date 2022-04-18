export interface IDine {
    _id: String;
    name: String;
    status : Boolean;
    qrCode:String;
  }

export interface IDineDTO{
    name:String;
    status:Boolean;
    qrCode:String;
}