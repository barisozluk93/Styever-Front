import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import { LayoutInitService } from 'src/app/_metronic/layout/core/layout-init.service';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { ContactUsManagementService } from './contactus-management.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContactUsModel } from './models/contactus.model';
import { scrollToTop } from 'src/app/utils/scrolltotop';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
})
export class ContactUsComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;

  bannerHeight?: number;
  bannerPaddingTopHeight?: number;

  constructor(
    private windowResizeService: WindowResizeService,
    private contactUsManagementService: ContactUsManagementService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private fb: FormBuilder) {
  }

  initForm() {
    this.contactForm = this.fb.group(
      {
        id: 0,
        isDeleted: false,
        email: [
          "",
          Validators.compose([
            Validators.required,
            Validators.email,
          ])
        ],
        fullname: [
          "",
          Validators.compose([
            Validators.required,
          ]),
        ],
        subject: [
          "",
          Validators.compose([
            Validators.required,
          ]),],
        message: [
          "",
          Validators.compose([
            Validators.required,
          ]),
        ]
      });
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
      .subscribe(size => {
        this.bannerHeight = (size.height / 2) - document.getElementById("kt_header")?.clientHeight!;
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
    if (this.contactForm.valid) {
      let data: ContactUsModel = this.contactForm.getRawValue();

      this.contactUsManagementService.submit(data).subscribe(result => {
        if (result.isSuccess) {
          scrollToTop();

          this.toastr.success(this.translate.instant('CONTACT_MESSAGE_SENT_SUCCESS'), this.translate.instant('SUCCESS'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });
        }
        else {
          scrollToTop();

          this.toastr.error(result.message, this.translate.instant('ERROR'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });
        }
      });
    }
  }
}
