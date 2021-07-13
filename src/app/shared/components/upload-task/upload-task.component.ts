import { Component, Input, OnInit } from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Date } from 'core-js';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {
  @Input() file: File;
  @Input() path: string = '';
  @Input() id: string = '';
  task:AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  constructor(private afs: AngularFirestore,
      private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.startUpload()
  }
  startUpload() {
    // storage path
    const storagePath = this.path + `/${this.id}/${Date.now()}_${this.file.name}`;

    //reference to storage bucket
    const storageRef = this.storage.ref(storagePath);

    //main task
    this.task = this.storage.upload(storagePath, this.file);

    //progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(t => t),
      finalize(async () => {
        this.downloadURL = await storageRef.getDownloadURL().toPromise();
        this.afs.collection(this.path).add({
          downloadUrl: this.downloadURL,
          storagePath,
          id: this.id
        })
      })
    )
  }
  isActive(snapshot){
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
