# Database Requirements Document (DRD)
# AssetVault: Digital Asset Management System

## 1. Introduction

This Database Requirements Document (DRD) outlines the comprehensive database schema design for AssetVault, a Digital Asset Management (DAM) system. The document covers all database entities, relationships, and fields required to support the functionality described in the Product Requirements Document (PRD) and Feature Requirements Document (FRD).

## 2. Database Schema Overview

The database schema is designed to support the following core functional areas:
- User authentication and role-based access control
- Hierarchical folder structure management
- Digital asset storage and metadata management
- Tagging and categorization
- Search functionality
- Favorites and personal organization
- Sharing and collaboration

## 3. Entity Relationship Diagram

Below is a high-level representation of the database schema and relationships:

users ─┬─── user_roles ─── roles ─── role_permissions ─── permissions
│
├─── favorites
│
├─── recent_items
│
└─── user_folders ─┬─ folders ─┬─ folder_permissions
│           │
│           └─ assets ─┬─ asset_metadata
│                      │
│                      ├─ asset_tags ─── tags
│                      │
│                      ├─ asset_versions
│                      │
│                      └─ asset_shares
│
└─ saved_searches

## 4. Schema Definitions

### 4.1 User Management

#### 4.1.1 users
Stores information about system users.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| username | string | User's login name | Unique, Not null |
| email | string | User's email address | Unique, Not null |
| password_hash | string | Hashed password | Not null |
| first_name | string | User's first name | Not null |
| last_name | string | User's last name | Not null |
| profile_picture_url | string | URL to profile picture | Nullable |
| is_active | boolean | User account status | Default: true |
| last_login_date | datetime | Last login timestamp | Nullable |
| created_at | datetime | Account creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

#### 4.1.2 roles
Defines user roles within the system.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| name | string | Role name | Unique, Not null |
| description | string | Role description | Nullable |
| created_at | datetime | Role creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

#### 4.1.3 user_roles
Maps users to their assigned roles (many-to-many relationship).

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| user_id | integer | Reference to users table | Foreign Key, Not null |
| role_id | integer | Reference to roles table | Foreign Key, Not null |
| created_at | datetime | Assignment date | Not null, Default: current_timestamp |

#### 4.1.4 permissions
Defines system permissions that can be assigned to roles.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| name | string | Permission name | Unique, Not null |
| description | string | Permission description | Nullable |
| created_at | datetime | Permission creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

#### 4.1.5 role_permissions
Maps roles to their assigned permissions (many-to-many relationship).

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| role_id | integer | Reference to roles table | Foreign Key, Not null |
| permission_id | integer | Reference to permissions table | Foreign Key, Not null |
| created_at | datetime | Assignment date | Not null, Default: current_timestamp |

### 4.2 Folder Management

#### 4.2.1 folders
Stores the hierarchical folder structure.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| name | string | Folder name | Not null |
| description | string | Folder description | Nullable |
| parent_folder_id | integer | Reference to parent folder | Foreign Key, Nullable |
| created_by | integer | User who created the folder | Foreign Key (users.id), Not null |
| path | string | Full path of the folder | Not null |
| is_deleted | boolean | Soft delete flag | Default: false |
| created_at | datetime | Folder creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

#### 4.2.2 folder_permissions
Defines access permissions for folders.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| folder_id | integer | Reference to folders table | Foreign Key, Not null |
| role_id | integer | Role this permission applies to | Foreign Key (roles.id), Nullable |
| user_id | integer | User this permission applies to | Foreign Key (users.id), Nullable |
| permission_level | string | Permission level (no_access, view, download, edit, full_control) | Not null |
| inherit_to_subfolders | boolean | Whether subfolders inherit this permission | Default: true |
| created_at | datetime | Permission creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

### 4.3 Asset Management

#### 4.3.1 assets
Stores information about uploaded digital assets.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| title | string | Asset title/name | Not null |
| description | string | Asset description | Nullable |
| file_name | string | Original filename | Not null |
| file_path | string | Path to stored file | Not null |
| file_size | integer | File size in bytes | Not null |
| file_type | string | MIME type | Not null |
| folder_id | integer | Folder containing the asset | Foreign Key (folders.id), Not null |
| created_by | integer | User who uploaded the asset | Foreign Key (users.id), Not null |
| thumbnail_path | string | Path to generated thumbnail | Nullable |
| is_deleted | boolean | Soft delete flag | Default: false |
| version_count | integer | Number of versions | Default: 1 |
| current_version_id | integer | Current active version | Nullable |
| created_at | datetime | Asset creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

#### 4.3.2 asset_metadata
Stores additional metadata for assets.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| asset_id | integer | Reference to assets table | Foreign Key, Not null |
| metadata_key | string | Metadata field name | Not null |
| metadata_value | string | Metadata field value | Nullable |
| created_at | datetime | Metadata creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

#### 4.3.3 asset_versions
Tracks versions of assets.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| asset_id | integer | Reference to assets table | Foreign Key, Not null |
| version_number | integer | Sequential version number | Not null |
| file_path | string | Path to version file | Not null |
| file_size | integer | File size in bytes | Not null |
| created_by | integer | User who created this version | Foreign Key (users.id), Not null |
| change_notes | string | Notes about version changes | Nullable |
| created_at | datetime | Version creation date | Not null, Default: current_timestamp |

### 4.4 Tagging System

#### 4.4.1 tags
Stores available tags for categorizing assets.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| name | string | Tag name | Unique, Not null |
| created_by | integer | User who created the tag | Foreign Key (users.id), Not null |
| created_at | datetime | Tag creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

#### 4.4.2 asset_tags
Maps assets to their assigned tags (many-to-many relationship).

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| asset_id | integer | Reference to assets table | Foreign Key, Not null |
| tag_id | integer | Reference to tags table | Foreign Key, Not null |
| created_by | integer | User who tagged the asset | Foreign Key (users.id), Not null |
| created_at | datetime | Tagging date | Not null, Default: current_timestamp |

### 4.5 User Preferences and Organization

#### 4.5.1 favorites
Tracks assets and folders marked as favorites by users.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| user_id | integer | Reference to users table | Foreign Key, Not null |
| asset_id | integer | Reference to assets table | Foreign Key, Nullable |
| folder_id | integer | Reference to folders table | Foreign Key, Nullable |
| created_at | datetime | Favorite marking date | Not null, Default: current_timestamp |

#### 4.5.2 recent_items
Tracks recently accessed assets for each user.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| user_id | integer | Reference to users table | Foreign Key, Not null |
| asset_id | integer | Reference to assets table | Foreign Key, Not null |
| access_type | string | Type of access (view, edit, download) | Not null |
| accessed_at | datetime | Last access timestamp | Not null, Default: current_timestamp |

#### 4.5.3 saved_searches
Stores saved search queries for users.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| user_id | integer | Reference to users table | Foreign Key, Not null |
| name | string | Search name | Not null |
| search_query | json | Search parameters | Not null |
| created_at | datetime | Search creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

### 4.6 Sharing and Collaboration

#### 4.6.1 asset_shares
Records sharing of assets with internal users or via links.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| asset_id | integer | Reference to assets table | Foreign Key, Not null |
| shared_by | integer | User who shared the asset | Foreign Key (users.id), Not null |
| shared_with_user | integer | Internal user recipient | Foreign Key (users.id), Nullable |
| share_link | string | Generated share link | Nullable |
| link_token | string | Unique token for link | Nullable |
| permission_level | string | Permission level (view, download, edit) | Not null |
| password_hash | string | Optional password for link | Nullable |
| expiry_date | datetime | Link expiration date | Nullable |
| access_count | integer | Number of times accessed | Default: 0 |
| max_access_count | integer | Maximum allowed accesses | Nullable |
| is_active | boolean | Whether share is active | Default: true |
| created_at | datetime | Share creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

#### 4.6.2 user_folders
Maps users to folders for quick access (including shared folders).

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Primary Key, Auto-increment |
| user_id | integer | Reference to users table | Foreign Key, Not null |
| folder_id | integer | Reference to folders table | Foreign Key, Not null |
| access_type | string | How this folder appears to user (owned, shared, default) | Not null |
| created_at | datetime | Relationship creation date | Not null, Default: current_timestamp |
| updated_at | datetime | Last update date | Not null, Default: current_timestamp |

## 5. Key Database Relationships

### 5.1 User Relationships
- A user can have multiple roles (via user_roles)
- A user can create multiple folders and assets
- A user can have multiple favorites
- A user can have multiple recent_items
- A user can have multiple saved_searches
- A user can share multiple assets

### 5.2 Folder Relationships
- A folder can have one parent folder
- A folder can have multiple child folders
- A folder can contain multiple assets
- A folder can have multiple folder_permissions
- A folder can be favorited by multiple users
- A folder can be associated with multiple users via user_folders

### 5.3 Asset Relationships
- An asset belongs to one folder
- An asset can have multiple versions
- An asset can have multiple metadata entries
- An asset can have multiple tags (via asset_tags)
- An asset can be favorited by multiple users
- An asset can be shared multiple times (via asset_shares)
- An asset can appear in multiple users' recent_items

## 6. Indexing Strategy

To ensure optimal performance, the following indexes should be implemented:

### 6.1 Primary Indexes
- Primary keys on all tables (id fields)

### 6.2 Foreign Key Indexes
- All foreign key fields should be indexed

### 6.3 Performance Indexes
- users: username, email
- assets: folder_id, created_by, file_type
- folders: parent_folder_id, created_by, path
- folder_permissions: folder_id, role_id, user_id
- asset_tags: asset_id, tag_id
- tags: name
- favorites: user_id, asset_id, folder_id
- recent_items: user_id, accessed_at
- asset_shares: asset_id, shared_by, shared_with_user, link_token

### 6.4 Search Optimization Indexes
- assets: title (full text index)
- assets: description (full text index)
- asset_metadata: metadata_value
- tags: name

## 7. Data Integrity Constraints

### 7.1 Referential Integrity
- All foreign keys should be properly constrained to their parent tables
- Delete operations should be handled with appropriate cascading or restriction

### 7.2 Unique Constraints
- users: username, email
- roles: name
- permissions: name
- tags: name

### 7.3 Check Constraints
- folder_permissions.permission_level must be one of: no_access, view, download, edit, full_control
- asset_shares.permission_level must be one of: view, download, edit

## 8. Initialization Data

The following initial data should be seeded:

### 8.1 Roles
- System Administrator
- Content Manager
- Content Creator/Editor
- General User

### 8.2 Permissions
- manage_users
- manage_roles
- manage_system_settings
- create_folders
- edit_folders
- delete_folders
- set_permissions
- upload_assets
- edit_assets
- delete_assets
- download_assets
- share_assets
- view_assets

### 8.3 Role Permissions Mapping
- System Administrator: All permissions
- Content Manager: create_folders, edit_folders, delete_folders, set_permissions, upload_assets, edit_assets, delete_assets, download_assets, share_assets, view_assets
- Content Creator/Editor: upload_assets, edit_assets, download_assets, share_assets, view_assets
- General User: download_assets, view_assets

## 9. Considerations for Scale and Performance

### 9.1 Large Table Strategies
- For the assets table, consider partitioning by date or folder_id for large installations
- Implement table partitioning for asset_versions if version control is heavily used
- Consider separating current metadata and historical metadata for performance

### 9.2 Query Optimization
- Use prepared statements for frequent queries
- Implement query caching for common operations
- Consider materialized views for complex reports and dashboards

### 9.3 Data Archiving Strategy
- Implement a strategy for archiving old assets and versions
- Consider moving infrequently accessed assets to cold storage
- Develop a process for cleaning up expired shares and orphaned data

## 10. Security Considerations

### 10.1 Sensitive Data
- Ensure password_hash fields are properly hashed and salted
- Implement encryption for share_link tokens and passwords
- Consider encryption for file paths in production environments

### 10.2 Access Controls
- Implement row-level security where appropriate
- Ensure database credentials are properly secured
- Implement database user roles with appropriate permissions

## 11. Migration and Versioning

### 11.1 Schema Versioning
- Implement schema versioning to track database changes
- Document all schema migrations with up and down scripts

### 11.2 Data Migration
- Plan for data migration strategies when schema changes
- Implement data validation during migrations
- Develop rollback procedures for failed migrations

## 12. Audit and Logging

### 12.1 Audit Requirements
Consider a separate audit table for tracking:
- User logins/logouts
- Permission changes
- Asset modifications and deletions
- Folder structure changes
- Sharing activities

## 13. Database Technology Considerations

This schema is designed to be implemented in standard relational database systems. The following technologies are recommended:
- PostgreSQL or MySQL for primary database
- Redis for caching frequent queries and search results
- Consider NoSQL options for metadata storage if extremely complex or variable metadata is required

## 14. Conclusion

This Database Requirements Document provides a comprehensive schema design for the AssetVault Digital Asset Management system. The schema supports all functionality outlined in the Product and Feature Requirements Documents while maintaining appropriate performance, security, and scalability characteristics.

Implementation of this schema will provide the necessary data structure to support user management, asset organization, metadata management, search capabilities, and sharing functionality required by the system.