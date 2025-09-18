export enum Permission {
  // System Management
  MANAGE_SYSTEM_SETTINGS = 'manage-system-settings',

  // Tenant/Organization Management
  MANAGE_TENANT_SETTINGS = 'manage-tenant-settings',

  // User & Role Management
  MANAGE_ALL_USERS = 'manage-all-users',
  MANAGE_TEAM_USERS = 'manage-team-users',

  // Billing & Subscription Management
  MANAGE_BILLING = 'manage-billing',
  VIEW_BILLING = 'view-billing',

  // Content Creation & Management
  CREATE_CONTENT = 'create-content',
  EDIT_OWN_CONTENT = 'edit-own-content',
  EDIT_ANY_CONTENT = 'edit-any-content',
  PUBLISH_CONTENT = 'publish-content',
  UNPUBLISH_DELETE_CONTENT = 'unpublish-delete-content',

  // Media/Assets Management
  MANAGE_ASSETS = 'manage-assets',

  // Categories/Tags Management
  MANAGE_CATEGORIES_TAGS = 'manage-categories-tags',

  // Comments/Community Management
  MANAGE_COMMENTS = 'manage-comments',

  // Content Viewing
  VIEW_ALL_CONTENT = 'view-all-content',
  VIEW_OWN_CONTENT = 'view-own-content',
  VIEW_PUBLISHED_CONTENT = 'view-published-content',

  // Analytics & Reports
  VIEW_ANALYTICS = 'view-analytics',
  EXPORT_REPORTS = 'export-reports',
}
