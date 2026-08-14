import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LegalContentModel, LegalContentService } from './legal-content.service';

@Component({
  selector: 'app-legal-content-inline',
  templateUrl: './legal-content-inline.component.html'
})
export class LegalContentInlineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() slug = '';
  @Input() page = false;
  @Input() showTitle = true;
  item?: LegalContentModel;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(private service: LegalContentService, public translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {});
    this.load();
  }
  ngOnChanges(changes: SimpleChanges): void { if (changes['slug'] && !changes['slug'].firstChange) this.load(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  get isTr(): boolean { return this.translate.currentLang === 'tr' || this.translate.instant('LANG') === 'tr'; }
  get title(): string { return this.item ? (this.isTr ? this.item.title : this.item.titleEn) : ''; }
  get content(): string { return this.item ? (this.isTr ? this.item.content : this.item.contentEn) : ''; }

  private load(): void {
    if (!this.slug) return;
    this.loading = true;
    this.service.getBySlug(this.slug).subscribe({
      next: r => { this.loading = false; if (r?.isSuccess) this.item = r.data; },
      error: () => { this.loading = false; }
    });
  }
}
