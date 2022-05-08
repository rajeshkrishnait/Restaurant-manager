
export interface IOrderItems{
    food_id:String;
    dine_id:String;
    order_id:Number;
    quantity:String;
    comment:Boolean;
    order_item_status:Boolean;
}

export interface IOrderCartItems{
    food_id:String;
    quantity:Number;
    comment:String;
    order_id:String;
}