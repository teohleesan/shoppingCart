import { EventEmitter, Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  private matSnackBarVerticalPosition : MatSnackBarVerticalPosition = 'bottom';
  private matSnackBarHorizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private duration =  5000;
  private action = '';

  progressBarEvent: EventEmitter<any>;

  constructor(private matSnackBar: MatSnackBar) {
    this.progressBarEvent = new EventEmitter();
  }

  startProgressBar(){
    this.progressBarEvent.emit(true);
  }
  stopProgressBar(){
    this.progressBarEvent.emit(false);
  }
  showErrorMessage(message: string){
    const config = new MatSnackBarConfig();
    config.duration = this.duration;
    config.panelClass = ['error-snackbar'];
    config.verticalPosition = this.matSnackBarVerticalPosition;
    config.horizontalPosition = this.matSnackBarHorizontalPosition;
    this.matSnackBar.open(message,this.action, config);
    this.stopProgressBar();
  }
  showSuccessMessage(message: string){
    const config = new MatSnackBarConfig();
    config.duration = this.duration;
    config.panelClass = ['success-snackbar'];
    config.verticalPosition = this.matSnackBarVerticalPosition;
    config.horizontalPosition = this.matSnackBarHorizontalPosition;
    this.matSnackBar.open(message,this.action, config);
    this.stopProgressBar();
  }
  showInfoMessage(message: string){
    const config = new MatSnackBarConfig();
    config.duration = this.duration;
    config.panelClass = ['info-snackbar'];
    config.verticalPosition = this.matSnackBarVerticalPosition;
    config.horizontalPosition = this.matSnackBarHorizontalPosition;
    this.matSnackBar.open(message,this.action, config);
    this.stopProgressBar();
  }

  showWarningMessage(message: string){
    const config = new MatSnackBarConfig();
    config.duration = this.duration;
    config.panelClass = ['warning-snackbar'];
    config.verticalPosition = this.matSnackBarVerticalPosition;
    config.horizontalPosition = this.matSnackBarHorizontalPosition;
    this.matSnackBar.open(message,this.action, config);
    this.stopProgressBar();
  }



}
