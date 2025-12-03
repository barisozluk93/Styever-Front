import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FileModel } from "src/app/models/file.model";

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnChanges {
    @Input() files: any[];

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.files && changes.files.currentValue) {
            this.files = changes.files.currentValue
        }
    }
}