import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

import {
  DocumentDownloadTask,
  DocumentQueueService,
} from '@customer-portal/data-access/documents/services';

import { NavbarButtonComponent } from '../navbar-button';

@Component({
  selector: 'customer-portal-navbar-download',
  imports: [
    CommonModule,
    TranslocoDirective,
    OverlayPanelModule,
    NavbarButtonComponent,
  ],
  templateUrl: './navbar-download.component.html',
  styleUrl: './navbar-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarDownloadComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  downloadTasks: DocumentDownloadTask[] = [];
  downloadCount = 0;

  get downloadIcon(): string {
    return this.downloadTasks.some((task) => task.status === 'downloading')
      ? 'spinner pi-spin'
      : 'download';
  }

  get badgeCounter(): number {
    return this.downloadTasks.some((task) => task.status === 'downloading')
      ? 0
      : this.downloadCount;
  }

  constructor(
    private ts: TranslocoService,
    private documentQueueService: DocumentQueueService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.documentQueueService.downloadTasks$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tasks) => {
        this.downloadTasks = tasks;
        this.downloadCount = tasks.length;
        this.cdr.markForCheck();
      });
  }

  onToggleDownloadOverlay(overlayPanel: OverlayPanel, event: MouseEvent): void {
    overlayPanel.toggle(event);
  }
}
