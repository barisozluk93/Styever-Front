import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { MemoryYoutubeLinkModel } from "../models/youtubeLink.model";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnChanges {
    @Output() isFileChanged: EventEmitter<any> = new EventEmitter();
    @Output() isFileDeleted: EventEmitter<any> = new EventEmitter();
    @Output() isOpenYoutubeLinkModalClicked: EventEmitter<any> = new EventEmitter();
    @Output() isActiveMediaIndexChanged: EventEmitter<any> = new EventEmitter();
    @Output() isCheckboxClicked: EventEmitter<any> = new EventEmitter();

    @Input() isEdit: boolean;
    @Input() files: any[];
    @Input() youtubeLinks: MemoryYoutubeLinkModel[];
    @Input() isVideoUploadAllowed: boolean;
    @Input() isImageUploadAllowed: boolean;
    @Input() isYoutubeLinkAllowed: boolean;
    @Input() activeMediaIndex = 0;
    activeSlideId = "slide-" + this.activeMediaIndex;

    links: any[] = [];
    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.files) {
            this.files = changes.files.currentValue
        }

        if (changes.youtubeLinks) {
            let links = changes.youtubeLinks.currentValue;

            if (links && links.length > 0) {
                this.links = links
                    .map((l: MemoryYoutubeLinkModel) => ({
                        ...l,
                        safeUrl: this.toSafeEmbedUrl(l.link)
                    }))
                    .filter((v: any) => v.safeUrl);
            }
            else{
                this.links = [];
            }

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

        if (this.activeMediaIndex === -1) {
            this.activeMediaIndex = this.links.findIndex(
                (_, index) => 'slide-' + (this.files.length + index) === event.current
            );

            this.activeMediaIndex = this.files.length + this.activeMediaIndex;
        }

        this.activeSlideId = "slide-" + this.activeMediaIndex;
        this.isActiveMediaIndexChanged.emit(this.activeMediaIndex);
    }

    onFileChange(event: any) {
        this.isFileChanged.emit(event);
    }

    onDelete() {
        this.isFileDeleted.emit(this.activeMediaIndex);
    }

    openYoutubeLinkModal() {
        this.isOpenYoutubeLinkModalClicked.emit();
    }

    onPrimaryChange(event: Event) {
        this.isCheckboxClicked.emit(this.activeMediaIndex);
    }

    private toSafeEmbedUrl(url: string): SafeResourceUrl | null {
        const videoId = this.extractVideoId(url);
        if (!videoId) return null;

        return this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${videoId}`
        );
    }

    private extractVideoId(url: string): string | null {
        const regExp =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }
}