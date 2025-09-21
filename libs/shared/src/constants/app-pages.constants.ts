export const enum AppPagesEnum {
  Overview = '/overview',
  Analytics = '/analytics',
  Schedule = '/schedule',
  Audits = '/audits',
  Findings = '/findings',
  Financials = '/financials',
  Certificates = '/certificates',
  Trainings = '/trainings',
  Contracts = '/contracts',
  Notifications = '/notifications',
  Actions = '/actions',
  Settings = '/settings',
  Apps = '/apps',
  Welcome = '/welcome',
  Logout = '/logout',
  CoBrowsingCompanySelect = '/settings/admin',
  CoBrowsingMembersSelect = '/settings/admin-members',
}

export const enum DetailedPagesNavigation {
  ScheduleList = '/schedule/list',
  SettingsMembersTab = '/settings?tab=members',
}

export const appPublicPages: string[] = [
  AppPagesEnum.Welcome,
  AppPagesEnum.Logout,
];
