import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AuthService } from "../../auth";
import { Router } from "@angular/router";
import { AlertService } from "src/app/_metronic/partials/layout/alert/alert.service";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { parseBoolean } from "src/app/utils/parse-boolean";
import { MemoryManagementService } from "../../memory/memory-management.service";
import { SelectMemoryComponent } from "./select-memory/select-memory.component";

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
  @Input() compactMode: boolean = false;
  @Input() showSelectionIndicator: boolean = false;

  @Output() isPlanSelect: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('selectMemoryModal') private selectMemoryComponent: SelectMemoryComponent;

  userIsActive: boolean;
  selectedPlan: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private translate: TranslateService,
    private memoryManagementService: MemoryManagementService
  ) {
  }

  loadData() {
    this.planList = [
      {
        id: 2,
        name: this.translate.instant('standard'),
        price: "₺499,00/" + this.translate.instant('year'),
        properties: [this.translate.instant('standardProperty1'), this.translate.instant('standardProperty2'), this.translate.instant('standardProperty3'), this.translate.instant('standardProperty5')]
      },
      {
        id: 3,
        name: this.translate.instant('premium'),
        price: "₺699,00/" + this.translate.instant('year'),
        properties: [this.translate.instant('premiumProperty1'), this.translate.instant('premiumProperty2'), this.translate.instant('premiumProperty3'), this.translate.instant('premiumProperty4'), this.translate.instant('premiumProperty5'), this.translate.instant('premiumProperty7')]
      },
      {
        id: 4,
        name: this.translate.instant('ultra'),
        price: "₺1299,00/" + this.translate.instant('year'),
        properties: [this.translate.instant('ultraProperty1'), this.translate.instant('ultraProperty2'), this.translate.instant('ultraProperty3'), this.translate.instant('ultraProperty4'), this.translate.instant('ultraProperty5'), this.translate.instant('ultraProperty7')]
      }
    ]
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.userIsActive = parseBoolean(this.authService.currentUserValue?.isActive)
    }
    else {
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
      this.selectedPlan = selectedPlan;

      if (this.authService.currentUserValue?.roles?.includes('4')) {
        if (selectedPlan === 2 || selectedPlan === 3) {
          this.memoryManagementService.getMemoryCount(this.authService.currentUserValue.id).subscribe(result => {
            if (result.isSuccess) {
              if (result.data <= 1) {
                this.router.navigate(["/payment"], {
                  queryParams: {
                    typeId: 4,
                    selectedPlan: selectedPlan,
                  }
                });
              }
              else {
                this.selectMemoryComponent.openModal();
              }
            }
          });
        }
        else {
          this.router.navigate(["/payment"], {
            queryParams: {
              typeId: 4,
              selectedPlan: selectedPlan,
            }
          });
        }
      }
      else {
        this.router.navigate(["/payment"], {
          queryParams: {
            typeId: 4,
            selectedPlan: selectedPlan,
          }
        });
      }
    }
  }

  onPay(selectedPlan: number) {
    if (this.isStandByPage) {
      this.selectedPlan = selectedPlan;
      
      this.router.navigate(["/payment"], {
        queryParams: {
          typeId: 3,
          selectedPlan: selectedPlan,
        }
      });
    }
  }

  onPlanSelect(plan: number) {
    if (!this.isStandByPage && !this.isProfilePage && !this.useVoucher) {
      this.activePlan = plan;
      this.isPlanSelect.emit(this.activePlan);
    }
  }

  isSuccess(event: number) {
    this.router.navigate(["/payment"], {
      queryParams: {
        typeId: 4,
        selectedPlan: this.selectedPlan,
        memoryId: event
      }
    });
  }

} 