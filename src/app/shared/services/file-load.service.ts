import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FileLoadService {

  constructor(private http: HttpClient) { }

  loadJson(filename: string):Promise<any>{
    const file = 'assets/data/' + filename + '.json?_t=' + Date.now;
    return new Promise((resolve, reject)=>{
      this.http.get(file)
      .toPromise()
      .then((res)=> resolve(res))
      .catch((err)=> reject(err))
    })
  }
}
