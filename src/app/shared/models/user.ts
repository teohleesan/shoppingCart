import { Role } from "./role";

export interface User {
  id?: string;
  emailId: string;
  roles: Role;
}
