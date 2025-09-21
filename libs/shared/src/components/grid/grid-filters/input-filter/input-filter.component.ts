import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  Observable,
  take,
  tap,
} from 'rxjs';

import { FilteringConfig } from '../../../../models';

@Component({
  selector: 'shared-input-filter',
  imports: [
    CommonModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    FormsModule,
  ],
  templateUrl: './input-filter.component.html',
  styleUrl: './input-filter.component.scss',
})
export class InputFilterComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @Input() filter: any;
  @Input() field = '';
  @Input() filteringConfig$!: Observable<FilteringConfig>;

  value = '';

  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.initializeSearchValue();
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((model: KeyboardEvent) => {
          const target = model.target as HTMLInputElement;

          if (target.value) {
            this.filter([{ label: target.value, value: target.value }]);
          } else {
            this.filter([]);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private initializeSearchValue(): void {
    this.filteringConfig$
      .pipe(
        take(1),
        tap((config) => {
          const filters = config[this.field]?.value || [];
          this.value = filters[0]?.value || '';
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
