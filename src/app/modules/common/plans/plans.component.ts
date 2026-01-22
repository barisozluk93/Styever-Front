import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PaginationModel } from "src/app/models/pagination.model";
import { ProductModel } from "../../shopping/models/product.model";
import { BasketModel } from "../../shopping/models/basket.model";
import { AuthService } from "../../auth";
import { BasketService } from "src/app/_metronic/partials/layout/basket/basket.service";
import { BasketManagementService } from "../../basket-management/basket-management.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/_metronic/partials/layout/alert/alert.service";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { parseBoolean } from "src/app/utils/parse-boolean";

@Component({
  selector: 'app-plans',
  styleUrls: ['./plans.component.scss'],
  templateUrl: './plans.component.html',
})
export class PlansComponent implements OnInit {
  planList: any[] = [];
  @Input() activePlan: number;
  @Input() useVoucher: boolean;

  @Input() isStandByPage: boolean;
  @Input() isProfilePage: boolean;

  @Output() isPlanSelect: EventEmitter<number> = new EventEmitter<number>();

  userIsActive: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
  }

  loadData() {
    this.planList = [
      {
        id: 2,
        name: this.translate.instant('standard'),
        price: "₺359,00/" + this.translate.instant('year'),
        properties: [this.translate.instant('standardProperty1'), this.translate.instant('standardProperty2'), this.translate.instant('standardProperty3'), this.translate.instant('standardProperty4'), this.translate.instant('standardProperty5')]
      },
      {
        id: 3,
        name: this.translate.instant('premium'),
        price: "₺559,00/" + this.translate.instant('year'),
        properties: [this.translate.instant('premiumProperty1'), this.translate.instant('premiumProperty2'), this.translate.instant('premiumProperty3'), this.translate.instant('premiumProperty4'), this.translate.instant('premiumProperty5'), this.translate.instant('premiumProperty6'), this.translate.instant('premiumProperty7'), this.translate.instant('premiumProperty8')]
      },
      {
        id: 4,
        name: this.translate.instant('ultra'),
        price: "₺959,00/" + this.translate.instant('year'),
        properties: [this.translate.instant('ultraProperty1'), this.translate.instant('ultraProperty2'), this.translate.instant('ultraProperty3'), this.translate.instant('ultraProperty4'), this.translate.instant('ultraProperty5'), this.translate.instant('ultraProperty6'), this.translate.instant('ultraProperty7'), this.translate.instant('ultraProperty8')]
      }
    ]
  }

  ngOnInit(): void {
    if(this.authService.currentUserValue) {
      this.userIsActive = parseBoolean(this.authService.currentUserValue?.isActive)
    }
    else{
      this.userIsActive = true;
    }
    
    this.loadData();

    this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.loadData();
      }
    );
  }

  onBuy(selectedPlan: number) {
    if (this.isProfilePage) {
      this.router.navigate(["/payment"], {
        queryParams: {
          typeId: 4,
          selectedPlan: selectedPlan,
        }
      });
    }
  }

  onPay(selectedPlan: number) {
    if (this.isStandByPage) {
      this.router.navigate(["/payment"], {
        queryParams: {
          typeId: 3,
          selectedPlan: selectedPlan,
        }
      });
    }
  }

  onPlanSelect(plan: number) {
    if(!this.isStandByPage && !this.useVoucher) {
      this.activePlan = plan;
      this.isPlanSelect.emit(this.activePlan);
    }
  }

} 