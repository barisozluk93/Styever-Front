import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AuthService } from "../../auth";
import { Router } from "@angular/router";
import { AlertService } from "src/app/_metronic/partials/layout/alert/alert.service";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { parseBoolean } from "src/app/utils/parse-boolean";
import { MemoryManagementService } from "../../memory/memory-management.service";
import { SelectMemoryComponent } from "./select-memory/select-memory.component";
import { PlanManagementService, PlanModel } from "./plan-management.service";

@Component({
  selector: 'app-plans',
  styleUrls: ['./plans.component.scss'],
  templateUrl: './plans.component.html',
})
export class PlansComponent implements OnInit {
  planList: any[] = [];
  private rawPlans: PlanModel[] = [];
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
    private memoryManagementService: MemoryManagementService,
    private planManagementService: PlanManagementService
  ) {
  }

  loadData() {
    this.planManagementService.getAll().subscribe(result => {
      if (result?.isSuccess && result.data) {
        this.rawPlans = result.data;
        this.mapPlans();
      } else {
        this.planList = [];
      }
    });
  }

  private mapPlans(): void {
    const isTr = this.translate.currentLang === 'tr' || this.translate.instant('LANG') === 'tr';
    this.planList = (this.rawPlans || [])
      .filter(x => !x.isDeleted)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map(item => ({
        ...item,
        displayName: isTr ? item.name : item.nameEn,
        displayPeriod: isTr ? item.period : item.periodEn,
        propertiesList: (isTr ? item.properties : item.propertiesEn)
          .split(/\r?\n/)
          .map(x => x.trim())
          .filter(Boolean)
      }));
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
        this.mapPlans();
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