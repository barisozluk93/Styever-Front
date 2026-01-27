import { Component, EventEmitter, Inject, LOCALE_ID, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { TranslateService } from "@ngx-translate/core";
import { MemoryManagementService } from "../memory-management.service";
import { MemoryCommentModel } from "../models/comment.model";
import { formatDate } from "@angular/common";
import { AuthService } from "../../auth";
import { environment } from "src/environments/environment";
import { scrollToTop } from "src/app/utils/scrolltotop";
import { ToastrService } from "ngx-toastr";
import { forkJoin } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-memory-youtube',
    templateUrl: './add-memory-youtube.component.html',
    styleUrls: ['./add-memory-youtube.component.scss'],
})
export class YoutubeComponent {

    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('modal') private modalComponent: ModalComponent;
    form: FormGroup;

    modalConfig: ModalConfig;
    comments: MemoryCommentModel[] = [];
    memoryId: number;

    constructor(
        private fb: FormBuilder,
        private memoryManagementService: MemoryManagementService,
        private translate: TranslateService,
        private auth: AuthService,
        @Inject(LOCALE_ID) public locale: string,
        private toastr: ToastrService,

    ) { }

    initForm() {
        this.form = this.fb.group({
            id: 0,
            isDeleted: false,
            memoryId: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            link: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
        });
    }

    disableSubmitButton(): boolean {
        return this.form.valid;
    }

    ngOnInit(): void {
        this.initForm();
    }

    ngAfterViewInit() {

    }

    openModal(memoryId: number) {
        const keys = ['ADD_YOUTUBE_LINK', 'SUBMIT', 'CANCEL'];
        const translations: any = {};

        const observables = keys.map(key => this.translate.get(key));

        forkJoin(observables).subscribe((results) => {
            keys.forEach((key, index) => {
                translations[key] = results[index]
            })
        })

        this.modalConfig = {
            modalTitle: translations['ADD_YOUTUBE_LINK'],
            dismissButtonLabel: translations['SUBMIT'],
            onDismiss: this.submit.bind(this),
            shouldDismiss: this.disableSubmitButton.bind(this),
            closeButtonLabel: translations['CANCEL']
        };

        this.form.reset({ id: 0, link: '', memoryId: memoryId, isDeleted: false });

        this.memoryId = memoryId;
        this.modalComponent.open({ size: 'md', backdrop: 'static' });
    }

    submit() {
        if (this.form.valid) {
            let data = this.form.getRawValue();

            this.memoryManagementService.memoryYoutubeLinkAdd(data).subscribe(result => {
                if (result.isSuccess) {
                    scrollToTop();
                    this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
                        positionClass: 'toast-top-right',
                        timeOut: 3000
                    });

                    this.isSuccess.emit();
                }
                else {
                    scrollToTop();
                    this.toastr.error(result.message, this.translate.instant('ERROR'), {
                        positionClass: 'toast-top-right',
                        timeOut: 3000
                    });
                }
            })
        }

        return true;
    }
}