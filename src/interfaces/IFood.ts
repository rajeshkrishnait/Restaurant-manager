export interface IFood{
    _id:String;
    restaurant:String;
    name:String;
    price:Number;
    category:String;
    inMenu:Boolean;
}

export interface IFoodDTO{
    restaurant:String;
    name:String;
    price:Number;
    category:String;
    inMenu:Boolean;

}