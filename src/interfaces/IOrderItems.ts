
export interface IOrderItems{
    food_id:String;
    food_name:String;
    dine_id:String;
    dine_name:String;
    order_id:String;
    quantity:String;
    comment:Boolean;
    order_item_id;
    order_item_status:String;
}

export interface IOrderCartItems{
    food_id:String;
    quantity:Number;
    comment:String;
    order_id:String;
}