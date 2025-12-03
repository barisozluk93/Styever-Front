import { Component, EventEmitter, Inject, LOCALE_ID, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { TranslateService } from "@ngx-translate/core";
import { MemoryManagementService } from "../memory-management.service";
import { MemoryCommentModel } from "../models/comment.model";
import { MemoryLikeModel } from "../models/like.model";
import { formatDate } from "@angular/common";

@Component({
    selector: 'app-memory-like',
    templateUrl: './like.component.html',
    styleUrls: ['./like.component.scss'],
})
export class LikeComponent {

    @ViewChild('modal') private modalComponent: ModalComponent;

    modalConfig: ModalConfig;
    likes: MemoryLikeModel[] = [];

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
        this.modalConfig = {
            modalTitle: "Beğenenler",
            hideDismissButton: () => true,
            closeButtonLabel: "İptal"
        };

        this.memoryManagementService.likeAll(memoryId).subscribe(result => {
            if(result.isSuccess) {
                result.data.forEach(item => {
                    if(item.userAvatar) {
                        item.userAvatar = item.userAvatar.fileContents = "data:" + item.userAvatar.contentType + ";base64," + item.userAvatar.fileContents;
                    }

                    item.date = formatDate(item.date!, "dd/MM/yyyy HH:mm", this.locale);
                    
                })

                this.likes = result.data;
            }

            this.modalComponent.open({size : 'md', backdrop: 'static'});
        })
    }
}