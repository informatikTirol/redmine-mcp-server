# Enable deleteIssueRelation Tool

**Date:** 2025-10-31
**Status:** Approved

## Context

The `deleteIssueRelation` tool exists in the generated code but is disabled in server.ts with the comment "not needed". User requirements now include the ability to delete issue relations, so this tool needs activation.

## Current State

- OpenAPI spec defines DELETE endpoint at `/relations/{issueRelationId}.{format}` (line 2027-2046)
- Handler `deleteIssueRelationHandler` is generated (handlers.ts:1173-1184)
- Schema `deleteIssueRelationParams` is generated (tool-schemas.zod.ts:1473)
- Tool registration is commented out in server.ts:651-657

## Decision

Activate `deleteIssueRelation` by moving it inside the `config.features.relations` feature flag block, maintaining consistency with existing relation tools.

### Scope

- **Activate:** `deleteIssueRelation` only
- **Keep disabled:** `getIssueRelation` (single relation retrieval not needed; list operation sufficient)

## Design

### Changes Required

**File:** `src/server.ts`

Move the commented `deleteIssueRelation` registration from lines 651-657 into the `if (config.features.relations)` block (currently lines 622-640).

**Before:**
```typescript
if (config.features.relations) {
  registerTool("getIssueRelations", ...);
  registerTool("createIssueRelation", ...);
}
// deleteIssueRelation - DISABLED (not needed)
```

**After:**
```typescript
if (config.features.relations) {
  registerTool("getIssueRelations", ...);
  registerTool("createIssueRelation", ...);
  registerTool(
    "deleteIssueRelation",
    "Delete issue relation",
    ToolType.WRITE,
    { pathParams: deleteIssueRelationParams },
    deleteIssueRelationHandler
  );
}
```

### Consistency with Existing Patterns

- **Feature gating:** Uses `config.features.relations` flag (same as other relation tools)
- **Tool classification:** `ToolType.WRITE` (consistent with `createIssueRelation`)
- **Read-only mode:** Automatically respected via `registerTool` helper (server.ts:164-178)
- **Parameters:** Follows standard pattern with `pathParams` for `issueRelationId` and `format`

### API Completeness

Post-implementation, relation tools coverage:

| Operation | Endpoint | Tool | Status |
|-----------|----------|------|--------|
| List | GET /issues/{id}/relations | getIssueRelations | ✅ Active |
| Create | POST /issues/{id}/relations | createIssueRelation | ✅ Active |
| Delete | DELETE /relations/{id} | deleteIssueRelation | ✅ Activating |
| Get Single | GET /relations/{id} | getIssueRelation | ❌ Disabled (not needed) |

## Implementation

1. Uncomment lines 651-657 in server.ts
2. Move the `registerTool` call into the `if (config.features.relations)` block
3. Update comment for `getIssueRelation` to clarify it remains disabled
4. Verify imports for `deleteIssueRelationParams` and `deleteIssueRelationHandler`

## Testing

Verify the tool is:
- Available when `REDMINE_FEATURE_RELATIONS=true`
- Hidden when `REDMINE_FEATURE_RELATIONS=false`
- Blocked when `REDMINE_MCP_READ_ONLY=true`
