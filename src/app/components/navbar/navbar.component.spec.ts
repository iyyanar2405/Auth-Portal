import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';
import { MessageService } from 'primeng/api';

import { LoggingService, ServiceNowService } from '@customer-portal/core';
import { UnreadActionsStoreService } from '@customer-portal/data-access/actions';
import { UnreadNotificationsStoreService } from '@customer-portal/data-access/notifications';
import { createTranslationServiceMock } from '@customer-portal/shared';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let translocoService: Partial<TranslocoService>;

    // Create mocks for injected services
    const mockServiceNowService: Partial<ServiceNowService> = {
        openCatalogItemSupport: jest.fn(),
    };

    const mockMessageService: Partial<MessageService> = {
        add: jest.fn(),
    };

    const mockLoggingService: Partial<LoggingService> = {
        logException: jest.fn(),
    };

    const mockUnreadNotificationsStoreService: Partial<UnreadNotificationsStoreService> = {
        loadUnreadNotifications: jest.fn(),
    };

    const mockUnreadActionsStoreService: Partial<UnreadActionsStoreService> = {
        loadUnreadActions: jest.fn(),
    };

    beforeEach(() => {
        translocoService = createTranslationServiceMock();
        
        TestBed.configureTestingModule({
            imports: [NavbarComponent, NgxsModule.forRoot([])],
            providers: [
                { provide: TranslocoService, useValue: translocoService },
                { provide: ServiceNowService, useValue: mockServiceNowService },
                { provide: MessageService, useValue: mockMessageService },
                { provide: LoggingService, useValue: mockLoggingService },
                { provide: UnreadNotificationsStoreService, useValue: mockUnreadNotificationsStoreService },
                { provide: UnreadActionsStoreService, useValue: mockUnreadActionsStoreService },
            ]
        }).compileComponents();
        
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should handle onToggleSidebar correctly', () => {
        // Arrange
        const toggleSidebarEventSpy = jest.spyOn(component.toggleSidebarEvent, 'emit');

        // Act
        component.onToggleSidebar(true);

        // Assert
        expect(toggleSidebarEventSpy).toHaveBeenCalledWith(true);

        // Act
        component.onToggleSidebar(false);

        // Assert
        expect(toggleSidebarEventSpy).toHaveBeenCalledWith(false);
    });
});