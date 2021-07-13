import { Component, OnInit } from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import { Carousel } from '../../models/carousel';
import { FileLoadService } from '../../services/file-load.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  slidesStore: Array<Carousel> = [
    {
      id: "1",
      alt: "",
      src: "./assets/banner_img/img_1.jpg",
      title: "Apple",
      description: "Apple"
    },
    {
      id: "2",
      alt: "",
      src: "./assets/banner_img/img_2.jpg",
      title: "Orange",
      description: "Orange"
    },
    {
      id: "3",
      alt: "",
      src: "./assets/banner_img/img_3.jpg",
      title: "Pear",
      description: "Pear"
    },
    {
      id: "4",
      alt: "",
      src: "./assets/banner_img/img_4.jpg",
      title: "StartFruit",
      description: "StartFruit"
    },
    {
      id: "5",
      alt: "",
      src: "./assets/banner_img/img_3.png",
      title: "Wax Apple",
      description: "Wax Apple"
    },
  ];


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    navText: [ '<i class="fa-chevron-left"></i>', '<i class="fa-chevron-right></i>"' ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    // nav: true
  }
  constructor(private fileLoadService: FileLoadService) { }

  ngOnInit(): void {
    const filename = 'carousel';
  //   let slidePromise = this.fileLoadService.loadJson(filename);
  //   Promise.all([slidePromise])
  //   .then((array)=>{
  //     array.forEach(element => {
  //       this.slidesStore = element.carousel
  //     });

  //   })
  //   .catch()
  // }
  }

}
