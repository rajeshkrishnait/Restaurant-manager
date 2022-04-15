export interface IRestaurantRole {
    _id: string;
    username:string;
    email: string;
    password: string;
    salt: string;
    phone: Number;
    role : String;
    status : String;
  }
  
  export interface IRestaurantRoleDTO {
    password:string;
    username:string;
    email: string;
    phone: number;
    role: string;
    restaurant: string;
    status: string;
  }
  