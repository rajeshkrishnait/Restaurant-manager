
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

export interface IRecommendation{
    _id:String;
    name:String;
    price:Number;
    category:String;
    inMenu:Boolean;
    image:String;
    description:String;
    type:String;
}