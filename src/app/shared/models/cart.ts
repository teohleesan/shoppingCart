export interface Cart {
  id?: string;
  code: string;
  name: string;
  currency: string;
  price: number;
  quantity:number;
  stockQuantity?: number;
  url?:string;
}
