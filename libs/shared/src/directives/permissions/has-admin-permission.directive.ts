import { NgIf } from '@angular/common';
import {
  Directive,
  inject,
  InjectionToken,
  Input,
  Signal,
  TemplateRef,
} from '@angular/core';

export const ADMIN_PERMISSION_CHECKER =
  new InjectionToken<AdminPermissionChecker>('ADMIN_PERMISSION_CHECKER');

export interface AdminPermissionChecker {
  readonly isUserAdmin: Signal<boolean>;
}

@Directive({
  selector: '[sharedHasAdminPermission]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class HasAdminPermissionDirective {
  private readonly ngIfRef = inject(NgIf);
  private readonly permissionChecker = inject(ADMIN_PERMISSION_CHECKER, {
    optional: true,
  });

  @Input()
  set sharedHasAdminPermission(roleName: string) {
    this.updateVisibility();
  }

  @Input()
  set sharedHasAdminPermissionElse(template: TemplateRef<any>) {
    this.ngIfRef.ngIfElse = template;
  }

  private updateVisibility() {
    if (!this.permissionChecker) {
      this.ngIfRef.ngIf = false;

      return;
    }

    try {
      const isAdmin = this.permissionChecker.isUserAdmin();
      this.ngIfRef.ngIf = isAdmin;
    } catch (error) {
      this.ngIfRef.ngIf = false;
    }
  }
}
