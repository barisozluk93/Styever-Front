import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { PlanManagementService, PlanModel } from '../common/plans/plan-management.service';
import { PlanEditSaveComponent } from './edit-save/edit-save.component';

@Component({
  selector: 'app-plan-management',
  templateUrl: './plan-management.component.html',
  styleUrls: ['./plan-management.component.scss']
})
export class PlanManagementComponent implements OnInit {
  @ViewChild('editSaveComponent') editSaveComponent: PlanEditSaveComponent;
  plans: PlanModel[] = [];
  loading = false;

  constructor(
    private service: PlanManagementService,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.loading = true;
    this.service.adminGetAll().subscribe({
      next: result => {
        this.loading = false;
        if (result?.isSuccess) this.plans = (result.data || []).filter(x => !x.isDeleted).sort((a,b) => a.sortOrder - b.sortOrder);
        else this.toastr.error(result?.message || 'Paketler yüklenemedi.');
      },
      error: err => { this.loading = false; this.toastr.error(err?.error?.message || 'Paket servisine ulaşılamadı.'); }
    });
  }

  openNew(): void { this.editSaveComponent.openModal(); }
  openEdit(plan: PlanModel): void { this.editSaveComponent.openModal(plan); }

  deletePlan(plan: PlanModel): void {
    const tr = this.translate.currentLang === 'tr' || this.translate.instant('LANG') === 'tr';
    if (!confirm(tr ? `${plan.name} paketini silmek istiyor musunuz?` : `Delete the ${plan.nameEn} package?`)) return;
    this.service.delete(plan.id).subscribe(result => {
      result?.isSuccess ? this.toastr.success(result.message) : this.toastr.error(result?.message);
      if (result?.isSuccess) this.loadData();
    });
  }

  properties(plan: PlanModel): string[] {
    const tr = this.translate.currentLang === 'tr' || this.translate.instant('LANG') === 'tr';
    return (tr ? plan.properties : plan.propertiesEn).split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  }

  displayName(plan: PlanModel): string {
    const tr = this.translate.currentLang === 'tr' || this.translate.instant('LANG') === 'tr';
    return tr ? plan.name : plan.nameEn;
  }

  displayPeriod(plan: PlanModel): string {
    const tr = this.translate.currentLang === 'tr' || this.translate.instant('LANG') === 'tr';
    return tr ? plan.period : plan.periodEn;
  }
}
