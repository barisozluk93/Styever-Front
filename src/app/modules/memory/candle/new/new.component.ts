import { AfterViewInit, Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { TranslateService } from "@ngx-translate/core";
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";
import { forkJoin } from "rxjs";
import { MemoryManagementService } from "../../memory-management.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { scrollToTop } from "src/app/utils/scrolltotop";
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'app-memory-lightcandle',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss'],
})
export class LightCandleComponent implements OnInit, AfterViewInit {

    @ViewChild('modal') private modalComponent: ModalComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    form: FormGroup;

    modalConfig: ModalConfig;

    constructor(
        private fb: FormBuilder,
        private memoryManagementService: MemoryManagementService,
        private translate: TranslateService,
        @Inject(LOCALE_ID) public locale: string,
        private router: Router,
        private toastr: ToastrService,
    ) { }

    disableSubmitButton(): boolean {
        return this.form.valid;
    }

    get f() {
        return this.form.controls;
    }

    initForm() {
        this.form = this.fb.group({
            id: 0,
            name: null,
            memoryId: undefined,
            userId: undefined,
            nameSurname: undefined,
            shelter: 'xxxxxxxxxx xxxxx xxxxxx',
            donation: undefined,
            isDeleted: false,
        });
    }

    ngOnInit(): void {
        this.initForm();
    }

    ngAfterViewInit(): void { }

    initPopovers() {
        setTimeout(() => {
            const popoverTriggerList = [].slice.call(
                document.querySelectorAll('[data-bs-toggle="popover"]')
            );

            popoverTriggerList.forEach((popoverTriggerEl: any) => {
                const oldPopover = bootstrap.Popover.getInstance(popoverTriggerEl);

                if (oldPopover) {
                    oldPopover.dispose();
                }

                new bootstrap.Popover(popoverTriggerEl, {
                    html: true,
                    trigger: 'click',
                    placement: 'top',
                    container: 'body',
                    sanitize: false,
                });
            });
        }, 300);
    }

    openModal(id: number, memoryId: number, name: string, userId?: number) {
        const keys = ['LIGHT_CANDLE', 'SUBMIT', 'CANCEL'];
        const translations: any = {};

        const observables = keys.map(key => this.translate.get(key));

        forkJoin(observables).subscribe((results) => {
            keys.forEach((key, index) => {
                translations[key] = results[index]
            });

            this.modalConfig = {
                modalTitle: translations['LIGHT_CANDLE'],
                dismissButtonLabel: translations['SUBMIT'],
                onDismiss: this.submit.bind(this),
                shouldDismiss: this.disableSubmitButton.bind(this),
                closeButtonLabel: translations['CANCEL']
            };

            this.form.reset({
                id: id,
                name: name,
                memoryId: memoryId,
                userId: userId,
                nameSurname: undefined,
                shelter: 'xxxxxxxxxx xxxxx xxxxxx',
                donation: undefined,
                isDeleted: false
            });

            this.form.get('shelter')?.disable();

            if (!this.form.get('userId')?.value) {
                this.form.get('nameSurname')?.addValidators([Validators.required]);
                this.form.get('nameSurname')?.updateValueAndValidity();
            }

            this.modalComponent.open({
                size: 'lg',
                backdrop: 'static'
            });

            this.initPopovers();
        });
    }

    submit() {
        if (this.form.valid) {
            let data = this.form.getRawValue();

            if (data.donation! > 0) {
                this.router.navigate(["/payment"], {
                    queryParams: {
                        typeId: 2,
                        data: JSON.stringify(data),
                    }
                });
            }
            else {
                if (data.id > 0) {
                    this.memoryManagementService.updateCandle(data).subscribe(result => {
                        if (result.isSuccess) {
                            scrollToTop();

                            this.toastr.success(
                                this.translate.instant('SUCCESS_MESSAGE'),
                                this.translate.instant('SUCCESS'),
                                {
                                    positionClass: 'toast-top-center',
                                    timeOut: 3000
                                }
                            );

                            this.isSuccess.emit();
                        }
                        else {
                            scrollToTop();

                            this.toastr.error(
                                result.message,
                                this.translate.instant('ERROR'),
                                {
                                    positionClass: 'toast-top-center',
                                    timeOut: 3000
                                }
                            );
                        }
                    });
                }
                else {
                    this.memoryManagementService.lightCandle(data).subscribe(result => {
                        if (result.isSuccess) {
                            scrollToTop();

                            this.toastr.success(
                                this.translate.instant('SUCCESS_MESSAGE'),
                                this.translate.instant('SUCCESS'),
                                {
                                    positionClass: 'toast-top-center',
                                    timeOut: 3000
                                }
                            );

                            this.isSuccess.emit();
                        }
                        else {
                            scrollToTop();

                            this.toastr.error(
                                result.message,
                                this.translate.instant('ERROR'),
                                {
                                    positionClass: 'toast-top-center',
                                    timeOut: 3000
                                }
                            );
                        }
                    });
                }
            }
        }
        else {
            return false;
        }

        return true;
    }
}