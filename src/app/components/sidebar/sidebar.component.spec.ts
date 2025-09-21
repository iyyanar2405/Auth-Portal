import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { 
  createProfileStoreServiceMock, 
  ProfileStoreService 
} from '@auth-portal/data-access/settings';
import { createTranslationServiceMock } from '@auth-portal/shared';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let translocoService: Partial<TranslocoService>;
  let profileStoreService: Partial<ProfileStoreService>;

  beforeEach(() => {
    translocoService = createTranslationServiceMock();
    profileStoreService = createProfileStoreServiceMock();

    TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: TranslocoService, useValue: translocoService },
        { provide: ProfileStoreService, useValue: profileStoreService },
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  test('should handle onClose correctly', () => {
    const closeEventSpy = jest.spyOn(component.closeEvent, 'emit');
    component.onClose();
    expect(closeEventSpy).toHaveBeenCalled();
  });
});