import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxContentLoadingModule} from 'ngx-content-loading'
import {CarouselModule} from 'ngx-owl-carousel-o';
import {BarRatingModule} from 'ngx-bar-rating';

const COMMON_MODULES = [
  CommonModule,
  FlexLayoutModule,
  ReactiveFormsModule,
  NgxContentLoadingModule,
  CarouselModule,
  BarRatingModule
]

@NgModule({
  declarations: [],
  imports: [COMMON_MODULES],
  exports: [COMMON_MODULES]
})
export class CommonUseModule { }
