import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import { LayoutInitService } from 'src/app/_metronic/layout/core/layout-init.service';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
})
export class ContactUsComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  hasError: boolean;

  bannerHeight?: number;
  bannerPaddingTopHeight?: number;

  constructor(
    private windowResizeService: WindowResizeService,
    private fb: FormBuilder) {
  }

  initForm() {
    this.contactForm = this.fb.group(
      {
        email: [
          "",
           Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320),
        ],
        fullname: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(4),
          ]),
        ],
        subject: [
          "",
          Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),],
        message: [
          "",
          Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),]
      });
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
    .subscribe(size => {
      this.bannerHeight =  (size.height / 2) - document.getElementById("kt_header")?.clientHeight!;
      this.bannerPaddingTopHeight = this.bannerHeight / 4;
    });

    this.initForm();
  }

  ngAfterViewInit(): void {
    
  }

  get f() {
    return this.contactForm.controls;
  }

  submit() {
      
    }
}
