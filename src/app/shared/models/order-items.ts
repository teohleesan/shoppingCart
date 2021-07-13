export interface OrderItems {
  orderId?:string;
  productId: string;
  quantity:number;
  unitPrice:number;
  amount:number;
}

export interface OrderItemsView {
  orderId?:string;
  productId: string;
  quantity:number;
  unitPrice:number;
  amount:number;
  name:string;
}

