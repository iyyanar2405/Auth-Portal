import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

interface LinkModel {
  url: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'auth-portal-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-left">
          <div class="footer-links">
            <a *ngFor="let link of footerLeftLinks" 
               [href]="link.url" 
               target="_blank" 
               class="footer-link">
              {{ link.label }}
            </a>
          </div>
        </div>
        <div class="footer-right">
          <div class="footer-links">
            <a *ngFor="let link of footerRightLinks" 
               [href]="link.url" 
               target="_blank" 
               class="footer-link">
              <i *ngIf="link.icon" [class]="link.icon"></i>
              {{ link.label }}
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Auth Portal. All rights reserved.</p>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  footerLeftLinks: LinkModel[] = [
    {
      url: 'https://www.dnv.com/assurance',
      label: 'About Us',
    },
    {
      url: 'https://www.dnv.com/privacy/',
      label: 'Privacy Statement',
    },
    {
      url: 'https://www.dnv.com/terms/',
      label: 'Terms of Use',
    },
  ];

  footerRightLinks: LinkModel[] = [
    {
      url: 'https://www.linkedin.com/showcase/dnv-assurance',
      label: 'LinkedIn',
      icon: 'pi pi-linkedin',
    },
    {
      url: 'https://www.dnv.com/system/copyright/',
      label: 'Copyright',
    },
  ];
}
