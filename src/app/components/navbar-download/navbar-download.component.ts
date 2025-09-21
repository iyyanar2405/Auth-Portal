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
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { BehaviorSubject } from 'rxjs';

// Mock interfaces and services
interface DocumentDownloadTask {
  id: string;
  fileName: string;
  progress: number;
  status: 'downloading' | 'completed' | 'failed';
}

class DocumentQueueService {
  downloadTasks$ = new BehaviorSubject<DocumentDownloadTask[]>([]);
}

import { NavbarButtonComponent } from '../navbar-button';

@Component({
  selector: 'auth-portal-navbar-download',
  imports: [
    CommonModule,
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
