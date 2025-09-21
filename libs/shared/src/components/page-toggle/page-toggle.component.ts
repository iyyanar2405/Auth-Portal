import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs/operators';

import {
  SharedButtonToggleComponent,
  SharedButtonToggleDatum,
} from '../toggle';

@Component({
  selector: 'shared-page-toggle',
  imports: [CommonModule, RouterModule, SharedButtonToggleComponent],
  templateUrl: './page-toggle.component.html',
  styleUrl: './page-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedPageToggleComponent implements OnInit {
  public data = input.required<Partial<SharedButtonToggleDatum<string>>[]>();

  public options = signal<SharedButtonToggleDatum<string>[]>([]);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.setOptions();
    this.setRouterEvents();
  }

  setOptions(): void {
    this.options.set(this.getOptions());
  }

  setRouterEvents(): void {
    this.router.events
      .pipe(
        tap(() => this.setOptions()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onChange(value: string): void {
    this.router.navigate([value], {
      relativeTo: this.activatedRoute,
    });
  }

  private getOptions(): SharedButtonToggleDatum<string>[] {
    return this.data().map(
      (datum) =>
        ({
          ...datum,
          isActive: this.isActiveOption(datum.value as string),
        }) as SharedButtonToggleDatum<string>,
    );
  }

  private isActiveOption(value: string): boolean {
    return this.router.url.split('/').includes(value);
  }
}
