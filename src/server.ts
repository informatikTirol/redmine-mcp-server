/**
 * Custom MCP server that extends the generated server with file upload/download capabilities
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import generated handlers
import {
  addRelatedIssueHandler,
  addUserToGroupHandler,
  addWatcherHandler,
  archiveProjectHandler,
  closeProjectHandler,
  createFileHandler,
  createGroupHandler,
  createIssueCategoryHandler,
  createIssueHandler,
  createIssueRelationHandler,
  createMembershipHandler,
  createNewsHandler,
  createProjectHandler,
  createTimeEntryHandler,
  createUserHandler,
  createVersionHandler,
  deleteAttachmentHandler,
  deleteGroupHandler,
  deleteIssueCategoryHandler,
  deleteIssueHandler,
  deleteIssueRelationHandler,
  deleteMembershipHandler,
  deleteNewsHandler,
  deleteProjectHandler,
  deleteTimeEntryHandler,
  deleteUserHandler,
  deleteVersionHandler,
  deleteWikiPageHandler,
  getAttachmentHandler,
  getCurrentUserHandler,
  getCustomFieldsHandler,
  getDocumentCategoriesHandler,
  getFilesHandler,
  getGroupHandler,
  getGroupsHandler,
  getIssueCategoriesHandler,
  getIssueCategoryHandler,
  getIssueHandler,
  getIssuePrioritiesHandler,
  getIssueRelationHandler,
  getIssueRelationsHandler,
  getIssuesHandler,
  getIssueStatusesHandler,
  getMembershipHandler,
  getMembershipsHandler,
  getMyAccountHandler,
  getNewsHandler,
  getNewsListByProjectHandler,
  getNewsListHandler,
  getProjectHandler,
  getProjectsHandler,
  getQueriesHandler,
  getRoleHandler,
  getRolesHandler,
  getTimeEntriesHandler,
  getTimeEntryActivitiesHandler,
  getTimeEntryHandler,
  getTrackersHandler,
  getUserHandler,
  getUsersHandler,
  getVersionsByProjectHandler,
  getVersionsHandler,
  getWikiPageByVersionHandler,
  getWikiPageHandler,
  getWikiPagesHandler,
  removeRelatedIssueHandler,
  removeUserFromGroupHandler,
  removeWatcherHandler,
  reopenProjectHandler,
  searchHandler,
  unarchiveProjectHandler,
  updateAttachmentHandler,
  updateGroupHandler,
  updateIssueCategoryHandler,
  updateIssueHandler,
  updateJournalHandler,
  updateMembershipHandler,
  updateMyAccountHandler,
  updateNewsHandler,
  updateProjectHandler,
  updateTimeEntryHandler,
  updateUserHandler,
  updateVersionHandler,
  updateWikiPageHandler,
} from "./__generated__/handlers.js";

// Import generated schemas
import {
  addRelatedIssueBody,
  addRelatedIssueParams,
  addUserToGroupBody,
  addUserToGroupParams,
  addWatcherBody,
  addWatcherParams,
  archiveProjectParams,
  closeProjectParams,
  createFileBody,
  createFileParams,
  createGroupBody,
  createGroupParams,
  createIssueBody,
  createIssueCategoryBody,
  createIssueCategoryParams,
  createIssueParams,
  createIssueRelationBody,
  createIssueRelationParams,
  createMembershipBody,
  createMembershipParams,
  createNewsBody,
  createNewsParams,
  createProjectBody,
  createProjectParams,
  createTimeEntryBody,
  createTimeEntryParams,
  createUserBody,
  createUserParams,
  createVersionBody,
  createVersionParams,
  deleteAttachmentParams,
  deleteGroupParams,
  deleteIssueCategoryParams,
  deleteIssueCategoryQueryParams,
  deleteIssueParams,
  deleteIssueRelationParams,
  deleteMembershipParams,
  deleteNewsParams,
  deleteProjectParams,
  deleteTimeEntryParams,
  deleteUserParams,
  deleteVersionParams,
  deleteWikiPageParams,
  getAttachmentParams,
  getCurrentUserParams,
  getCurrentUserQueryParams,
  getCustomFieldsParams,
  getDocumentCategoriesParams,
  getFilesParams,
  getGroupParams,
  getGroupQueryParams,
  getGroupsParams,
  getIssueCategoriesParams,
  getIssueCategoriesQueryParams,
  getIssueCategoryParams,
  getIssueParams,
  getIssuePrioritiesParams,
  getIssueQueryParams,
  getIssueRelationParams,
  getIssueRelationsParams,
  getIssuesParams,
  getIssuesQueryParams,
  getIssueStatusesParams,
  getMembershipParams,
  getMembershipsParams,
  getMembershipsQueryParams,
  getMyAccountParams,
  getNewsListByProjectParams,
  getNewsListByProjectQueryParams,
  getNewsListParams,
  getNewsListQueryParams,
  getNewsParams,
  getNewsQueryParams,
  getProjectParams,
  getProjectQueryParams,
  getProjectsParams,
  getProjectsQueryParams,
  getQueriesParams,
  getQueriesQueryParams,
  getRoleParams,
  getRolesParams,
  getTimeEntriesParams,
  getTimeEntriesQueryParams,
  getTimeEntryActivitiesParams,
  getTimeEntryParams,
  getTrackersParams,
  getUserParams,
  getUserQueryParams,
  getUsersParams,
  getUsersQueryParams,
  getVersionsByProjectParams,
  getVersionsByProjectQueryParams,
  getVersionsParams,
  getWikiPageByVersionParams,
  getWikiPageByVersionQueryParams,
  getWikiPageParams,
  getWikiPageQueryParams,
  getWikiPagesParams,
  removeRelatedIssueParams,
  removeUserFromGroupParams,
  removeWatcherParams,
  reopenProjectParams,
  searchParams,
  searchQueryParams,
  unarchiveProjectParams,
  updateAttachmentBody,
  updateAttachmentParams,
  updateGroupBody,
  updateGroupParams,
  updateIssueBody,
  updateIssueCategoryBody,
  updateIssueCategoryParams,
  updateIssueParams,
  updateJournalBody,
  updateJournalParams,
  updateMembershipBody,
  updateMembershipParams,
  updateMyAccountBody,
  updateMyAccountParams,
  updateNewsBody,
  updateNewsParams,
  updateProjectBody,
  updateProjectParams,
  updateTimeEntryBody,
  updateTimeEntryParams,
  updateUserBody,
  updateUserParams,
  updateVersionBody,
  updateVersionParams,
  updateWikiPageBody,
  updateWikiPageParams,
} from "./__generated__/tool-schemas.zod.js";

// Import custom attachment functionality
import { downloadFileHandler } from "./attachment/download-handler.js";
import { downloadThumbnailHandler } from "./attachment/thumbnail-handler.js";
import { uploadFileHandler } from "./attachment/upload-handler.js";
import {
  downloadFileParams,
  downloadThumbnailParams,
  uploadFileParams,
} from "./schemas/attachment.js";

const server = new McpServer({
  name: "redmineAPIServer",
  version: "1.0.0",
});

// Register all generated tools
server.tool(
  "getIssues",
  "List issues",
  { pathParams: getIssuesParams, queryParams: getIssuesQueryParams },
  getIssuesHandler
);
server.tool(
  "createIssue",
  "Create issue",
  { pathParams: createIssueParams, bodyParams: createIssueBody },
  createIssueHandler
);
server.tool(
  "getIssue",
  "Show issue",
  { pathParams: getIssueParams, queryParams: getIssueQueryParams },
  getIssueHandler
);
server.tool(
  "updateIssue",
  "Update issue",
  { pathParams: updateIssueParams, bodyParams: updateIssueBody },
  updateIssueHandler
);
server.tool(
  "deleteIssue",
  "Delete issue",
  { pathParams: deleteIssueParams },
  deleteIssueHandler
);
server.tool(
  "addWatcher",
  "Add watcher",
  { pathParams: addWatcherParams, bodyParams: addWatcherBody },
  addWatcherHandler
);
server.tool(
  "removeWatcher",
  "Remove watcher",
  { pathParams: removeWatcherParams },
  removeWatcherHandler
);
server.tool(
  "getProjects",
  "List projects",
  { pathParams: getProjectsParams, queryParams: getProjectsQueryParams },
  getProjectsHandler
);
server.tool(
  "createProject",
  "Create project",
  { pathParams: createProjectParams, bodyParams: createProjectBody },
  createProjectHandler
);
server.tool(
  "getProject",
  "Show project",
  { pathParams: getProjectParams, queryParams: getProjectQueryParams },
  getProjectHandler
);
server.tool(
  "updateProject",
  "Update project",
  { pathParams: updateProjectParams, bodyParams: updateProjectBody },
  updateProjectHandler
);
server.tool(
  "deleteProject",
  "Delete project",
  { pathParams: deleteProjectParams },
  deleteProjectHandler
);
server.tool(
  "archiveProject",
  "Archive project",
  { pathParams: archiveProjectParams },
  archiveProjectHandler
);
server.tool(
  "unarchiveProject",
  "Unarchive project",
  { pathParams: unarchiveProjectParams },
  unarchiveProjectHandler
);
server.tool(
  "getMemberships",
  "List memberships",
  { pathParams: getMembershipsParams, queryParams: getMembershipsQueryParams },
  getMembershipsHandler
);
server.tool(
  "createMembership",
  "Create membership",
  { pathParams: createMembershipParams, bodyParams: createMembershipBody },
  createMembershipHandler
);
server.tool(
  "getMembership",
  "Show membership",
  { pathParams: getMembershipParams },
  getMembershipHandler
);
server.tool(
  "updateMembership",
  "Update membership",
  { pathParams: updateMembershipParams, bodyParams: updateMembershipBody },
  updateMembershipHandler
);
server.tool(
  "deleteMembership",
  "Delete membership",
  { pathParams: deleteMembershipParams },
  deleteMembershipHandler
);
server.tool(
  "closeProject",
  "Close project",
  { pathParams: closeProjectParams },
  closeProjectHandler
);
server.tool(
  "reopenProject",
  "Reopen project",
  { pathParams: reopenProjectParams },
  reopenProjectHandler
);
server.tool(
  "getUsers",
  "List users",
  { pathParams: getUsersParams, queryParams: getUsersQueryParams },
  getUsersHandler
);
server.tool(
  "createUser",
  "Create user",
  { pathParams: createUserParams, bodyParams: createUserBody },
  createUserHandler
);
server.tool(
  "getUser",
  "Show user",
  { pathParams: getUserParams, queryParams: getUserQueryParams },
  getUserHandler
);
server.tool(
  "updateUser",
  "Update user",
  { pathParams: updateUserParams, bodyParams: updateUserBody },
  updateUserHandler
);
server.tool(
  "deleteUser",
  "Delete user",
  { pathParams: deleteUserParams },
  deleteUserHandler
);
server.tool(
  "getCurrentUser",
  "Show current user",
  { pathParams: getCurrentUserParams, queryParams: getCurrentUserQueryParams },
  getCurrentUserHandler
);
server.tool(
  "getTimeEntries",
  "List time entries",
  { pathParams: getTimeEntriesParams, queryParams: getTimeEntriesQueryParams },
  getTimeEntriesHandler
);
server.tool(
  "createTimeEntry",
  "Create time entry",
  { pathParams: createTimeEntryParams, bodyParams: createTimeEntryBody },
  createTimeEntryHandler
);
server.tool(
  "getTimeEntry",
  "Show time entry",
  { pathParams: getTimeEntryParams },
  getTimeEntryHandler
);
server.tool(
  "updateTimeEntry",
  "Update time entry",
  { pathParams: updateTimeEntryParams, bodyParams: updateTimeEntryBody },
  updateTimeEntryHandler
);
server.tool(
  "deleteTimeEntry",
  "Delete time entry",
  { pathParams: deleteTimeEntryParams },
  deleteTimeEntryHandler
);
server.tool(
  "getNewsList",
  "List news",
  { pathParams: getNewsListParams, queryParams: getNewsListQueryParams },
  getNewsListHandler
);
server.tool(
  "getNews",
  "Show news",
  { pathParams: getNewsParams, queryParams: getNewsQueryParams },
  getNewsHandler
);
server.tool(
  "updateNews",
  "Update news",
  { pathParams: updateNewsParams, bodyParams: updateNewsBody },
  updateNewsHandler
);
server.tool(
  "deleteNews",
  "Delete news",
  { pathParams: deleteNewsParams },
  deleteNewsHandler
);
server.tool(
  "getNewsListByProject",
  "List news by project",
  {
    pathParams: getNewsListByProjectParams,
    queryParams: getNewsListByProjectQueryParams,
  },
  getNewsListByProjectHandler
);
server.tool(
  "createNews",
  "Create news",
  { pathParams: createNewsParams, bodyParams: createNewsBody },
  createNewsHandler
);
server.tool(
  "getIssueRelations",
  "List issue relations",
  { pathParams: getIssueRelationsParams },
  getIssueRelationsHandler
);
server.tool(
  "createIssueRelation",
  "Create issue relation",
  {
    pathParams: createIssueRelationParams,
    bodyParams: createIssueRelationBody,
  },
  createIssueRelationHandler
);
server.tool(
  "getIssueRelation",
  "Show issue relation",
  { pathParams: getIssueRelationParams },
  getIssueRelationHandler
);
server.tool(
  "deleteIssueRelation",
  "Delete issue relation",
  { pathParams: deleteIssueRelationParams },
  deleteIssueRelationHandler
);
server.tool(
  "getVersionsByProject",
  "List versions by project",
  {
    pathParams: getVersionsByProjectParams,
    queryParams: getVersionsByProjectQueryParams,
  },
  getVersionsByProjectHandler
);
server.tool(
  "createVersion",
  "Create version",
  { pathParams: createVersionParams, bodyParams: createVersionBody },
  createVersionHandler
);
server.tool(
  "getVersions",
  "Show version",
  { pathParams: getVersionsParams },
  getVersionsHandler
);
server.tool(
  "updateVersion",
  "Update version",
  { pathParams: updateVersionParams, bodyParams: updateVersionBody },
  updateVersionHandler
);
server.tool(
  "deleteVersion",
  "Delete version",
  { pathParams: deleteVersionParams },
  deleteVersionHandler
);
server.tool(
  "getWikiPages",
  "List wiki pages",
  { pathParams: getWikiPagesParams },
  getWikiPagesHandler
);
server.tool(
  "getWikiPage",
  "Show wiki page",
  { pathParams: getWikiPageParams, queryParams: getWikiPageQueryParams },
  getWikiPageHandler
);
server.tool(
  "updateWikiPage",
  "Create or update wiki page",
  { pathParams: updateWikiPageParams, bodyParams: updateWikiPageBody },
  updateWikiPageHandler
);
server.tool(
  "deleteWikiPage",
  "Delete wiki page",
  { pathParams: deleteWikiPageParams },
  deleteWikiPageHandler
);
server.tool(
  "getWikiPageByVersion",
  "Show wiki page by specific version",
  {
    pathParams: getWikiPageByVersionParams,
    queryParams: getWikiPageByVersionQueryParams,
  },
  getWikiPageByVersionHandler
);
server.tool(
  "getQueries",
  "List queries",
  { pathParams: getQueriesParams, queryParams: getQueriesQueryParams },
  getQueriesHandler
);
server.tool(
  "getAttachment",
  "Show attachment",
  { pathParams: getAttachmentParams },
  getAttachmentHandler
);
server.tool(
  "updateAttachment",
  "Update attachment",
  { pathParams: updateAttachmentParams, bodyParams: updateAttachmentBody },
  updateAttachmentHandler
);
server.tool(
  "deleteAttachment",
  "Delete attachment",
  { pathParams: deleteAttachmentParams },
  deleteAttachmentHandler
);
server.tool(
  "getIssueStatuses",
  "List issue statuses",
  { pathParams: getIssueStatusesParams },
  getIssueStatusesHandler
);
server.tool(
  "getTrackers",
  "List trackers",
  { pathParams: getTrackersParams },
  getTrackersHandler
);
server.tool(
  "getIssueCategories",
  "List issue categories",
  {
    pathParams: getIssueCategoriesParams,
    queryParams: getIssueCategoriesQueryParams,
  },
  getIssueCategoriesHandler
);
server.tool(
  "createIssueCategory",
  "Create issue category",
  {
    pathParams: createIssueCategoryParams,
    bodyParams: createIssueCategoryBody,
  },
  createIssueCategoryHandler
);
server.tool(
  "getIssuePriorities",
  "List issue priorities",
  { pathParams: getIssuePrioritiesParams },
  getIssuePrioritiesHandler
);
server.tool(
  "getTimeEntryActivities",
  "List time entry activities",
  { pathParams: getTimeEntryActivitiesParams },
  getTimeEntryActivitiesHandler
);
server.tool(
  "getDocumentCategories",
  "List document categories",
  { pathParams: getDocumentCategoriesParams },
  getDocumentCategoriesHandler
);
server.tool(
  "getIssueCategory",
  "Show issue category",
  { pathParams: getIssueCategoryParams },
  getIssueCategoryHandler
);
server.tool(
  "updateIssueCategory",
  "Update issue category",
  {
    pathParams: updateIssueCategoryParams,
    bodyParams: updateIssueCategoryBody,
  },
  updateIssueCategoryHandler
);
server.tool(
  "deleteIssueCategory",
  "Delete issue category",
  {
    pathParams: deleteIssueCategoryParams,
    queryParams: deleteIssueCategoryQueryParams,
  },
  deleteIssueCategoryHandler
);
server.tool(
  "getRoles",
  "List roles",
  { pathParams: getRolesParams },
  getRolesHandler
);
server.tool(
  "getRole",
  "Show role",
  { pathParams: getRoleParams },
  getRoleHandler
);
server.tool(
  "getGroups",
  "List groups",
  { pathParams: getGroupsParams },
  getGroupsHandler
);
server.tool(
  "createGroup",
  "Create group",
  { pathParams: createGroupParams, bodyParams: createGroupBody },
  createGroupHandler
);
server.tool(
  "getGroup",
  "Show group",
  { pathParams: getGroupParams, queryParams: getGroupQueryParams },
  getGroupHandler
);
server.tool(
  "updateGroup",
  "Update group",
  { pathParams: updateGroupParams, bodyParams: updateGroupBody },
  updateGroupHandler
);
server.tool(
  "deleteGroup",
  "Delete group",
  { pathParams: deleteGroupParams },
  deleteGroupHandler
);
server.tool(
  "addUserToGroup",
  "Add user to group",
  { pathParams: addUserToGroupParams, bodyParams: addUserToGroupBody },
  addUserToGroupHandler
);
server.tool(
  "removeUserFromGroup",
  "Remove user from group",
  { pathParams: removeUserFromGroupParams },
  removeUserFromGroupHandler
);
server.tool(
  "getCustomFields",
  "List custom fields",
  { pathParams: getCustomFieldsParams },
  getCustomFieldsHandler
);
server.tool(
  "search",
  "Search",
  { pathParams: searchParams, queryParams: searchQueryParams },
  searchHandler
);
server.tool(
  "getFiles",
  "List files",
  { pathParams: getFilesParams },
  getFilesHandler
);
server.tool(
  "createFile",
  "Create file",
  { pathParams: createFileParams, bodyParams: createFileBody },
  createFileHandler
);
server.tool(
  "getMyAccount",
  "Show my account",
  { pathParams: getMyAccountParams },
  getMyAccountHandler
);
server.tool(
  "updateMyAccount",
  "Update my account",
  { pathParams: updateMyAccountParams, bodyParams: updateMyAccountBody },
  updateMyAccountHandler
);
server.tool(
  "updateJournal",
  "Update journal",
  { pathParams: updateJournalParams, bodyParams: updateJournalBody },
  updateJournalHandler
);
server.tool(
  "addRelatedIssue",
  "Add related issue",
  { pathParams: addRelatedIssueParams, bodyParams: addRelatedIssueBody },
  addRelatedIssueHandler
);
server.tool(
  "removeRelatedIssue",
  "Remove related issue",
  { pathParams: removeRelatedIssueParams },
  removeRelatedIssueHandler
);

// Register custom attachment tools
server.tool(
  "uploadAttachmentFile",
  "Upload attachment file to Redmine and get upload token",
  { pathParams: uploadFileParams },
  uploadFileHandler
);
server.tool(
  "downloadAttachmentFile",
  "Download attachment file from Redmine to local file",
  { pathParams: downloadFileParams },
  downloadFileHandler
);
server.tool(
  "downloadThumbnail",
  "Download thumbnail from Redmine to local file",
  { pathParams: downloadThumbnailParams },
  downloadThumbnailHandler
);

const transport = new StdioServerTransport();

server
  .connect(transport)
  .then(() => {
    console.error("MCP server running on stdio");
  })
  .catch(console.error);
