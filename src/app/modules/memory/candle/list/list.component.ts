import { Component, EventEmitter, Inject, LOCALE_ID, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { TranslateService } from "@ngx-translate/core";
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";
import { forkJoin } from "rxjs";
import { MemoryCandleModel } from "../../models/candle.model";
import { MemoryManagementService } from "../../memory-management.service";

@Component({
    selector: 'app-memory-candlelist',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class CandleListComponent {

    @ViewChild('modal') private modalComponent: ModalComponent;

    modalConfig: ModalConfig;
    candles: MemoryCandleModel[] = [];

    constructor(
        private memoryManagementService: MemoryManagementService,
        private translate: TranslateService,
        @Inject(LOCALE_ID) public locale: string
    ) { }


    ngOnInit(): void {
    }

    ngAfterViewInit() {

    }

    openModal(memoryId: number) {
        const keys = ['CANDLE_LIGHTERS', 'CANCEL'];
        const translations: any = {};
        
        const observables = keys.map(key => this.translate.get(key));
        
        forkJoin(observables).subscribe((results) => {
            keys.forEach((key, index) => {
                translations[key] = results[index]
            })
        })

        this.modalConfig = {
            modalTitle: translations['CANDLE_LIGHTERS'],
            hideDismissButton: () => true,
            closeButtonLabel: translations['CANCEL']
        };

        this.memoryManagementService.candleAll(memoryId).subscribe(result => {
            if(result.isSuccess) {
                result.data.forEach(item => {
                    if(item.userAvatar) {
                        item.fileUrl = environment.avatarUploadFolderUrl + "/" + item.userAvatar.path.split("\\")[item.userAvatar.path.split("\\").length-1];
                    }

                    item.date = formatDate(item.date!, "dd/MM/yyyy HH:mm", this.locale);
                    
                })

                this.candles = result.data;
            }

            this.modalComponent.open({size : 'md', backdrop: 'static'});
        })
    }
}