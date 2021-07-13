import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appAudit]'
})
export class AuditDirective {
  @Input() appAudit: any;
  @Input() createdBy: any
  constructor() {
  }
  ngOnInit(): void {
    return this.appAudit;
    // console.log(this.appAudit)
    // console.log(this.createdBy)
  }
}
