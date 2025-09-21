import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { ErrorCardComponent } from '@customer-portal/shared/components';
import { RouteConfig } from '@customer-portal/shared/constants';

interface ErrorState {
  message: string;
  entityType?: string;
}

@Component({
  selector: 'customer-portal-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  imports: [CommonModule, TranslocoDirective, ErrorCardComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements OnInit {
  private readonly ts = inject(TranslocoService);
  private readonly router = inject(Router);

  readonly errorMessage: Signal<string> = computed(() => {
    const state = window.history.state as ErrorState;
    if (!state?.message) {
      return this.ts.translate('error.initialization.message');
    }

    const translationKey = `error.${state.message}.message`;
    const params = state.entityType ? { entityType: state.entityType } : undefined;

    return this.ts.translate(translationKey, params);
  });

  readonly errorTitle: Signal<string> = computed(() => {
    const state = window.history.state as ErrorState;
    if (!state?.message) {
      return this.ts.translate('error.initialization.title');
    }

    const translationKey = `error.${state.message}.title`;
    const params = state.entityType ? { entityType: state.entityType } : undefined;

    return this.ts.translate(translationKey, params);
  });

  ngOnInit(): void {
    const state = window.history.state as ErrorState;
    if (!state?.message) {
      this.router.navigate([RouteConfig.Welcome.path]);
    }
  }
}
