import { Component, EventEmitter, Inject, LOCALE_ID, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { TranslateService } from "@ngx-translate/core";
import { MemoryManagementService } from "../memory-management.service";
import { MemoryCommentModel } from "../models/comment.model";
import { formatDate } from "@angular/common";
import { AuthService } from "../../auth";

@Component({
    selector: 'app-memory-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
})
export class CommentComponent {

    @ViewChild('modal') private modalComponent: ModalComponent;

    modalConfig: ModalConfig;
    comments: MemoryCommentModel[] = [];
    memoryId: number;

    constructor(
        private memoryManagementService: MemoryManagementService,
        private translate: TranslateService,
        private auth: AuthService,
        @Inject(LOCALE_ID) public locale: string
    ) { }

    deleteComment(commentId: number) {
        this.memoryManagementService.deleteComment(commentId).subscribe(result => {
            if(result.isSuccess) {
                this.loadData();
            }
        })
    }

    loadData() {
        this.memoryManagementService.commentAll(this.memoryId).subscribe(result => {
            if(result.isSuccess) {
                result.data.forEach(item => {
                    if(item.userAvatar) {
                        item.userAvatar = item.userAvatar.fileContents = "data:" + item.userAvatar.contentType + ";base64," + item.userAvatar.fileContents;
                    }

                    item.own = item.userId == this.auth.currentUserValue?.id ? true : false;
                    item.date = formatDate(item.date!, "dd/MM/yyyy HH:mm", this.locale);
                })

                this.comments = result.data;
            }

            this.modalComponent.open({size : 'md', backdrop: 'static'});
        })
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {

    }

    openModal(memoryId: number) {
        this.modalConfig = {
            modalTitle: "Yorumlar",
            hideDismissButton: () => true,
            closeButtonLabel: "İptal"
        };

        this.memoryId = memoryId;
        this.loadData();
    }
}