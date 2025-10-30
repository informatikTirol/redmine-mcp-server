# Development Guide

This guide explains how to develop and debug this Redmine MCP server.

## Prerequisites

- Node.js (v20+)
- pnpm
- Environment variables configured (see [Environment Configuration](#environment-configuration))

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your credentials:**
   ```bash
   REDMINE_URL=https://your-redmine-instance.com
   REDMINE_API_KEY=your_api_key_here
   ```

3. **Run the dev server:**
   ```bash
   pnpm dev
   ```

4. **Or debug with VS Code:**
   - Press `F5` to start debugging
   - Breakpoints will work in TypeScript files

## Development Scripts

### `pnpm dev`
Runs the server in watch mode with automatic reloading on file changes.
- Regenerates API code from OpenAPI spec
- Uses `tsx` for fast TypeScript execution
- Automatically restarts on changes

```bash
pnpm dev
```

### `pnpm dev:nowatch`
Runs the server once without watch mode.
```bash
pnpm dev:nowatch
```

### `pnpm debug`
Runs the server with Node.js inspector enabled on port 9229.
```bash
pnpm debug
```

### `pnpm gen`
Regenerates the API code from the OpenAPI specification.
```bash
pnpm gen
```

### `pnpm build`
Production build using tsdown bundler.
```bash
pnpm build
```

## Debugging with VS Code

This project includes preconfigured VS Code launch configurations.

### Available Debug Configurations

1. **Debug MCP Server** (Recommended)
   - Launches the server with the debugger attached
   - Uses `pnpm debug` script
   - Full breakpoint support
   - Environment variables loaded from `.env` file

2. **Attach to Running Debug Session**
   - Attaches to an already running debug session
   - First run `pnpm debug` in terminal, then use this config

3. **Debug Server (No Watch)**
   - Runs server once with debugger
   - No file watching

4. **Debug with tsx directly**
   - Direct tsx execution with pre-launch code generation
   - Most direct debugging approach

### How to Debug

1. **Create `.env` file** (if not already done)
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Set Breakpoints**
   - Open any TypeScript file (e.g., `src/server.ts`)
   - Click in the gutter to set a breakpoint

3. **Start Debugging**
   - Press `F5` or click "Run and Debug" in VS Code
   - Select "Debug MCP Server" configuration
   - The server will start with the debugger attached

4. **Trigger Breakpoints**
   - Use Claude Code or another MCP client to interact with the server
   - Your breakpoints will be hit

### Debugging Tips

- **Console Output**: Server logs appear in the integrated terminal
- **Source Maps**: Fully configured, you'll debug TypeScript directly
- **Skip Node Internals**: Internal Node.js code is automatically skipped
- **Smart Stepping**: Debugger intelligently steps through your code

## Development Workflow

### Typical Development Session

1. Start dev server:
   ```bash
   pnpm dev
   ```

2. Make changes to source files in `src/`

3. Server automatically reloads on save

4. Test with Claude Code or MCP client

### When Debugging Issues

1. Set breakpoints in relevant files

2. Start debug session (F5 in VS Code)

3. Trigger the code path through Claude Code

4. Inspect variables, step through code

## Project Structure

```
src/
├── server.ts              # Main server entry point
├── config.ts              # Configuration loading
├── __generated__/         # Auto-generated from OpenAPI spec
│   ├── handlers.ts
│   ├── http-schemas/
│   └── tool-schemas.zod.js
├── attachment/            # Custom attachment handlers
└── schemas/               # Custom Zod schemas

.vscode/
├── launch.json            # Debug configurations
└── tasks.json             # VS Code tasks

redmine-openapi.yaml       # OpenAPI specification
orval.config.ts            # Code generation config
post-generate.js           # Post-generation script
```

## Code Generation

The project uses [Orval](https://orval.dev/) to generate TypeScript code from the OpenAPI specification.

### Regenerate Code
```bash
pnpm gen
```

This:
1. Removes `src/__generated__/`
2. Runs Orval to generate new code
3. Runs post-processing script

### When to Regenerate
- After modifying `redmine-openapi.yaml`
- After pulling changes that include API updates
- If generated code seems out of sync

## Testing the Server

### Manual Testing with stdio

Since this is an MCP server running over stdio:

```bash
# Start the server
pnpm dev

# It waits for MCP protocol messages on stdin
# Use an MCP client (like Claude Code) to interact
```

### Testing with Claude Code

1. Configure the server in Claude Code settings
2. Enable the server
3. Use it in conversations
4. Check server logs in VS Code terminal

## Environment Configuration

The server automatically loads environment variables from a `.env` file in development mode.

### Setup Steps

1. **Copy the template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your values:**
   ```env
   REDMINE_URL=https://your-redmine-instance.com
   REDMINE_API_KEY=your-api-key-here
   REDMINE_MCP_READ_ONLY=false
   ```

3. **Get your API key:**
   - Login to your Redmine instance
   - Go to "My Account" → "API access key"
   - Show and copy your API key

### Configuration Options

| Variable | Required | Description |
|----------|----------|-------------|
| `REDMINE_URL` | ✅ Yes | Your Redmine instance URL (e.g., `https://redmine.example.com`) |
| `REDMINE_API_KEY` | ✅ Yes | Your personal Redmine API key |
| `REDMINE_MCP_READ_ONLY` | ❌ No | Set to `"true"` to disable all write operations (default: `false`) |

### Notes

- The `.env` file is **automatically loaded** in development mode
- The `.env` file is **gitignored** and won't be committed
- In production builds, environment variables must be set by your deployment system
- VS Code debug configurations automatically use the `.env` file

## Common Issues

### Port Already in Use
If debugging fails with "port already in use":
```bash
# Kill process on port 9229
lsof -ti:9229 | xargs kill -9
```

### Generated Code Out of Sync
```bash
pnpm gen
```

### TypeScript Errors
```bash
# Check TypeScript
pnpm tsc --noEmit
```

### Breakpoints Not Hit
- Ensure source maps are enabled (they are in `tsconfig.json`)
- Check that you're using a debug configuration
- Verify the code path is actually being executed

## Build for Production

```bash
pnpm build
```

This creates an optimized bundle in `dist/server.mjs` using tsdown.

## Contributing

When adding new features:
1. Update OpenAPI spec if adding new endpoints
2. Run `pnpm gen` to regenerate code
3. Add custom handlers in `src/` (not in `__generated__/`)
4. Test with `pnpm dev`
5. Debug with VS Code if needed
6. Build and test production bundle

## Claude Code Commands

This project includes custom Claude Code commands for development and testing.

### `/dev:mcp` - Development Command

Comprehensive command for testing the local MCP server:

```bash
# Check server status
/dev:mcp status

# Create new test ticket
/dev:mcp create "Testing new feature"

# Update fixed test ticket #12345
/dev:mcp update "Testing update functionality"

# Get ticket details
/dev:mcp get

# Log time entry
/dev:mcp time 1.5 "Development work"

# Search tickets
/dev:mcp search "query"
```

**Key Features:**
- Fixed test ticket (#12345) for consistent update testing
- Automatic timestamp tracking
- Server status monitoring
- Time entry management

**Documentation:** See [`.claude/commands/dev-mcp.md`](.claude/commands/dev-mcp.md)

## Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Redmine REST API](https://www.redmine.org/projects/redmine/wiki/Rest_api)
- [Orval Documentation](https://orval.dev/)
- [tsx Documentation](https://tsx.is/)
