import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  @Input() path: string = '';
  @Input() id: string= ''
  isHovering: boolean;
  files: File[] = [];
  constructor() { }

  ngOnInit(): void {
  }
  onDrop(files: FileList) {
    for (let index = 0; index < files.length; index++) {
      this.files.push(files[index]);
    }
  }
  onHovered(event: boolean) {
    this.isHovering =event;
  }
}
