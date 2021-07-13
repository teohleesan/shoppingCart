import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getReactiveFormObject<T>(group: FormGroup): T{
    let object = {} as T;
    Object.keys(group.controls).forEach((key: string)=>{
      if (group.controls[key]) {
        object[key] = group.get(key).value;
      }
    })
    return object;
  }
  setObjectToReactiveForm(group: FormGroup , object: any): FormGroup{
    Object.keys(group.controls).forEach((key: string) => {
      if (object[key]){
        group.controls[key].patchValue(object[key]);
      }
    })
    return group;
  }
}
