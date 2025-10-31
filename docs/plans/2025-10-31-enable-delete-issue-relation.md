# Enable deleteIssueRelation Tool Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable the deleteIssueRelation MCP tool by moving its registration into the relations feature flag block.

**Architecture:** Move the commented-out tool registration from lines 651-657 into the `if (config.features.relations)` block (lines 622-640) in server.ts. All necessary code is already generated and imported.

**Tech Stack:** TypeScript, @modelcontextprotocol/sdk

---

## Task 1: Enable deleteIssueRelation Tool Registration

**Files:**
- Modify: `src/server.ts:622-658`

**Context:**
The deleteIssueRelation tool is fully implemented in generated code but disabled in server.ts. Both `deleteIssueRelationHandler` and `deleteIssueRelationParams` are already imported (lines 46 and 155).

**Step 1: Verify current state**

Read the current registration block to understand the structure:

```bash
cat src/server.ts | sed -n '622,658p'
```

Expected: Should see the relations feature flag block with getIssueRelations and createIssueRelation registered, followed by commented-out deleteIssueRelation registration.

**Step 2: Modify server.ts to enable the tool**

Edit `src/server.ts` lines 622-658:

**OLD CODE (lines 622-658):**
```typescript
// Issue Relations
if (config.features.relations) {
  registerTool(
    "getIssueRelations",
    "List issue relations",
    ToolType.READ_ONLY,
    { pathParams: getIssueRelationsParams },
    getIssueRelationsHandler
  );
  registerTool(
    "createIssueRelation",
    "Create issue relation",
    ToolType.WRITE,
    {
      pathParams: createIssueRelationParams,
      bodyParams: createIssueRelationBody,
    },
    createIssueRelationHandler
  );
}
// getIssueRelation - DISABLED (not needed, getIssueRelations is sufficient)
// deleteIssueRelation - DISABLED (not needed)
/*
registerTool(
  "getIssueRelation",
  "Show issue relation",
  ToolType.READ_ONLY,
  { pathParams: getIssueRelationParams },
  getIssueRelationHandler
);
registerTool(
  "deleteIssueRelation",
  "Delete issue relation",
  ToolType.WRITE,
  { pathParams: deleteIssueRelationParams },
  deleteIssueRelationHandler
);
*/
```

**NEW CODE:**
```typescript
// Issue Relations
if (config.features.relations) {
  registerTool(
    "getIssueRelations",
    "List issue relations",
    ToolType.READ_ONLY,
    { pathParams: getIssueRelationsParams },
    getIssueRelationsHandler
  );
  registerTool(
    "createIssueRelation",
    "Create issue relation",
    ToolType.WRITE,
    {
      pathParams: createIssueRelationParams,
      bodyParams: createIssueRelationBody,
    },
    createIssueRelationHandler
  );
  registerTool(
    "deleteIssueRelation",
    "Delete issue relation",
    ToolType.WRITE,
    { pathParams: deleteIssueRelationParams },
    deleteIssueRelationHandler
  );
}
// getIssueRelation - DISABLED (not needed, getIssueRelations is sufficient)
/*
registerTool(
  "getIssueRelation",
  "Show issue relation",
  ToolType.READ_ONLY,
  { pathParams: getIssueRelationParams },
  getIssueRelationHandler
);
*/
```

**Changes:**
1. Moved `registerTool("deleteIssueRelation", ...)` from line 651-657 into the `if (config.features.relations)` block
2. Removed the "deleteIssueRelation - DISABLED (not needed)" comment
3. Kept only getIssueRelation commented out

**Step 3: Verify imports are present**

Check that required imports exist:

```bash
grep "deleteIssueRelationHandler" src/server.ts | head -1
grep "deleteIssueRelationParams" src/server.ts | head -1
```

Expected output:
```
  deleteIssueRelationHandler,
  deleteIssueRelationParams,
```

Both should be found. No action needed if they exist (they already do on lines 46 and 155).

**Step 4: Build the project**

Build to verify TypeScript compilation:

```bash
pnpm build
```

Expected: Build succeeds without errors. The output should include compilation of src/server.ts.

**Step 5: Verify tool is conditionally registered**

The tool should be:
- ✅ Available when `REDMINE_FEATURE_RELATIONS=true`
- ❌ Hidden when `REDMINE_FEATURE_RELATIONS=false`
- ❌ Blocked when `REDMINE_MCP_READ_ONLY=true` (even if relations enabled)

This verification requires running the server with different environment configurations and checking the tool list, which is typically done during integration testing or manual testing with an MCP client.

**Step 6: Commit the change**

```bash
git add src/server.ts
git commit -m "feat: enable deleteIssueRelation tool

Enable the deleteIssueRelation MCP tool by moving its registration
into the config.features.relations feature flag block. The tool was
previously generated but disabled.

- Move deleteIssueRelation registration into relations feature block
- Tool respects REDMINE_FEATURE_RELATIONS flag
- Tool blocked in read-only mode (ToolType.WRITE)
- Imports already present, no additional changes needed

Closes: Enable delete relation functionality"
```

Expected: Commit succeeds.

---

## Verification Checklist

After implementation, verify:

- [ ] `src/server.ts` modified correctly (deleteIssueRelation inside relations block)
- [ ] Build completes without errors (`pnpm build`)
- [ ] Imports for `deleteIssueRelationHandler` and `deleteIssueRelationParams` present
- [ ] Tool registration follows same pattern as other relation tools
- [ ] Comment updated to only mention getIssueRelation as disabled
- [ ] Changes committed to git

## Implementation Notes

**Why this is safe:**
- All code is already generated from OpenAPI spec (handlers.ts, schemas)
- Imports already exist in server.ts
- Following exact same pattern as createIssueRelation
- Feature-gated (requires REDMINE_FEATURE_RELATIONS=true)
- Respects read-only mode via ToolType.WRITE classification

**No additional testing required because:**
- Generated handlers are tested via API spec compliance
- Tool registration logic is configuration, not business logic
- Manual verification with MCP client will confirm availability

**DRY principle:** Reusing existing generated code, no duplication.

**YAGNI principle:** Not adding getIssueRelation (not needed - list operation sufficient).
