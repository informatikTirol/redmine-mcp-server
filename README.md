# Redmine MCP Server

Forked from https://github.com/milldea-mitsuya/redmine-mcp-server

Model Context Protocol (MCP) server for Redmine that provides comprehensive access to the Redmine REST API.

[![npm version](https://img.shields.io/npm/v/@informatik_tirol/redmine-mcp-server)](https://www.npmjs.com/package/@informatik_tirol/redmine-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Overview](#overview)
- [What's New in v1.2.0](#whats-new-in-v120)
- [Quick Start](#quick-start)
- [Available Tools](#available-tools)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Use Cases](#use-cases)
- [Documentation](#documentation)
- [Plugin Requirements](#plugin-requirements)
- [Development](#development)
- [Changelog](#changelog)

## Overview

This project is an MCP server that comprehensively covers Redmine's [REST API](https://www.redmine.org/projects/redmine/wiki/rest_api). It allows you to operate Redmine from MCP clients (such as Claude Desktop).

## What's New in v1.2.0

🎉 Major feature enhancements:

- **Feature Flags**: Granular control over enabled features - disable specific tool groups via environment variables
- **Checklists Plugin**: Full support for redmine_checklists plugin (create, read, update, delete checklist items)
- **Issue Relations**: Create and manage relationships between issues (blocks, duplicates, relates, etc.)
- **Watchers**: Add users as watchers to issues
- **Enhanced Time Tracking**: Create and update time entries with full activity support
- **Versions Support**: Access project versions and milestones
- **Comprehensive Documentation**: New docs covering all features, configuration options, and plugin integration

All optional features are **enabled by default** but can be selectively disabled for minimal tool footprint.

## Quick Start

### Installation

The easiest way to use this MCP server is via `npx`:

```bash
# For Claude Code (local configuration)
claude mcp add redmine \
  -e REDMINE_URL=https://your-redmine.example.com \
  -e REDMINE_API_KEY=your-api-key-here \
  -- npx -y @informatik_tirol/redmine-mcp-server

# For Claude Desktop - add to claude_desktop_config.json:
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["-y", "@informatik_tirol/redmine-mcp-server"],
      "env": {
        "REDMINE_URL": "https://your-redmine.example.com",
        "REDMINE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

See [Configuration](#configuration) below for all options including read-only mode and feature flags.

## Available Tools

This MCP server provides comprehensive access to Redmine's REST API with the following tools:

### Core Features (Always Active)

#### Issues
- ✅ **getIssues** - List issues with filtering
- ✅ **createIssue** - Create new issue
- ✅ **getIssue** - Show issue details
- ✅ **updateIssue** - Update existing issue

#### Search
- ✅ **search** - Global search across Redmine

### Optional Features (Configurable via Environment Variables)

All optional features are **enabled by default** and can be disabled individually:

#### Time Entries
- ✅ **getTimeEntries** - List time entries with filters
- ✅ **createTimeEntry** - Create new time entry
- ✅ **updateTimeEntry** - Update existing time entry

Disable with: `REDMINE_MCP_DISABLE_TIME_ENTRIES=true`

#### Issue Relations
- ✅ **getIssueRelations** - List all relations for an issue
- ✅ **createIssueRelation** - Create relation between issues

Supports: `relates`, `duplicates`, `blocks`, `precedes`, `follows`, etc.

Disable with: `REDMINE_MCP_DISABLE_RELATIONS=true`

#### Checklists (Requires redmine_checklists Plugin)
- ✅ **getChecklistsByIssue** - List all checklists for an issue
- ✅ **createChecklist** - Add new checklist item
- ✅ **getChecklist** - Get checklist item details
- ✅ **updateChecklist** - Update checklist item (toggle done, rename)
- ✅ **deleteChecklist** - Delete checklist item

Disable with: `REDMINE_MCP_DISABLE_CHECKLISTS=true`

#### Versions
- ✅ **getVersionsByProject** - List project versions/milestones

Disable with: `REDMINE_MCP_DISABLE_VERSIONS=true`

#### Watchers
- ✅ **addWatcher** - Add user as watcher to issue

Disable with: `REDMINE_MCP_DISABLE_WATCHERS=true`

### Disabled Features

The following Redmine API features are currently disabled (commented out in `src/server.ts`):
- Projects management (most operations disabled for safety)
- Users management (read operations available via API)
- Attachments (file upload/download - requires special handling)
- Wiki pages (limited use case in MCP context)
- News (read-only feature)
- Most administrative operations

See [doc/features.md](doc/features.md) for complete feature documentation.



## Features

- 📋 **Comprehensive API Coverage**: Full support for Redmine's REST API
- 🔒 **Read-Only Mode**: Optional safe data reference mode (`REDMINE_MCP_READ_ONLY=true`)
- ⚙️ **Feature Flags**: Granular control over enabled features via environment variables
- ✅ **Checklist Support**: Full integration with redmine_checklists plugin
- 🔗 **Issue Relations**: Create and manage dependencies between issues
- ⏱️ **Time Tracking**: Log and manage time entries on issues
- 📦 **Version Management**: Access project versions/milestones
- 👁️ **Watchers**: Add users as watchers to issues
- 🔍 **Advanced Search**: Global search across Redmine instances
- 🛡️ **Type Safety**: Full TypeScript support with Zod schema validation
- 🔧 **Auto-Generated**: API client generated from OpenAPI specification

## Prerequisites

### Getting Redmine API Key

1. Log in to Redmine with administrator privileges
2. Go to "Administration" → "Settings" → "API" tab
3. Check "Enable REST web service"
4. Generate "API access key" in personal settings

For details, refer to [Redmine REST API documentation](https://www.redmine.org/projects/redmine/wiki/rest_api#Authentication).

## Configuration

### Environment Variables

#### Required Variables

- **REDMINE_URL** (Required): Base URL of the Redmine instance
  - Example: `https://devops.geobility.systems`
- **REDMINE_API_KEY** (Required): API key generated in Redmine
  - Set the API key obtained in prerequisites

#### Optional Variables

- **REDMINE_MCP_READ_ONLY** (Optional): Enable read-only mode
  - `true`: Read-only mode (disables all data modification operations)
  - `false` or unset: Allow all operations (default)

#### Feature Flags (Optional)

All features are **enabled by default**. Set these to `true` to disable specific tool groups:

- **REDMINE_MCP_DISABLE_CHECKLISTS**: Disable checklist tools (requires redmine_checklists plugin)
- **REDMINE_MCP_DISABLE_RELATIONS**: Disable issue relations tools
- **REDMINE_MCP_DISABLE_TIME_ENTRIES**: Disable time entry tools
- **REDMINE_MCP_DISABLE_VERSIONS**: Disable version/milestone tools
- **REDMINE_MCP_DISABLE_WATCHERS**: Disable watcher tools

**Use Case**: Reduce tool count for specific workflows or when plugins are not available.

### MCP Client Configuration

Add the following as MCP configuration for your AI agent:

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["-y", "@informatik_tirol/redmine-mcp-server"],
      "env": {
        "REDMINE_URL": "https://devops.geobility.systems",
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
        "REDMINE_URL": "https://devops.geobility.systems",
        "REDMINE_API_KEY": "your-api-key-here",
        "REDMINE_MCP_READ_ONLY": "true"
      }
    }
  }
}
```

#### Claude Code

In Claude Code, you can add MCP servers using the following commands:

**Basic Installation (All Features Enabled):**
```bash
# Local configuration (current project only)
claude mcp add redmine \
  -e REDMINE_URL=https://devops.geobility.systems \
  -e REDMINE_API_KEY=your-api-key-here \
  -- npx -y @informatik_tirol/redmine-mcp-server

# Project configuration (committed to git)
claude mcp add -s project redmine \
  -e REDMINE_URL=https://devops.geobility.systems \
  -e REDMINE_API_KEY=your-api-key-here \
  -- npx -y @informatik_tirol/redmine-mcp-server

# User configuration (global - all projects)
claude mcp add -s user redmine \
  -e REDMINE_URL=https://devops.geobility.systems \
  -e REDMINE_API_KEY=your-api-key-here \
  -- npx -y @informatik_tirol/redmine-mcp-server
```

**Read-Only Mode (Safe for Production):**
```bash
claude mcp add -s user redmine \
  -e REDMINE_URL=https://devops.geobility.systems \
  -e REDMINE_API_KEY=your-api-key-here \
  -e REDMINE_MCP_READ_ONLY=true \
  -- npx -y @informatik_tirol/redmine-mcp-server
```

**Custom Feature Configuration:**
```bash
# Minimal setup - Core features only (no plugins)
claude mcp add -s user redmine \
  -e REDMINE_URL=https://devops.geobility.systems \
  -e REDMINE_API_KEY=your-api-key-here \
  -e REDMINE_MCP_DISABLE_CHECKLISTS=true \
  -e REDMINE_MCP_DISABLE_RELATIONS=true \
  -e REDMINE_MCP_DISABLE_TIME_ENTRIES=true \
  -e REDMINE_MCP_DISABLE_VERSIONS=true \
  -e REDMINE_MCP_DISABLE_WATCHERS=true \
  -- npx -y @informatik_tirol/redmine-mcp-server

# Checklists only (with plugin support)
claude mcp add -s user redmine \
  -e REDMINE_URL=https://devops.geobility.systems \
  -e REDMINE_API_KEY=your-api-key-here \
  -e REDMINE_MCP_DISABLE_RELATIONS=true \
  -e REDMINE_MCP_DISABLE_TIME_ENTRIES=true \
  -e REDMINE_MCP_DISABLE_VERSIONS=true \
  -e REDMINE_MCP_DISABLE_WATCHERS=true \
  -- npx -y @informatik_tirol/redmine-mcp-server

# Time tracking focus
claude mcp add -s user redmine \
  -e REDMINE_URL=https://devops.geobility.systems \
  -e REDMINE_API_KEY=your-api-key-here \
  -e REDMINE_MCP_DISABLE_CHECKLISTS=true \
  -e REDMINE_MCP_DISABLE_RELATIONS=true \
  -e REDMINE_MCP_DISABLE_VERSIONS=true \
  -e REDMINE_MCP_DISABLE_WATCHERS=true \
  -- npx -y @informatik_tirol/redmine-mcp-server
```

**Available Feature Flags:**
- `REDMINE_MCP_DISABLE_CHECKLISTS=true` - Disable checklist tools (requires `redmine_checklists` plugin)
- `REDMINE_MCP_DISABLE_RELATIONS=true` - Disable issue relations tools
- `REDMINE_MCP_DISABLE_TIME_ENTRIES=true` - Disable time entry tools
- `REDMINE_MCP_DISABLE_VERSIONS=true` - Disable version/milestone tools
- `REDMINE_MCP_DISABLE_WATCHERS=true` - Disable watcher tools

See [doc/configuration.md](doc/configuration.md) for complete configuration options.

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
        "REDMINE_URL": "https://devops.geobility.systems",
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
          "REDMINE_URL": "https://devops.geobility.systems",
          "REDMINE_API_KEY": "your-api-key-here",
          "REDMINE_MCP_READ_ONLY": "true"
        }
      }
    }
  }
}
```

## Use Cases

### Task Management with Checklists
```
1. Create issue for feature development
2. Add checklist items for implementation steps
3. Update checklist items as work progresses
4. Track done ratio automatically
```

### Issue Dependency Tracking
```
1. Create multiple related issues
2. Link with relations (blocks, precedes, etc.)
3. Manage dependencies and workflow
4. Track duplicate issues
```

### Time Tracking Integration
```
1. Create/update issues via MCP
2. Log time entries with activities
3. Track hours per issue/project
4. Generate time reports
```

### Automated Workflows
```
1. AI assistant creates issues from conversations
2. Automatically adds watchers to relevant issues
3. Links related issues based on context
4. Logs time as work is discussed
```

## Documentation

- **[doc/configuration.md](doc/configuration.md)** - Complete configuration guide with environment variables
- **[doc/features.md](doc/features.md)** - Comprehensive feature overview and API reference
- **[doc/features/checklist-plugin-support.md](doc/features/checklist-plugin-support.md)** - Checklist plugin integration details
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development and contribution guide

## Plugin Requirements

### Checklists Feature

To use checklist tools, install the **redmine_checklists** plugin on your Redmine instance:

- Plugin: https://www.redmineup.com/pages/plugins/checklists
- Provides task breakdown within issues
- Fully integrated with MCP server
- Auto-disabled if `REDMINE_MCP_DISABLE_CHECKLISTS=true`

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for:
- Building from source
- Code generation from OpenAPI spec
- Adding new features
- Testing and debugging

## Changelog

### v1.2.0 (2025-10-29)
- Added feature flags for configurable tool sets
- Full checklist plugin support (CRUD operations)
- Issue relations management
- Watcher support
- Enhanced time entry tools
- Version/milestone access
- Comprehensive documentation

### v1.1.3
- Added time entry creation and updates
- Enhanced TypeScript configuration

### v1.1.1
- Initial fork and package rename
- Core issue and search functionality

## License

MIT License

## Author

Original: [onozaty](https://github.com/onozaty)

Modified: informatik_tirol

## Acknowledgments

- Original project: [milldea-mitsuya/redmine-mcp-server](https://github.com/milldea-mitsuya/redmine-mcp-server)
- OpenAPI specification: [d-yoshi/redmine-openapi](https://github.com/d-yoshi/redmine-openapi)
- Code generation: [Orval](https://orval.dev/) - TypeScript client and schema generator from OpenAPI
- MCP Protocol: [Model Context Protocol](https://modelcontextprotocol.io/)
