# MCP Development Command

Development and testing command for the local Redmine MCP server.

## Context

**Local MCP Server:** `@informatik_tirol/redmine-mcp-server`
**Redmine Instance:** https://zp.informatik.tirol
**Test Ticket (FIXED for updates):** #18830
**Test Project:** GBS SOP (ID: 264)

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
- REDMINE_URL=https://zp.informatik.tirol
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
         "description": "[User description]\n\n## Test Details\n- Created: [timestamp]\n- Test Type: [description]\n- Server: Local Development (tsx watch)\n\n## Environment\n- API: https://zp.informatik.tirol\n- Config: .env loaded\n- Mode: Development",
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
   - URL: https://zp.informatik.tirol/issues/18830

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
   - URL: https://zp.informatik.tirol
3. Show recent activity (get ticket #18830)
4. List available actions

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
- URL: https://zp.informatik.tirol/issues/18830
- Subject: "MCP Server Development Test Ticket"
- Project: GBS SOP (264)
- Purpose: Central test ticket for update/time entry testing

**DO NOT delete or close this ticket!**

### Local vs Production

This command uses the **LOCAL MCP server** (`mcp__redmine-local__*` tools).
- Server must be running (`pnpm dev`)
- Uses .env configuration
- Points to: https://zp.informatik.tirol
- NOT the production DevOps server

## Quick Reference

```bash
# Server Management
pnpm dev                    # Start development server
pnpm debug                  # Start with debugger
F5 in VS Code              # Debug mode

# Common Commands
/dev:mcp create "desc"     # New test ticket
/dev:mcp update "changes"  # Update #18830 (FIXED)
/dev:mcp get               # Get #18830 details
/dev:mcp time 1.5 "work"   # Log 1.5h on #18830
/dev:mcp status            # Check everything

# URLs
Test Ticket: https://zp.informatik.tirol/issues/18830
Redmine: https://zp.informatik.tirol
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
