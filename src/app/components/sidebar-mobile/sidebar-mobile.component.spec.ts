import { SidebarMobileComponent } from './sidebar-mobile.component';

describe('SidebarMobileComponent', () => {
  let component: SidebarMobileComponent;

  beforeEach(() => {
    component = new SidebarMobileComponent();
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize invisible as false', () => {
    expect(component.isVisible()).toBe(false);
  });

  test('should toggle visibility correctly', () => {
    // Show sidebar
    component.onToggle(true);
    expect(component.isVisible()).toBe(true);

    // Hide sidebar
    component.onToggle(false);
    expect(component.isVisible()).toBe(false);
  });
});