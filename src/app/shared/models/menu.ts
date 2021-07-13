export interface Menu {
  displayName: string;
  disabled?: boolean;
  icon: string;
  route?: string;
  children?: Menu[];
}
