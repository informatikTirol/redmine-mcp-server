# MCP Development Command

Development and testing command for the local Redmine MCP server.

## Context

**Local MCP Server:** `@informatik_tirol/redmine-mcp-server`
**Redmine Instance:** https://devops.geobility.systems
**Test Ticket (FIXED for updates):** #18830
**Test Project:** GBS SOP (ID: 264)
**Plugins Installed:** redmine_checklists (for checklist testing)

## Configuration

```json
{
  "test_ticket_id": 18830,
  "project_id": 264,
  "project_name": "GBS SOP",
  "version_id": 715,
  "version_name": "RC Amisola / ORS 1",
  "tracker_id": 3,
  "tracker_name": "Task",
  "status_id": 1,
  "status_name": "backlog",
  "priority_id": 2,
  "priority_name": "Normal",
  "user_id": 1,
  "user_name": "Andreas Juen"
}
```

## Available MCP Tools

**Issues:**
- `mcp__redmine-local__createIssue` - Create new issue
- `mcp__redmine-local__updateIssue` - Update existing issue
- `mcp__redmine-local__getIssue` - Get issue details (use with `include: ["journals", "watchers"]`)

**Time Entries:**
- `mcp__redmine-local__createTimeEntry` - Create time entry
- `mcp__redmine-local__updateTimeEntry` - Update time entry
- `mcp__redmine-local__getTimeEntries` - List time entries

**Other:**
- `mcp__redmine-local__getVersionsByProject` - List project versions
- `mcp__redmine-local__search` - Global search

## Server Status

Before any operation, verify the local MCP server is running:

```bash
# Check if server is running
ps aux | grep -E "(tsx|redmine)" | grep -v grep

# Start server if not running (from project root)
cd /Users/aj/Dropbox/GIT/mcp-server/redmine-mcp-server
pnpm dev

# Debug mode (with VS Code)
# Press F5 in VS Code or:
pnpm debug
```

**Environment Variables (from .env):**
- REDMINE_URL=https://devops.geobility.systems
- REDMINE_API_KEY=76bc3d475f33e7e82030e6afed8aba7ed8e2fbb5

## Command Arguments

Parse the command arguments to determine the action:

**Format:** `/dev:mcp [action] [args...]`

**Actions:**
1. **create** - Create a new test ticket
2. **update** - Update the FIXED test ticket #18830 (ALWAYS use this ID!)
3. **get** - Get ticket details (default: #18830)
4. **search** - Search for tickets
5. **time** - Log time entry on test ticket
6. **list-time** - List time entries for test ticket
7. **versions** - List project versions
8. **status** - Check server status and configuration
9. **checklist** - Test checklist plugin functionality (requires redmine_checklists)

## Action Implementations

### 1. CREATE - New Test Ticket

**IMPORTANT:** Always create NEW tickets, never reuse.

```
User: "/dev:mcp create [description]"
```

**Process:**
1. Extract description from args (or ask if missing)
2. Generate unique subject: "MCP Dev Test - [description] - [timestamp]"
3. Call `mcp__redmine-local__createIssue` with:
   ```json
   {
     "pathParams": {"format": "json"},
     "bodyParams": {
       "issue": {
         "project_id": 264,
         "subject": "MCP Dev Test - [description] - YYYY-MM-DD HH:mm",
         "description": "[User description]\n\n## Test Details\n- Created: [timestamp]\n- Test Type: [description]\n- Server: Local Development (tsx watch)\n\n## Environment\n- API: https://devops.geobility.systems\n- Config: .env loaded\n- Mode: Development",
         "tracker_id": 3,
         "status_id": 1,
         "priority_id": 2,
         "fixed_version_id": 715,
         "assigned_to_id": 1
       }
     }
   }
   ```
4. Return: Ticket ID, URL, confirmation

### 2. UPDATE - FIXED Test Ticket #18830

**CRITICAL:** ALWAYS use ticket ID 18830 for updates. NEVER create new tickets for updates.

```
User: "/dev:mcp update [changes]"
```

**Process:**
1. Extract changes from args (or ask if missing)
2. Get current ticket: `mcp__redmine-local__getIssue` with issueId=18830
3. Append to description (preserve existing content):
   ```
   [Existing description]

   ---

   ## Update [timestamp]
   [User changes description]

   **Test Details:**
   - Updated: [YYYY-MM-DD HH:mm:ss]
   - Changes: [brief summary]
   - Status: [new status if changed]
   ```
4. Call `mcp__redmine-local__updateIssue` with:
   ```json
   {
     "pathParams": {"format": "json", "issueId": 18830},
     "bodyParams": {
       "issue": {
         "description": "[updated description]",
         "notes": "Development test update: [timestamp]"
       }
     }
   }
   ```
5. Return: Confirmation, URL, what changed

**Example Updates to Test:**
- Change status: `"status_id": 2` (DEV: active)
- Change priority: `"priority_id": 3` (High)
- Add done_ratio: `"done_ratio": 50`
- Add notes: `"notes": "Testing update functionality"`

### 3. GET - Fetch Ticket Details

```
User: "/dev:mcp get [ticket_id]"
Default: ticket_id = 18830
```

**Process:**
1. Extract ticket_id (default: 18830)
2. Call `mcp__redmine-local__getIssue`:
   ```json
   {
     "pathParams": {"format": "json", "issueId": 18830},
     "queryParams": {"include": ["journals", "watchers"]}
   }
   ```
3. Display formatted:
   - Header: ID, Subject, Status, Project
   - Details: Tracker, Priority, Version, Assigned To
   - Dates: Created, Updated, Start, Due
   - Content: Description, Latest Journal Notes
   - URL: https://devops.geobility.systems/issues/18830

### 4. SEARCH - Find Tickets

```
User: "/dev:mcp search [query]"
```

**Process:**
1. Extract query from args
2. Call `mcp__redmine-local__search`:
   ```json
   {
     "pathParams": {"format": "json"},
     "queryParams": {
       "q": "[query]",
       "issues": 1,
       "limit": 10
     }
   }
   ```
3. Display results with URLs

### 5. TIME - Log Time Entry

```
User: "/dev:mcp time [hours] [description]"
Default: ticket_id = 18830
```

**Process:**
1. Extract hours and description
2. Call `mcp__redmine-local__createTimeEntry`:
   ```json
   {
     "pathParams": {"format": "json"},
     "bodyParams": {
       "time_entry": {
         "issue_id": 18830,
         "hours": 1.5,
         "activity_id": 9,
         "comments": "Development test: [description]",
         "spent_on": "2025-10-29"
       }
     }
   }
   ```
3. Confirm time logged

**Activity IDs:**
- 9 = Development
- 12 = Admin
- 10 = Meetings

### 6. LIST-TIME - Show Time Entries

```
User: "/dev:mcp list-time [ticket_id]"
Default: ticket_id = 18830
```

**Process:**
1. Call `mcp__redmine-local__getTimeEntries`:
   ```json
   {
     "pathParams": {"format": "json"},
     "queryParams": {
       "issue_id": ["18830"],
       "limit": 20
     }
   }
   ```
2. Display: Date, Hours, Activity, User, Comments

### 7. VERSIONS - List Project Versions

```
User: "/dev:mcp versions"
```

**Process:**
1. Call `mcp__redmine-local__getVersionsByProject`:
   ```json
   {
     "pathParams": {"format": "json", "projectId": 264},
     "queryParams": {"nometa": 1}
   }
   ```
2. Display: ID, Name, Status, Due Date

### 8. STATUS - Server & Config Check

```
User: "/dev:mcp status"
```

**Process:**
1. Check if server is running (ps aux grep)
2. Display configuration:
   - Test Ticket: #18830
   - Project: GBS SOP (264)
   - Version: RC Amisola / ORS 1 (715)
   - Server: Local Development
   - URL: https://devops.geobility.systems
3. Show recent activity (get ticket #18830)
4. List available actions

### 9. CHECKLIST - Test Checklist Plugin

**IMPORTANT:** Requires redmine_checklists plugin installed on Redmine instance.

```
User: "/dev:mcp checklist [test-type]"
```

**Test Types:**
- **create-with** - Create new ticket with checklists
- **add** - Add checklists to existing ticket #18830
- **update** - Toggle/modify checklist items
- **delete** - Remove checklist items
- **all** - Run all checklist tests

#### Test Case 1: CREATE WITH CHECKLISTS

Create a new ticket with initial checklist items:

```json
{
  "pathParams": {"format": "json"},
  "bodyParams": {
    "issue": {
      "project_id": 264,
      "subject": "MCP Checklist Test - Create - [timestamp]",
      "tracker_id": 3,
      "status_id": 1,
      "priority_id": 2,
      "description": "Testing checklist creation via MCP\n\n## Test Checklist\nThese items should appear as checklists:",
      "checklists_attributes": [
        {
          "subject": "First checklist item",
          "is_done": false,
          "position": 1
        },
        {
          "subject": "Second item (pre-checked)",
          "is_done": true,
          "position": 2
        },
        {
          "subject": "Documentation Section",
          "is_section": true,
          "position": 3
        },
        {
          "subject": "Write docs",
          "is_done": false,
          "position": 4
        }
      ]
    }
  }
}
```

**Expected Result:**
- New ticket created
- 4 checklist items visible
- Item 2 is checked
- Item 3 is a section header

#### Test Case 2: ADD CHECKLISTS TO EXISTING TICKET

Add new checklist items to ticket #18830:

```json
{
  "pathParams": {"format": "json", "issueId": 18830},
  "bodyParams": {
    "issue": {
      "notes": "Adding checklist items via MCP - [timestamp]",
      "checklists_attributes": [
        {
          "subject": "New item added via update",
          "is_done": false
        },
        {
          "subject": "Another new item",
          "is_done": false
        }
      ]
    }
  }
}
```

**Note:** First get existing checklists to avoid overwriting!

#### Test Case 3: UPDATE CHECKLIST ITEMS

Toggle checklist item status (mark as done/undone):

**Step 1:** Get current ticket with checklists:
```json
{
  "pathParams": {"format": "json", "issueId": 18830},
  "queryParams": {"include": ["checklists"]}
}
```

**Step 2:** Update specific checklist (e.g., ID 123):
```json
{
  "pathParams": {"format": "json", "issueId": 18830},
  "bodyParams": {
    "issue": {
      "notes": "Toggling checklist item - [timestamp]",
      "checklists_attributes": [
        {
          "id": 123,
          "is_done": true
        }
      ]
    }
  }
}
```

**Advanced:** Update multiple items:
```json
{
  "checklists_attributes": [
    {"id": 123, "is_done": true, "subject": "Updated text"},
    {"id": 124, "is_done": false},
    {"id": 125, "position": 10}
  ]
}
```

#### Test Case 4: DELETE CHECKLIST ITEMS

Remove checklist items using `_destroy`:

```json
{
  "pathParams": {"format": "json", "issueId": 18830},
  "bodyParams": {
    "issue": {
      "notes": "Removing checklist items - [timestamp]",
      "checklists_attributes": [
        {
          "id": 123,
          "_destroy": true
        }
      ]
    }
  }
}
```

**Delete multiple:**
```json
{
  "checklists_attributes": [
    {"id": 123, "_destroy": true},
    {"id": 124, "_destroy": true}
  ]
}
```

#### Complete Test Workflow

```bash
# 1. Create ticket with checklists
/dev:mcp checklist create-with

# 2. Verify in Redmine UI
# Open: https://devops.geobility.systems/issues/[new-ticket-id]
# Check: Checklists are visible and correct

# 3. Add more checklists to #18830
/dev:mcp checklist add

# 4. Get current state
/dev:mcp get 18830

# 5. Toggle some items
/dev:mcp checklist update

# 6. Delete items
/dev:mcp checklist delete

# 7. Verify final state
/dev:mcp get 18830
```

#### Checklist Test Validation

After each operation, verify in Redmine UI:
- **Checklist Tab:** Items appear correctly
- **Checkboxes:** is_done status matches
- **Sections:** is_section items are headers
- **Position:** Items in correct order
- **Journal:** Update notes visible

#### Error Cases to Test

1. **Plugin not installed:**
   - checklists_attributes is ignored
   - No error, graceful degradation

2. **Invalid checklist ID:**
   - Error when using non-existent ID
   - Check error message

3. **Missing required field:**
   - subject is required
   - Test without subject

4. **Permission issues:**
   - User needs edit_checklists permission
   - Test with restricted user

#### Checklist Plugin Features

**Supported Fields:**
- `subject` (string, max 512 chars, required)
- `is_done` (boolean, default: false)
- `is_section` (boolean, default: false)
- `position` (integer, auto-assigned if omitted)
- `id` (integer, for updates only)
- `_destroy` (boolean, for deletion)

**Not Supported via API:**
- Checklist templates
- Bulk operations
- Checklist copying
- Advanced settings

## Development Workflow Examples

### Quick Test Cycle

```bash
# 1. Start local server (if not running)
pnpm dev

# 2. Create test ticket
/dev:mcp create "Testing create functionality"

# 3. Update fixed test ticket
/dev:mcp update "Testing update with new description"

# 4. Check current state
/dev:mcp get

# 5. Log time
/dev:mcp time 0.5 "Testing MCP tools"

# 6. List time entries
/dev:mcp list-time
```

### Debugging Workflow

```bash
# 1. Set breakpoint in src/server.ts or handlers
# 2. Start debug mode (F5 in VS Code)
# 3. Trigger operation via command
/dev:mcp update "Testing with breakpoint"
# 4. Inspect variables in VS Code
# 5. Step through code
```

### Testing New Features

```bash
# When adding new MCP tool:
# 1. Implement in src/
# 2. Add to this command
# 3. Test with: /dev:mcp [new-action]
# 4. Verify in Redmine UI
# 5. Check logs in terminal
```

### Testing Checklist Plugin

```bash
# Complete checklist test suite
# (Requires redmine_checklists plugin on server)

# 1. Create ticket with initial checklists
/dev:mcp checklist create-with
# Verify: Open ticket in browser, check checklists tab

# 2. Add more items to test ticket #18830
/dev:mcp checklist add
# Verify: Items added, not overwritten

# 3. Get ticket and note checklist IDs
/dev:mcp get 18830
# Note: Checklist IDs for next steps

# 4. Toggle checklist items (mark done/undone)
/dev:mcp checklist update
# Verify: Checkbox states changed

# 5. Delete checklist items
/dev:mcp checklist delete
# Verify: Items removed from list

# 6. Test error cases
# - Try without plugin installed (should be ignored)
# - Try with invalid checklist ID
# - Try without required subject field

# 7. Verify in Redmine UI
# - https://devops.geobility.systems/issues/18830
# - Check checklists tab
# - Verify journal entries
```

## Error Handling

If operations fail:

1. **Check server status:**
   ```bash
   ps aux | grep tsx
   # If not running: pnpm dev
   ```

2. **Check .env file:**
   ```bash
   cat .env
   # Should have REDMINE_URL and REDMINE_API_KEY
   ```

3. **Check logs:**
   - Server logs in terminal where `pnpm dev` runs
   - VS Code Debug Console (if debugging)

4. **Verify ticket exists:**
   ```
   /dev:mcp get 18830
   ```

5. **Test with simple operation:**
   ```
   /dev:mcp status
   ```

## Important Notes

### CRITICAL: Update vs Create

- **UPDATE:** ALWAYS use ticket #18830 (FIXED_TEST_TICKET_ID)
  - Reason: Keeps test history in one place
  - Don't create new tickets for updates
  - Append updates to description with timestamp

- **CREATE:** ALWAYS create NEW tickets
  - Each test gets unique ticket
  - Use timestamp in subject
  - Good for testing create functionality

### Test Ticket #18830

This ticket is the FIXED test ticket for all update operations:
- URL: https://devops.geobility.systems/issues/18830
- Subject: "MCP Server Development Test Ticket"
- Project: GBS SOP (264)
- Purpose: Central test ticket for update/time entry testing

**DO NOT delete or close this ticket!**

### Local vs Production

This command uses the **LOCAL MCP server** (`mcp__redmine-local__*` tools).
- Server must be running (`pnpm dev`)
- Uses .env configuration
- Points to: https://devops.geobility.systems
- NOT the production DevOps server

## Quick Reference

```bash
# Server Management
pnpm dev                    # Start development server
pnpm debug                  # Start with debugger
F5 in VS Code              # Debug mode

# Common Commands
/dev:mcp create "desc"        # New test ticket
/dev:mcp update "changes"     # Update #18830 (FIXED)
/dev:mcp get                  # Get #18830 details
/dev:mcp time 1.5 "work"      # Log 1.5h on #18830
/dev:mcp status               # Check everything

# Checklist Testing (requires plugin)
/dev:mcp checklist create-with  # Create ticket with checklists
/dev:mcp checklist add          # Add checklists to #18830
/dev:mcp checklist update       # Toggle checklist items
/dev:mcp checklist delete       # Remove checklist items

# URLs
Test Ticket: https://devops.geobility.systems/issues/18830
Redmine: https://devops.geobility.systems
```

## Execution Instructions

When this command is invoked:

1. **Parse Arguments:** Extract action and parameters
2. **Check Server:** Verify local MCP server is running
3. **Route to Action:** Based on first argument
4. **Execute:** Use appropriate `mcp__redmine-local__*` tool
5. **Format Output:** User-friendly display with URLs
6. **Handle Errors:** Clear messages if something fails

**Remember:**
- Updates → ALWAYS use ticket #18830
- Creates → ALWAYS new tickets with timestamp
- Include timestamps in all test operations
- Use config constants (project_id=264, etc.)
