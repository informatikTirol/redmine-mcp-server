# MCP Server Configuration

## Environment Variables

### Core Configuration

**Required:**
- `REDMINE_URL` - Base URL of your Redmine instance (e.g., `https://devops.geobility.systems`)
- `REDMINE_API_KEY` - Your Redmine API key (found in My Account → API access key)

**Optional:**
- `REDMINE_MCP_READ_ONLY=true` - Enable read-only mode (disables all WRITE tools)

### Feature Flags

Control which features/tools are available in the MCP server. **Default: All enabled** unless explicitly disabled.

#### Disable Features

Set any of these to `true` to disable the corresponding feature:

```bash
# Disable checklist tools (requires redmine_checklists plugin)
REDMINE_MCP_DISABLE_CHECKLISTS=true

# Disable issue relations tools
REDMINE_MCP_DISABLE_RELATIONS=true

# Disable time entry tools
REDMINE_MCP_DISABLE_TIME_ENTRIES=true

# Disable version tools
REDMINE_MCP_DISABLE_VERSIONS=true

# Disable watcher tools
REDMINE_MCP_DISABLE_WATCHERS=true
```

## Available Features

### Checklists (Plugin)

**Tools:**
- `getChecklistsByIssue` - List all checklists for an issue
- `createChecklist` - Add new checklist item
- `getChecklist` - Show checklist details
- `updateChecklist` - Update checklist (toggle, rename)
- `deleteChecklist` - Delete checklist item

**Requirements:**
- Requires `redmine_checklists` plugin installed on Redmine
- User needs `view_checklists` and `edit_checklists` permissions

**Disable:** `REDMINE_MCP_DISABLE_CHECKLISTS=true`

### Issue Relations

**Tools:**
- `getIssueRelations` - List relations for an issue
- `createIssueRelation` - Create relation between issues

**Use Cases:**
- Link related issues
- Mark duplicates
- Define blockers/dependencies

**Disable:** `REDMINE_MCP_DISABLE_RELATIONS=true`

### Time Entries

**Tools:**
- `getTimeEntries` - List time entries
- `createTimeEntry` - Log time on issue/project
- `updateTimeEntry` - Update existing time entry

**Use Cases:**
- Time tracking
- Project cost reporting
- Activity logging

**Disable:** `REDMINE_MCP_DISABLE_TIME_ENTRIES=true`

### Versions

**Tools:**
- `getVersionsByProject` - List project versions/milestones

**Use Cases:**
- Release planning
- Milestone tracking
- Version assignment

**Disable:** `REDMINE_MCP_DISABLE_VERSIONS=true`

### Watchers

**Tools:**
- `addWatcher` - Add user as watcher to issue

**Use Cases:**
- Subscribe users to issue notifications
- Assign observers to issues
- Manage notification recipients

**Disable:** `REDMINE_MCP_DISABLE_WATCHERS=true`

## Core Features (Always Active)

These features cannot be disabled as they are core to Redmine:

- **Issues** - Create, read, update issues
- **Projects** - List and manage projects
- **Users** - User management
- **Memberships** - Project member management
- **Groups** - User group management
- **Roles** - Permission roles
- **Trackers** - Issue types (Bug, Feature, etc.)
- **Issue Statuses** - Workflow states
- **Issue Categories** - Issue categorization
- **Custom Fields** - Custom data fields
- **Enumerations** - Issue priorities, activities
- **Search** - Global search

## Configuration Examples

### Minimal Setup (Core Only)

```bash
# .env
REDMINE_URL=https://devops.geobility.systems
REDMINE_API_KEY=your_api_key_here

# Disable all optional features
REDMINE_MCP_DISABLE_CHECKLISTS=true
REDMINE_MCP_DISABLE_RELATIONS=true
REDMINE_MCP_DISABLE_TIME_ENTRIES=true
REDMINE_MCP_DISABLE_VERSIONS=true
REDMINE_MCP_DISABLE_WATCHERS=true
```

### Full Setup (All Features)

```bash
# .env
REDMINE_URL=https://devops.geobility.systems
REDMINE_API_KEY=your_api_key_here

# All features enabled by default (no DISABLE flags needed)
```

### Read-Only Mode

```bash
# .env
REDMINE_URL=https://devops.geobility.systems
REDMINE_API_KEY=your_api_key_here
REDMINE_MCP_READ_ONLY=true  # Only READ_ONLY tools available
```

### Plugin-Only Mode

```bash
# .env
REDMINE_URL=https://devops.geobility.systems
REDMINE_API_KEY=your_api_key_here

# Only checklist plugin enabled, disable others
REDMINE_MCP_DISABLE_RELATIONS=true
REDMINE_MCP_DISABLE_TIME_ENTRIES=true
REDMINE_MCP_DISABLE_VERSIONS=true
REDMINE_MCP_DISABLE_WATCHERS=true
```

## Tool Classification

All tools are classified as either:
- **READ_ONLY** - Safe to expose, no data modification
- **WRITE** - Modifies data (create, update, delete)

When `REDMINE_MCP_READ_ONLY=true`, all WRITE tools are disabled.

## Feature Detection

The MCP server does **not** automatically detect which plugins are installed on your Redmine instance. You must manually disable features via environment variables if:

1. A plugin is not installed (e.g., `redmine_checklists`)
2. You want to restrict access to certain features
3. You're running in a constrained environment

### Graceful Degradation

If a plugin tool is called but the plugin is not installed on Redmine:
- Checklist operations will return errors from Redmine
- The MCP server will pass through these errors
- No server-side crashes will occur

**Best Practice:** Disable features for plugins you don't have installed to prevent confusing error messages.

## Troubleshooting

### Feature Not Working

1. **Check plugin installation** (for Checklists)
   ```bash
   # In Redmine: Administration → Plugins
   # Verify redmine_checklists is installed and enabled
   ```

2. **Check permissions**
   ```bash
   # User needs appropriate permissions
   # Checklists: view_checklists, edit_checklists
   # Time Entries: log_time, edit_time_entries
   ```

3. **Check environment variables**
   ```bash
   # Make sure feature is not disabled
   echo $REDMINE_MCP_DISABLE_CHECKLISTS
   # Should be empty or "false", not "true"
   ```

4. **Check read-only mode**
   ```bash
   echo $REDMINE_MCP_READ_ONLY
   # If "true", all WRITE operations are disabled
   ```

### List Available Tools

The MCP server logs all registered tools on startup. Check the console output:

```bash
# Start server
pnpm dev

# Look for: "Registered X tools (Y read-only, Z write)"
```

## Development

### Adding New Features

To add a new configurable feature:

1. **Update `src/config.ts`:**
   ```typescript
   export interface FeatureFlags {
     // ...existing
     myFeature: boolean;
   }

   const loadFeatureFlags = (): FeatureFlags => {
     return {
       // ...existing
       myFeature: process.env.REDMINE_MCP_DISABLE_MY_FEATURE !== "true",
     };
   };
   ```

2. **Update `src/server.ts`:**
   ```typescript
   if (config.features.myFeature) {
     registerTool("myTool", "Description", ToolType.READ_ONLY, {...}, handler);
   }
   ```

3. **Document in this file**

4. **Update README.md**

## See Also

- [README.md](../README.md) - General setup and usage
- [DEVELOPMENT.md](../DEVELOPMENT.md) - Development guide
- [CLAUDE.md](../CLAUDE.md) - Claude Code integration guide
- [checklist-plugin-support.md](features/checklist-plugin-support.md) - Checklist plugin details
