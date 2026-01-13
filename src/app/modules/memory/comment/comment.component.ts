import { Component, EventEmitter, Inject, LOCALE_ID, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { TranslateService } from "@ngx-translate/core";
import { MemoryManagementService } from "../memory-management.service";
import { MemoryCommentModel } from "../models/comment.model";
import { formatDate } from "@angular/common";
import { AuthService } from "../../auth";
import { environment } from "src/environments/environment";
import { forkJoin } from "rxjs";

@Component({
    selector: 'app-memory-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
})
export class CommentComponent {

    @ViewChild('modal') private modalComponent: ModalComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

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
                this.modalComponent.close();
                this.isSuccess.emit();
            }
        })
    }

    loadData() {
        this.memoryManagementService.commentAll(this.memoryId).subscribe(result => {
            if(result.isSuccess) {
                result.data.forEach(item => {
                    if(item.userAvatar) {
                        item.fileUrl = environment.avatarUploadFolderUrl + "/" + item.userAvatar.path.split("\\")[item.userAvatar.path.split("\\").length-1];
                    }

                    item.own = item.userId == this.auth.currentUserValue?.id ? true : false;
                    item.date = formatDate(item.date!, "dd/MM/yyyy HH:mm", this.locale);
                })

                this.comments = result.data;
            }

            this.modalComponent.open({size : 'lg', backdrop: 'static', scrollable: true});
        })
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {

    }

    openModal(memoryId: number) {
        const keys = ['COMMENTS', 'CANCEL'];
        const translations: any = {};
        
        const observables = keys.map(key => this.translate.get(key));
        
        forkJoin(observables).subscribe((results) => {
            keys.forEach((key, index) => {
                translations[key] = results[index]
            })
        })

        this.modalConfig = {
            modalTitle: translations['COMMENTS'],
            hideDismissButton: () => true,
            closeButtonLabel: translations['CANCEL']
        };

        this.memoryId = memoryId;
        this.loadData();
    }
}