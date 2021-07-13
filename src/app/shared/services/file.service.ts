import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { imagePattern } from '../classes/const-variable';
import {ToastrService} from './toastr.service';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private toastrService: ToastrService) { }

  loadImage(file: any){
    const mime = file.type;
    if (!mime.match(imagePattern)){
      this.toastrService.showWarningMessage('You are trying to upload not Image. Please choose image.')
      return null;
    }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    return Observable.create(observer =>{
      reader.onloadend = () =>{
        observer.next(reader.result);
        observer.complete();
      }
      reader.onerror = () =>{
        observer.next(null);
        observer.complete();
      }
    })
  }

  previewImage(file: any){
    const mime = file.type;
    if (!mime.match(imagePattern)){
      this.toastrService.showWarningMessage('You are trying to upload not Image. Please choose image.')
      return null;
    }
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(null);
      reader.readAsDataURL(file);
    })
  }
}
