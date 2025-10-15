# Redmine MCP Server

Forked from https://github.com/milldea-mitsuya/redmine-mcp-server

Model Context Protocol (MCP) server for Redmine that provides comprehensive access to the Redmine REST API.

## Overview

This project is an MCP server that comprehensively covers Redmine's [REST API](https://www.redmine.org/projects/redmine/wiki/rest_api). It allows you to operate Redmine from MCP clients (such as Claude Desktop).

## Currently Active Tools

This MCP server currently has the following tools **enabled** in `src/server.ts`:

### Read-Only Tools
- **getIssues** - List issues
- **getIssue** - Show issue details
- **getTimeEntries** - List time entries
- **getVersionsByProject** - List versions by project
- **search** - Cross-search functionality

### Write Tools
- **createIssue** - Create new issue
- **updateIssue** - Update existing issue
- **createTimeEntry** - Create new time entry
- **updateTimeEntry** - Update existing time entry

### Disabled Tools

Most other Redmine API endpoints are currently **disabled** (commented out) in the implementation:
- Projects management (list, create, update, delete, archive, memberships)
- Users management (list, create, update, delete, current user)
- Time entries (show individual, delete, activities)
- Wiki pages (list, show, create/update, delete, versions)
- News (list, create, update, delete)
- Watchers (add, remove)
- Issue relations (list, create, delete)
- Versions (create, show, update, delete)
- Attachments (show, upload, download, thumbnails, update, delete)
- Issue statuses, trackers, categories, priorities
- Queries, roles, groups, custom fields
- Files, my account, journals

To enable additional tools, uncomment the relevant `registerTool()` calls in `src/server.ts`.



## Features

- 📋 **Comprehensive API Coverage**: Supports all functions available in Redmine's REST API
- 🔒 **Read-Only Mode**: Supports safe data reference mode

## Prerequisites

### Getting Redmine API Key

1. Log in to Redmine with administrator privileges
2. Go to "Administration" → "Settings" → "API" tab
3. Check "Enable REST web service"
4. Generate "API access key" in personal settings

For details, refer to [Redmine REST API documentation](https://www.redmine.org/projects/redmine/wiki/rest_api#Authentication).

## Configuration

### Environment Variables

The following environment variables are required (specified in MCP client configuration files):

- **REDMINE_URL** (Required): Base URL of the Redmine instance
  - Example: `https://redmine.example.com`
- **REDMINE_API_KEY** (Required): API key generated in Redmine
  - Set the API key obtained in prerequisites
- **REDMINE_MCP_READ_ONLY** (Optional): Enable read-only mode
  - `true`: Read-only mode (disables data modification operations)
  - `false` or unset: Allow all operations (default)

### MCP Client Configuration

Add the following as MCP configuration for your AI agent:

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["-y", "@informatik_tirol/redmine-mcp-server"],
      "env": {
        "REDMINE_URL": "https://your-redmine.example.com",
        "REDMINE_API_KEY": "your-api-key-here",
        "REDMINE_MCP_READ_ONLY": "true"
      }
    }
  }
}
```

Below are specific configuration methods for several MCP clients:

#### Claude Desktop

Add the following to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["-y", "@informatik_tirol/redmine-mcp-server"],
      "env": {
        "REDMINE_URL": "https://your-redmine.example.com",
        "REDMINE_API_KEY": "your-api-key-here",
        "REDMINE_MCP_READ_ONLY": "true"
      }
    }
  }
}
```

#### Claude Code

In Claude Code, you can add MCP servers using the following commands:

Local configuration:
```bash
claude mcp add redmine -e REDMINE_URL=https://your-redmine.example.com -e REDMINE_API_KEY=your-api-key-here -e REDMINE_MCP_READ_ONLY=true -- npx -y @informatik_tirol/redmine-mcp-server
```

Project configuration:
```bash
claude mcp add -s project redmine -e REDMINE_URL=https://your-redmine.example.com -e REDMINE_API_KEY=your-api-key-here -e REDMINE_MCP_READ_ONLY=true -- npx -y @informatik_tirol/redmine-mcp-server
```

User configuration (global):
```bash
claude mcp add -s user redmine -e REDMINE_URL=https://your-redmine.example.com -e REDMINE_API_KEY=your-api-key-here -e REDMINE_MCP_READ_ONLY=true -- npx -y @informatik_tirol/redmine-mcp-server
```

#### Visual Studio Code

Project configuration (`.vscode/mcp.json`):

```json
{
  "servers": {
    "redmine": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@informatik_tirol/redmine-mcp-server"],
      "env": {
        "REDMINE_URL": "https://your-redmine.example.com",
        "REDMINE_API_KEY": "your-api-key-here",
        "REDMINE_MCP_READ_ONLY": "true"
      }
    }
  }
}
```

User configuration (`settings.json`):

```json
{
  "mcp": {
    "servers": {
      "redmine": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@informatik_tirol/redmine-mcp-server"],
        "env": {
          "REDMINE_URL": "https://your-redmine.example.com",
          "REDMINE_API_KEY": "your-api-key-here",
          "REDMINE_MCP_READ_ONLY": "true"
        }
      }
    }
  }
}
```

## License

MIT License

## Author

[onozaty](https://github.com/onozaty)


### Modified
informatik_tirol

## Acknowledgments

- OpenAPI specification: [d-yoshi/redmine-openapi](https://github.com/d-yoshi/redmine-openapi)
- Code generation: [Orval](https://orval.dev/) - TypeScript client and schema generator from OpenAPI
