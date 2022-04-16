export interface IDine {
    _id: String;
    restaurant:String;
    Name: String;
    status : Boolean;
    qrCode:String;
  }

export interface IDineDTO{
    restaurant:String;
    name:String;
    status:Boolean;
    qrCode:String;
}