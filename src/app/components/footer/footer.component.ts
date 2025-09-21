import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

interface LinkModel {
  url: string;
  label: string;
  icon?: string;
}
@Component({
  selector: 'customer-portal-footer',
  imports: [CommonModule, TranslocoDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  footerLeftLinks: LinkModel[] = [
    {
      url: 'https://www.dnv.com/assurance',
      label: 'footer.aboutUs',
    },
    {
      url: 'https://www.dnv.com/privacy/',
      label: 'footer.privacyStatement',
    },
    {
      url: 'https://www.dnv.com/terms/',
      label: 'footer.termsOfUse',
    },
  ];

  footerRightLinks: LinkModel[] = [
    {
      url: 'https://www.linkedin.com/showcase/dnv-assurance',
      label: 'footer.linkedin',
      icon: 'pi pi-linkedin',
    },
    {
      url: 'https://www.dnv.com/system/copyright/',
      label: 'footer.copyright',
    },
  ];
}
