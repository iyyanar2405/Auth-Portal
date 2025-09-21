import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { concatMap, take } from 'rxjs';

import { AppInitializerService } from '@auth-portal/permissions';
import {
    buttonStyleClass,
    CoBrowsingCookieService,
    CoBrowsingShareService,
    Language,
    ShareBButtonComponent,
    ShareBButtonType,
} from '@auth-portal/shared';

@Component({
    selector: 'auth-portal-navbar-co-browsing',
    standalone: true,
    imports: [CommonModule, TranslocoDirective, ShareBButtonComponent],
    templateUrl: './navbar-co-browsing.component.html',
    styleUrls: ['./navbar-co-browsing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarCoBrowsingComponent {
    shareBButtonType = ShareBButtonType;

    constructor(
        public readonly coBrowsingShareService: CoBrowsingShareService,
        private readonly confirmationService: ConfirmationService,
        private readonly ts: TranslocoService,
        private readonly coBrowsingCookieService: CoBrowsingCookieService,
        private readonly appInitializerService: AppInitializerService,
    ) {}

    onCoBrowsingEndModal(): void {
        this.confirmationService.confirm({
            header: this.ts.translate('cobrowsing.modal.title'),
            message: this.ts.translate('cobrowsing.modal.description'),
            acceptLabel: this.ts.translate('cobrowsing.modal.confirm'),
            rejectLabel: this.ts.translate('cobrowsing.modal.cancel'),
            acceptButtonStyleClass: [
                buttonStyleClass.noIcon,
                buttonStyleClass.outlined,
            ].join(' '),
            rejectButtonStyleClass: [
                buttonStyleClass.noIcon,
                buttonStyleClass.outlined,
            ].join(' '),
            accept: () => this.onCoBrowsingEndConfirm(),
        });
    }

    onCoBrowsingEndConfirm(): void {
        this.coBrowsingCookieService
            .postUserEmailCookie(null)
            .pipe(
                take(1),
                concatMap(() => this.appInitializerService.initializePermissions())
            )
            .subscribe(() => this.ts.setActiveLang(Language.English));
    }
}