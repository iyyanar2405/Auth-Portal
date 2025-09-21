import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { createTranslationServiceMock } from '@auth-portal/shared';
import { SupportBoxComponent } from './support-box.component';

describe('SupportBoxComponent', () => {
  let component: SupportBoxComponent;
  let fixture: ComponentFixture<SupportBoxComponent>;
  let translocoService: Partial<TranslocoService>;

  beforeEach(async () => {
    translocoService = createTranslationServiceMock();

    await TestBed.configureTestingModule({
      imports: [SupportBoxComponent],
      providers: [
        { provide: TranslocoService, useValue: translocoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});