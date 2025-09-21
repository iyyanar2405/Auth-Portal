import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

interface ErrorState {
  message: string;
  entityType?: string;
}

@Component({
  selector: 'auth-portal-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements OnInit {
  private readonly router = inject(Router);

  errorMessage = 'An error occurred. Please try again.';
  errorTitle = 'Error';

  ngOnInit(): void {
    const state = window.history.state as ErrorState;
    if (state?.message) {
      this.errorMessage = `Error: ${state.message}`;
      if (state.entityType) {
        this.errorMessage += ` (Entity: ${state.entityType})`;
      }
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
