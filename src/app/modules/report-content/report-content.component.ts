import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { scrollToTop } from 'src/app/utils/scrolltotop';
import { AuthService, UserType } from '../auth';
import { ReportContentService } from './report-content.service';
import { ReportContentModel } from './models/report-content.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-report-content',
  templateUrl: './report-content.component.html',
  styleUrls: ['./report-content.component.scss'],
})
export class ReportContentComponent implements OnInit {
  bannerHeight?: number;
  bannerPaddingTopHeight?: number;

  reportForm: FormGroup;
  currentUser: UserType;

  complaintTypes = [
    'COMPLAINT_TYPE_OFFENSIVE',
    'COMPLAINT_TYPE_HATE_SPEECH',
    'COMPLAINT_TYPE_SPAM',
    'COMPLAINT_TYPE_PERSONAL_DATA',
    'COMPLAINT_TYPE_INAPPROPRIATE',
    'COMPLAINT_TYPE_OTHER',
  ];

  constructor(
    private fb: FormBuilder,
    private windowResizeService: WindowResizeService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private reportContentService: ReportContentService
  ) {}

  ngOnInit(): void {
    this.windowResizeService.resize$.subscribe(size => {
      this.bannerHeight = (size.height / 2) - document.getElementById('kt_header')?.clientHeight!;
      this.bannerPaddingTopHeight = this.bannerHeight / 4;
    });

    this.currentUser = this.auth.currentUserValue!;

    this.initForm();

    this.route.queryParams.subscribe(params => {
      if (params.pagedLink) {
        this.reportForm.patchValue({
          reportedUrl: params.pagedLink,
        });
      }
    });
  }

  initForm() {
    this.reportForm = this.fb.group({
      fullName: [
        this.currentUser
          ? `${this.currentUser.name} ${this.currentUser.surname}`
          : '',
        Validators.required,
      ],
      email: [
        this.currentUser ? this.currentUser.email : '',
        [Validators.required, Validators.email],
      ],
      complaintType: ['', Validators.required],
      reportedUrl: ['', Validators.required],
      description: ['', Validators.required],
      isDeleted: [false],
    });
  }

  submit() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const data: ReportContentModel = this.reportForm.getRawValue();

    if (this.currentUser) {
      data.fullName = `${this.currentUser.name} ${this.currentUser.surname}`;
      data.email = this.currentUser.email;
      data.userId = this.currentUser.id;
    }

    this.reportContentService.submit(data).subscribe(result => {
      if (result.isSuccess) {
        scrollToTop();

        this.toastr.success(
          this.translate.instant('REPORT_CONTENT_SUCCESS_MESSAGE'),
          this.translate.instant('SUCCESS'),
          {
            positionClass: 'toast-top-center',
            timeOut: 4000,
          }
        );

        const reportedUrl = this.reportForm.get('reportedUrl')?.value;

        this.reportForm.reset();

        if (this.currentUser) {
          this.reportForm.patchValue({
            userId: this.currentUser.id,
            fullName: `${this.currentUser.name} ${this.currentUser.surname}`,
            email: this.currentUser.email,
            reportedUrl: reportedUrl,
          });
        } else {
          this.reportForm.patchValue({
            reportedUrl: reportedUrl,
          });
        }
      } else {
        scrollToTop();

        this.toastr.error(
          result.message,
          this.translate.instant('ERROR'),
          {
            positionClass: 'toast-top-center',
            timeOut: 4000,
          }
        );
      }
    });
  }
}