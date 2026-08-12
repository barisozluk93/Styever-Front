import { Component, EventEmitter, Inject, LOCALE_ID, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { TranslateService } from "@ngx-translate/core";
import { MemoryManagementService } from "../memory-management.service";
import { MemoryCommentModel } from "../models/comment.model";
import { formatDate } from "@angular/common";
import { AuthService } from "../../auth";
import { environment } from "src/environments/environment";
import { forkJoin } from "rxjs";
import { MemoryModel } from "../models/memory.model";
import { scrollToTop } from "src/app/utils/scrolltotop";
import { ToastrService } from "ngx-toastr";

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
    isMemoryMine: boolean = false;

    constructor(
        private memoryManagementService: MemoryManagementService,
        private translate: TranslateService,
        private auth: AuthService,
        @Inject(LOCALE_ID) public locale: string,
        private toastr: ToastrService,
    ) { }
    
    approveComment(commentId: number) {
        this.memoryManagementService.approveComment(commentId).subscribe(result => {
            if (result.isSuccess) {
                scrollToTop();
                this.toastr.success(this.translate.instant('COMMENT_APPROVED_SUCCESS'), this.translate.instant('SUCCESS'), {
                    positionClass: 'toast-top-center',
                    timeOut: 3000
                });

                this.loadData();
                this.isSuccess.emit();
            }
            else {
                scrollToTop();
                this.toastr.error(result.message, this.translate.instant('ERROR'), {
                    positionClass: 'toast-top-center',
                    timeOut: 3000
                });
            }
        })
    }

    deleteComment(commentId: number) {
        this.memoryManagementService.deleteComment(commentId).subscribe(result => {
            if (result.isSuccess) {
                scrollToTop();
                this.toastr.success(this.translate.instant('COMMENT_DELETED_SUCCESS'), this.translate.instant('SUCCESS'), {
                    positionClass: 'toast-top-center',
                    timeOut: 3000
                });

                this.loadData();
                this.isSuccess.emit();
            }
            else {
                scrollToTop();
                this.toastr.error(result.message, this.translate.instant('ERROR'), {
                    positionClass: 'toast-top-center',
                    timeOut: 3000
                });
            }
        })
    }

    loadData() {
        this.memoryManagementService.commentAll(this.memoryId).subscribe(result => {
            if (result.isSuccess) {
                result.data.forEach(item => {
                    if (item.userAvatar) {
                        item.fileUrl = environment.avatarUploadFolderUrl + "/" + item.userAvatar.path.split("\\")[item.userAvatar.path.split("\\").length - 1];
                    }

                    item.own = item.userId ? (item.userId == this.auth.currentUserValue?.id ? true : false) : false;
                    item.date = formatDate(item.date!, "dd/MM/yyyy HH:mm", this.locale);
                })

                if(!this.isMemoryMine) {
                    this.comments = result.data.filter(f => f.isApproved);
                }
                else{
                    this.comments = result.data;
                }
            }
        })
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {

    }

    openModal(memory: MemoryModel) {
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

        this.isMemoryMine = memory.userId == this.auth.currentUserValue?.id;
        this.memoryId = memory.id;
        this.loadData();

        this.modalComponent.open({ size: 'lg', backdrop: 'static', scrollable: true });
    }
}