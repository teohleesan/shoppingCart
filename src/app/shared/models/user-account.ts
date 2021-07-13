import { Role } from "./role";

export interface UserAccount {
  id?:string;
  emailId: string;
  firstName: string;
  lastName: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  zip?: number;
  phoneNumber?: string;
  roles?:Role;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
  url?: string;
}
