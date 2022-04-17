export interface IFood{
    _id:String;
    name:String;
    price:Number;
    category:String;
    inMenu:Boolean;
    image:String;
}

export interface IFoodDTO{
    name:String;
    price:Number;
    category:String;
    inMenu:Boolean;
    image:String;
}