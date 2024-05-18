export interface OrderItem {
    itemId: number;
    productId: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
  }
  export interface Order {
    orderId: number;
    customerId: number;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
    status: string;
    totalQuantity: number;
    totalPrice: number;
  }