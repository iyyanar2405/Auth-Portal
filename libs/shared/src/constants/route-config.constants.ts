/**
 * Defines all route configurations in the application.
 * This ensures consistency between route definitions, telemetry tracking, and internationalization.
 */
export const RouteConfig = {
  Overview: {
    path: 'overview',
    title: 'Overview Upcoming Audits',
    i18nKey: 'overview',
    pageViewRequest: 'overview',
  },
  Findings: {
    path: 'findings',
    title: 'Findings',
    i18nKey: 'findings',
    pageViewRequest: 'findings',
  },
  Audits: {
    path: 'audits',
    title: 'Audits',
    i18nKey: 'audits',
    pageViewRequest: 'audits',
  },
  Certificates: {
    path: 'certificates',
    title: 'Certificates',
    i18nKey: 'certificates',
    pageViewRequest: 'certificates',
  },
  Contracts: {
    path: 'contracts',
    title: 'Contracts',
    i18nKey: 'contracts',
    pageViewRequest: 'contracts',
  },
  Financials: {
    path: 'financials',
    title: 'Financials',
    i18nKey: 'financials',
    pageViewRequest: 'financials',
  },
  Schedule: {
    path: 'schedule',
    title: 'Schedule',
    i18nKey: 'schedule',
    pageViewRequest: 'schedule',
  },
  Actions: {
    path: 'actions',
    title: 'Actions',
    i18nKey: 'actions',
    pageViewRequest: 'actions',
  },
  Notifications: {
    path: 'notifications',
    title: 'Notifications',
    i18nKey: 'notifications',
    pageViewRequest: 'notifications',
  },
  Settings: {
    path: 'settings',
    title: 'Settings',
    i18nKey: 'settings',
    pageViewRequest: 'settings',
  },
  ExternalApps: {
    path: 'apps',
    title: 'External Apps',
    i18nKey: 'apps',
    pageViewRequest: 'apps',
  },
  Welcome: {
    path: 'welcome',
    title: 'Welcome',
    i18nKey: 'welcome',
    pageViewRequest: 'welcome',
  },
  Logout: {
    path: 'logout',
    title: 'Logout',
    i18nKey: 'logout',
    pageViewRequest: 'logout',
  },
} as const;

/**
 * Type representing the keys of the RouteConfig object
 */
export type RouteConfigKey = keyof typeof RouteConfig;

/**
 * Type representing route data with title, i18n key and page view request
 */
export interface RouteData {
  path: string;
  title: string;
  i18nKey: string;
  pageViewRequest: string;
}

/**
 * Helper function to create path->title mapping for telemetry
 */
export function createRouteTitleMap(): Record<string, string> {
  const map: Record<string, string> = {
    '': RouteConfig.Overview.title, // Default route
  };

  // Add all route paths with their titles
  Object.values(RouteConfig).forEach((route) => {
    map[route.path] = route.title;
  });

  return map;
}

/**
 * Helper function to get route data for a given path
 */
export function getRouteDataByPath(path: string): RouteData | undefined {
  const normPath = path.startsWith('/') ? path.substring(1) : path;

  // Check for exact match first
  const key = Object.keys(RouteConfig).find(
    (configKey) => RouteConfig[configKey as RouteConfigKey].path === normPath,
  ) as RouteConfigKey | undefined;

  if (key) {
    return RouteConfig[key];
  }

  // Check for path that starts with the given path (for nested routes)
  const nestedKey = Object.keys(RouteConfig).find((configKey) =>
    normPath.startsWith(`${RouteConfig[configKey as RouteConfigKey].path}/`),
  ) as RouteConfigKey | undefined;

  if (nestedKey) {
    return RouteConfig[nestedKey];
  }

  return undefined;
}
