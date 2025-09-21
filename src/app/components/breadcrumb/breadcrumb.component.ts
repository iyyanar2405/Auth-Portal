import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'auth-portal-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  template: `
    <div class="breadcrumb-container">
      <p-breadcrumb 
        [model]="breadcrumbs()" 
        [home]="home">
      </p-breadcrumb>
    </div>
  `,
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit {
  private readonly ROUTE_DATA_BREADCRUMB_KEY = 'breadcrumb';

  public home: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/dashboard',
    target: '_self',
  };
  public breadcrumbs = signal<MenuItem[]>([]);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.setRouterEvents();
    // Initialize with current route
    this.breadcrumbs.set(this.getBreadcrumbs(this.activatedRoute.root));
  }

  setRouterEvents(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        tap(() =>
          this.breadcrumbs.set(this.getBreadcrumbs(this.activatedRoute.root)),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private getBreadcrumbs(
    route: ActivatedRoute,
    url: string[] = [],
    breadcrumbs: MenuItem[] = [],
  ): MenuItem[] {
    const { children } = route;
    const routerLink: string[] = [...url];

    if (children.length === 0) {
      return breadcrumbs;
    }

    return children.reduce((_, child) => {
      const routeUrl: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');

      if (routeUrl !== '') {
        routerLink.push(routeUrl);
      }

      if (routerLink.length !== url.length) {
        const routeDataBreadcrumb =
          child.snapshot.data[this.ROUTE_DATA_BREADCRUMB_KEY];

        if (routeDataBreadcrumb !== undefined && !routeDataBreadcrumb?.isHidden) {
          breadcrumbs.push({
            label: routeDataBreadcrumb?.label || this.getFriendlyLabel(routeUrl),
            routerLink: [...routerLink],
          });
        } else if (routeUrl) {
          // Default breadcrumb for routes without explicit breadcrumb data
          breadcrumbs.push({
            label: this.getFriendlyLabel(routeUrl),
            routerLink: [...routerLink],
          });
        }
      }

      return this.getBreadcrumbs(child, routerLink, breadcrumbs);
    }, breadcrumbs);
  }

  private getFriendlyLabel(routeUrl: string): string {
    // Convert route URL to friendly labels
    const labelMap: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'demo': 'User Management',
      'profile': 'Profile Settings',
      'api-docs': 'API Documentation',
      'login': 'Login'
    };
    
    return labelMap[routeUrl] || routeUrl.charAt(0).toUpperCase() + routeUrl.slice(1);
  }
}
