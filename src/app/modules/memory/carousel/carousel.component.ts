import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FileModel } from "src/app/models/file.model";

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnChanges {
    @Input() files: any[];

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.files && changes.files.currentValue) {
            this.files = changes.files.currentValue
        }
    }
}