import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnChanges {
    @Output() isFileChanged: EventEmitter<any> = new EventEmitter();
    @Output() isFileDeleted: EventEmitter<any> = new EventEmitter();
    @Output() isActiveMediaIndexChanged: EventEmitter<any> = new EventEmitter();
    @Output() isCheckboxClicked: EventEmitter<any> = new EventEmitter();

    @Input() isEdit: boolean;
    @Input() files: any[];
    @Input() isVideoUploadAllowed: boolean;
    @Input() isImageUploadAllowed: boolean;
    @Input() activeMediaIndex = 0;
    activeSlideId = "slide-" + this.activeMediaIndex;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.files) {
            this.files = changes.files.currentValue
        }

        if (changes.activeMediaIndex) {
            this.activeMediaIndex = changes.activeMediaIndex.currentValue
            this.activeSlideId = "slide-" + this.activeMediaIndex;
        }
    }

    onSlide(event: any) {
        this.activeMediaIndex = this.files.findIndex(
            (_, index) => 'slide-' + index === event.current
        );

        this.activeSlideId = "slide-" + this.activeMediaIndex;
        this.isActiveMediaIndexChanged.emit(this.activeMediaIndex);
    }

    onFileChange(event: any) {
        this.isFileChanged.emit(event);
    }

    onDelete() {
        this.isFileDeleted.emit(this.activeMediaIndex);
    }

    onPrimaryChange(event: Event) {
        this.isCheckboxClicked.emit(this.activeMediaIndex);
    }
}