export interface OrderItem {
    itemId: number;
    productId: number;
    name: string;
    price: number;
    imageUrl: string;
    description:string;
    quantity: number;
  }
  export interface UserDTO {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
  }
  export interface Order {
    userDTO:UserDTO;
    orderResponse:OrderResponse;
  }
  
  export interface OrderResponse {
    orderId: number;
    customerId: number;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
    status: string;
    selectedStatus: string;
    totalQuantity: number;
    totalPrice: number;
    
  }