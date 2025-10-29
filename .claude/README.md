# Claude Code Integration

This directory contains Claude Code commands and configuration for the Redmine MCP server project.

## Structure

```
.claude/
├── README.md              # This file
└── commands/
    └── dev-mcp.md        # Development & testing command
```

## Available Commands

### `/dev:mcp` - Development Command

Comprehensive development and testing command for the local MCP server.

**Quick Start:**
```bash
/dev:mcp status            # Check server status
/dev:mcp create "test"     # Create new test ticket
/dev:mcp update "changes"  # Update fixed test ticket #18830
/dev:mcp get               # Get test ticket details
```

**Key Features:**
- Fixed test ticket (#18830) for consistent update testing
- New tickets for create operations (with timestamps)
- Time entry management
- Search and list operations
- Server status monitoring

**See:** [`commands/dev-mcp.md`](commands/dev-mcp.md) for full documentation.

## Usage

Commands are available in Claude Code conversations:

1. Type `/` to see available commands
2. Select `/dev:mcp` from the list
3. Add action and arguments: `/dev:mcp create "test description"`

## Test Ticket

**Fixed Test Ticket for Updates:** #18830
- **URL:** https://devops.geobility.systems/issues/18830
- **Project:** GBS SOP (ID: 264)
- **Purpose:** Central test ticket for update operations
- **Status:** Do NOT delete this ticket!

## Development Server

Commands use the **local MCP server** (`mcp__redmine-local__*` tools):

**Start Server:**
```bash
# Development mode (watch)
pnpm dev

# Debug mode
pnpm debug

# Or press F5 in VS Code
```

**Configuration:**
- Environment: `.env` file (auto-loaded in development)
- Redmine URL: https://devops.geobility.systems
- API Key: From `.env` file

## Adding New Commands

To add new commands:

1. Create markdown file in `commands/` directory
2. Document the command purpose and usage
3. Include execution instructions at the end
4. Update this README

**Example:**
```bash
# Create new command file
touch .claude/commands/my-command.md

# Edit with command documentation
# Command will be available as /my-command in Claude Code
```

## Best Practices

**For Development Commands:**
- Use descriptive action names
- Include error handling instructions
- Document all IDs and constants
- Provide usage examples
- Include debugging tips

**For Testing:**
- Use the fixed test ticket (#18830) for updates
- Create new tickets for create operations
- Include timestamps in test data
- Verify operations in Redmine UI

## Troubleshooting

**Command not appearing:**
- Restart Claude Code
- Check file is in `.claude/commands/` directory
- Verify file has `.md` extension

**Operations failing:**
- Check local MCP server is running (`ps aux | grep tsx`)
- Verify `.env` file exists and has correct credentials
- Check server logs in terminal

**Need help:**
- See [`DEVELOPMENT.md`](../DEVELOPMENT.md) for server setup
- Check [`commands/dev-mcp.md`](commands/dev-mcp.md) for command details
