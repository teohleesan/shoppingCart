import { OrderItems } from "./order-items";

export interface Order {
  purchaserId?: string;
  firstName: string;
  lastName: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  zip?: number;
  phoneNumber?: string;
  grandAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  amountAfterDiscount?: number;
  gstPercent?: number;
  gstAmount?:number;
  amountAfterGST?: number;
  deliveryChargesAmount?:number;
  totalAmount?:number;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
}
