import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private _breadcrumbVisibility = new BehaviorSubject<boolean>(false);
  readonly breadcrumbVisibility$ = this._breadcrumbVisibility.asObservable();

  setBreadcrumbVisibility(isVisible: boolean) {
    this._breadcrumbVisibility.next(isVisible);
  }
}
