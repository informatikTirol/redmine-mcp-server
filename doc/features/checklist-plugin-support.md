# Checklist Plugin Support via Nested Attributes

## Goal
Enable MCP server to manage Redmine Checklists via `createIssue` and `updateIssue` tools using the nested attributes pattern.

## Background
The redmine_checklists plugin uses Rails `accepts_nested_attributes_for :checklists` pattern, allowing checklist management directly through the Issue API via `checklists_attributes`.

## Implementation

### 1. OpenAPI Schema Extension
Extend `redmine-openapi.yaml` with:

**New Schemas:**
```yaml
ChecklistAttributes:
  type: object
  required: [subject]
  properties:
    subject:
      type: string
      maxLength: 512
      description: Checklist item text
    is_done:
      type: boolean
      default: false
      description: Completion status
    is_section:
      type: boolean
      default: false
      description: Header/section marker
    position:
      type: integer
      description: Display order

ChecklistAttributesUpdate:
  allOf:
    - $ref: '#/components/schemas/ChecklistAttributes'
    - type: object
      properties:
        id:
          type: integer
          description: Existing checklist ID for updates
        _destroy:
          type: boolean
          description: Set true to delete checklist
```

**Schema Updates:**
- `IssueCreate.properties.checklists_attributes`: array of `ChecklistAttributes`
- `IssueUpdate.properties.checklists_attributes`: array of `ChecklistAttributesUpdate`

### 2. Code Generation
Run `pnpm gen` to regenerate handlers and schemas.

### 3. Testing
Test with Redmine instance that has redmine_checklists plugin installed.

## Usage Examples

**Create Issue with Checklists:**
```typescript
createIssue({
  pathParams: { format: 'json' },
  bodyParams: {
    issue: {
      project_id: 1,
      subject: 'Task with checklist',
      checklists_attributes: [
        { subject: 'First step', is_done: false, position: 1 },
        { subject: 'Second step', is_done: false, position: 2 }
      ]
    }
  }
})
```

**Update Issue - Toggle Checklist:**
```typescript
updateIssue({
  pathParams: { format: 'json', issueId: 123 },
  bodyParams: {
    issue: {
      checklists_attributes: [
        { id: 456, is_done: true }  // Mark done
      ]
    }
  }
})
```

**Update Issue - Delete Checklist:**
```typescript
updateIssue({
  pathParams: { format: 'json', issueId: 123 },
  bodyParams: {
    issue: {
      checklists_attributes: [
        { id: 456, _destroy: true }
      ]
    }
  }
})
```

## Notes
- Graceful degradation: If plugin not installed, `checklists_attributes` is silently ignored
- Plugin permissions respected: Requires `view_checklists`, `edit_checklists` etc.
- No separate checklist tools needed for basic use cases
- Position management: Plugin auto-assigns if omitted

## Future Enhancements (if needed)
- Separate checklist CRUD tools for advanced operations
- Checklist template support
- Bulk checklist operations
