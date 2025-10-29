# MCP Server Features Overview

Complete overview of all available features and tools in the Redmine MCP Server.

## Core Features (Always Active)

These features are always available and cannot be disabled:

### Issues

**Available Tools:**
- `getIssues` - List issues with filters
- `createIssue` - Create new issue
- `getIssue` - Get issue details
- `updateIssue` - Update issue

**Capabilities:**
- Full CRUD operations on issues
- Advanced filtering and search
- Custom fields support
- Nested attributes for checklists (if plugin installed)

### Projects

**Available Tools:**
- `getProjects` - List all projects
- `getProject` - Get project details
- Project management tools

**Capabilities:**
- List accessible projects
- View project details
- Project hierarchy navigation

### Users

**Available Tools:**
- `getUsers` - List users
- `getUser` - Get user details
- `getCurrentUser` - Get current user info
- `getMyAccount` - Get my account details

**Capabilities:**
- User directory access
- User profile information
- Current user context

### Memberships

**Available Tools:**
- `getMemberships` - List project members
- `getMembership` - Get membership details
- Project member management

**Capabilities:**
- Project team visibility
- Role assignments
- Access control information

### Groups

**Available Tools:**
- `getGroups` - List user groups
- `getGroup` - Get group details
- `addUserToGroup` - Add user to group

**Capabilities:**
- Group-based user organization
- Bulk permission management
- Team structure

### Roles

**Available Tools:**
- `getRoles` - List available roles
- `getRole` - Get role details

**Capabilities:**
- Permission role information
- Access control configuration

### Trackers

**Available Tools:**
- `getTrackers` - List issue trackers

**Capabilities:**
- Issue type management
- Workflow information

### Issue Statuses

**Available Tools:**
- `getIssueStatuses` - List issue statuses

**Capabilities:**
- Workflow state information
- Status transitions

### Issue Categories

**Available Tools:**
- `getIssueCategories` - List project categories
- `getIssueCategory` - Get category details
- Category management

**Capabilities:**
- Issue categorization
- Project-specific categories

### Custom Fields

**Available Tools:**
- `getCustomFields` - List custom fields

**Capabilities:**
- Custom data structure
- Field definitions
- Field values in issues

### Enumerations

**Available Tools:**
- Priorities
- Time entry activities
- Document categories

**Capabilities:**
- System enumerations
- Dropdown values
- Activity types

### Search

**Available Tools:**
- `search` - Global search across Redmine

**Capabilities:**
- Full-text search
- Multi-entity search
- Result filtering

## Optional Features (Configurable)

These features can be disabled via environment variables.

### 1. Checklists (Plugin)

**Requires:** `redmine_checklists` plugin installed on Redmine

**Available Tools:**
- `getChecklistsByIssue` - List all checklists for an issue
- `createChecklist` - Add new checklist item to issue
- `getChecklist` - Get single checklist item details
- `updateChecklist` - Update checklist (toggle done, rename, reposition)
- `deleteChecklist` - Delete checklist item

**Capabilities:**
- Task breakdown within issues
- Progress tracking with checkboxes
- Section headers for organization
- Position/ordering management
- Done ratio calculation

**Configuration:**
```bash
REDMINE_MCP_DISABLE_CHECKLISTS=true  # Disable
```

**See also:** [checklist-plugin-support.md](features/checklist-plugin-support.md)

### 2. Issue Relations

**Available Tools:**
- `getIssueRelations` - List all relations for an issue
- `createIssueRelation` - Create relation between two issues

**Relation Types:**
- `relates` - General relationship
- `duplicates` / `duplicated` - Duplicate tracking
- `blocks` / `blocked` - Dependency blocking
- `precedes` / `follows` - Sequential ordering
- `copied_to` / `copied_from` - Copy relationships

**Capabilities:**
- Link related issues
- Define dependencies
- Track duplicates
- Model workflows
- Delay specification

**Configuration:**
```bash
REDMINE_MCP_DISABLE_RELATIONS=true  # Disable
```

### 3. Time Entries

**Available Tools:**
- `getTimeEntries` - List time entries with filters
- `createTimeEntry` - Log time on issue or project
- `updateTimeEntry` - Update existing time entry

**Capabilities:**
- Time tracking on issues
- Time tracking on projects (without issue)
- Activity categorization
- Cost calculation support
- Reporting data

**Common Activities:**
- Development
- Design
- Testing
- Documentation
- Management
- Support

**Configuration:**
```bash
REDMINE_MCP_DISABLE_TIME_ENTRIES=true  # Disable
```

### 4. Versions

**Available Tools:**
- `getVersionsByProject` - List project versions/milestones

**Capabilities:**
- Release planning
- Milestone tracking
- Version assignment to issues
- Due date tracking
- Status (open/locked/closed)

**Configuration:**
```bash
REDMINE_MCP_DISABLE_VERSIONS=true  # Disable
```

### Watchers

**Available Tools:**
- `addWatcher` - Add user as watcher to issue

**Capabilities:**
- Subscribe users to issue notifications
- Add observers to specific issues
- Manage notification recipients

**Configuration:**
```bash
REDMINE_MCP_DISABLE_WATCHERS=true  # Disable
```

## Disabled Features

These features exist in the OpenAPI spec but are currently disabled:

### Attachments (File Operations)

**Status:** Disabled (commented out in server.ts)

**Potential Tools:**
- File upload from local filesystem
- File download to local filesystem
- Base64 content upload/download
- Thumbnail download

**Reason:** Requires special file handling, security considerations

### Wiki Pages

**Status:** Disabled

**Potential Tools:**
- List wiki pages
- Get wiki page content
- Create/update wiki pages

**Reason:** Limited use case in MCP context

### News

**Status:** Disabled

**Potential Tools:**
- List news
- Get news details
- Create news

**Reason:** Read-only feature, limited utility

## Feature Comparison

| Feature | Always Active | Configurable | Requires Plugin | WRITE Support |
|---------|---------------|--------------|-----------------|---------------|
| Issues | ✓ | ✗ | ✗ | ✓ |
| Projects | ✓ | ✗ | ✗ | ✗ |
| Users | ✓ | ✗ | ✗ | ✗ |
| Checklists | ✗ | ✓ | ✓ | ✓ |
| Relations | ✗ | ✓ | ✗ | ✓ |
| Time Entries | ✗ | ✓ | ✗ | ✓ |
| Versions | ✗ | ✓ | ✗ | ✗ |
| Memberships | ✓ | ✗ | ✗ | ✗ |
| Groups | ✓ | ✗ | ✗ | ✓ |
| Search | ✓ | ✗ | ✗ | ✗ |

## Use Cases

### Project Management
- Create and track issues
- Organize with categories and trackers
- Plan releases with versions
- Track team with memberships

### Task Management
- Break down issues with checklists
- Link related issues with relations
- Track progress with statuses
- Categorize work

### Time & Cost Tracking
- Log time on issues
- Track activities
- Generate reports
- Calculate costs

### Team Collaboration
- Add watchers to issues
- Organize users in groups
- Assign roles and permissions
- Track project members

## Integration Examples

### Claude Code / AI Assistants

Use the MCP tools to:
- **Create issues** from conversation
- **Track tasks** with checklists
- **Log time** automatically
- **Link related work** with relations
- **Search** existing issues and documentation

### Automation

Use the MCP server to:
- **Auto-create issues** from external events
- **Update progress** based on git commits
- **Sync data** with other tools
- **Generate reports** with custom queries

### Development Workflow

Typical flow:
1. **Search** for existing issue or feature
2. **Create issue** if not exists
3. **Add checklist** for implementation steps
4. **Link** to related issues
5. **Log time** as you work
6. **Update issue** with progress
7. **Mark checklist items** as done

## API Compatibility

**Redmine Version:** 4.0+
**API Version:** v3

All tools use the official Redmine REST API. The MCP server is a wrapper that provides:
- Type-safe interfaces (TypeScript)
- Zod schema validation
- Standardized error handling
- MCP protocol compliance

## Security & Permissions

All tools respect Redmine's permission system:

- **API Key** - Required for authentication
- **User Permissions** - Tool access based on user roles
- **Project Access** - Only accessible projects visible
- **Read-Only Mode** - Optional server-wide write protection

See [configuration.md](configuration.md) for security setup.

## Performance Considerations

**Caching:** None (all requests go directly to Redmine)

**Rate Limiting:** Depends on your Redmine instance

**Best Practices:**
- Use filters to reduce response size
- Paginate large result sets
- Cache frequent queries client-side
- Batch operations when possible

## Future Features

Potential additions:
- [ ] Attachments (file upload/download)
- [ ] Wiki pages
- [ ] Forums
- [ ] Calendar/Gantt data
- [ ] Advanced custom field queries
- [ ] Bulk operations
- [ ] Webhooks/notifications

## See Also

- [configuration.md](configuration.md) - Environment variables and feature flags
- [features/checklist-plugin-support.md](features/checklist-plugin-support.md) - Checklist details
- [README.md](../README.md) - Setup and installation
- [DEVELOPMENT.md](../DEVELOPMENT.md) - Development guide
