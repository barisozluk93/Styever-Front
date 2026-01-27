import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { InlineSVGModule } from "ng-inline-svg-2";
import { TranslationModule } from "../../i18n";
import { PlansComponent } from "./plans.component";
import { SelectMemoryComponent } from "./select-memory/select-memory.component";
import { ModalsModule } from "src/app/_metronic/partials/layout/modals/modals.module";

@NgModule({
    declarations: [
      PlansComponent,
      SelectMemoryComponent
    ],
    exports: [
      PlansComponent,
    ],
    imports: [
      ModalsModule,
      NgbPaginationModule,
      CommonModule,
      TranslationModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      InlineSVGModule,
    ],
  })
  export class PlansModule {}