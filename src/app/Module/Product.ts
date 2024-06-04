export interface Product {

  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  subcategoryName: string;
  subcategoryId:number;
  timeToPrepareInMinute: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  selected?: boolean;
}