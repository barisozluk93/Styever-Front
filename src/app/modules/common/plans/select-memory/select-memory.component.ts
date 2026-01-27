import { Component, EventEmitter, Inject, LOCALE_ID, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import { MemoryManagementService } from "src/app/modules/memory/memory-management.service";
import { AuthService } from "src/app/modules/auth";
import { MemoryModel } from "src/app/modules/memory/models/memory.model";

@Component({
    selector: 'app-select-memory',
    templateUrl: './select-memory.component.html',
    styleUrls: ['./select-memory.component.scss'],
})
export class SelectMemoryComponent {

    @Output() isSuccess: EventEmitter<number> = new EventEmitter<number>();
    @ViewChild('modal') private modalComponent: ModalComponent;

    modalConfig: ModalConfig;
    memories: MemoryModel[] = [];
    selectedMemoryId: number = 0;

    constructor(
        private memoryManagementService: MemoryManagementService,
        private translate: TranslateService,
        private auth: AuthService
    ) { }


    disableSubmitButton(): boolean {
        return this.selectedMemoryId > 0;
    }

    loadData() {
        this.memoryManagementService.paging(1, 10, undefined, undefined, this.auth.currentUserValue?.id)
            .subscribe(result => {
                if (result.isSuccess) {
                    this.memories = result.data.items;
                }
                else {
                    this.memories = [];
                }

                this.modalComponent.open({ size: 'lg', backdrop: 'static', scrollable: true });
            });
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {

    }

    openModal() {
        const keys = ['SELECT_A_MEMORY', 'SUBMIT', 'CANCEL'];
        const translations: any = {};

        const observables = keys.map(key => this.translate.get(key));

        forkJoin(observables).subscribe((results) => {
            keys.forEach((key, index) => {
                translations[key] = results[index]
            })
        })

        this.modalConfig = {
            modalTitle: translations['SELECT_A_MEMORY'],
            dismissButtonLabel: translations['SUBMIT'],
            onDismiss: this.submit.bind(this),
            shouldDismiss: this.disableSubmitButton.bind(this),
            closeButtonLabel: translations['CANCEL']
        };

        this.loadData();
    }

    submit() {
        if (this.selectedMemoryId > 0) {
            this.isSuccess.emit(this.selectedMemoryId);
        }

        return true;
    }

    onMemorySelect(event?: any) {
        this.selectedMemoryId = event.target.value;
    }
}