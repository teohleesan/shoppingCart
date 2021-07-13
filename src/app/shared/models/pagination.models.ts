export class Pagination {
  filter: string;
  currentPageIndex: number;
  pageSize: number;
  sortDirection: string;
  sortExpression: string;
  totalPages: number;
  totalRows: number;
  displayedColumns: Array<string>;
  pageSizeOptions: Array<number>;
  entity: Array<any>;

  constructor(){
    this.filter = '';
    this.currentPageIndex = 0;
    this.pageSize = 20;
    this.sortDirection = 'ASC';
    this.sortExpression = '';
    this.totalPages = 0;
    this.totalRows = 0;
    this.displayedColumns = new Array<string>();
    this.pageSizeOptions = [5, 10, 25, 100];
  }


}
