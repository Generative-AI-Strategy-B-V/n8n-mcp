"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.n8nManagementTools = void 0;
exports.n8nManagementTools = [
    {
        name: 'n8n_create_workflow',
        description: `Create workflow. Requires: name, nodes[], connections{}. Created inactive. Returns workflow with ID.`,
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Workflow name (required)'
                },
                nodes: {
                    type: 'array',
                    description: 'Array of workflow nodes. Each node must have: id, name, type, typeVersion, position, and parameters',
                    items: {
                        type: 'object',
                        required: ['id', 'name', 'type', 'typeVersion', 'position', 'parameters'],
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            type: { type: 'string' },
                            typeVersion: { type: 'number' },
                            position: {
                                type: 'array',
                                items: { type: 'number' },
                                minItems: 2,
                                maxItems: 2
                            },
                            parameters: { type: 'object' },
                            credentials: { type: 'object' },
                            disabled: { type: 'boolean' },
                            notes: { type: 'string' },
                            continueOnFail: { type: 'boolean' },
                            retryOnFail: { type: 'boolean' },
                            maxTries: { type: 'number' },
                            waitBetweenTries: { type: 'number' }
                        },
                    },
                },
                connections: {
                    type: 'object',
                    description: 'Workflow connections object. Keys are source node names (the name field, not id), values define output connections'
                },
                settings: {
                    type: 'object',
                    description: 'Optional workflow settings (execution order, timezone, error handling)',
                    properties: {
                        executionOrder: { type: 'string', enum: ['v0', 'v1'] },
                        timezone: { type: 'string' },
                        saveDataErrorExecution: { type: 'string', enum: ['all', 'none'] },
                        saveDataSuccessExecution: { type: 'string', enum: ['all', 'none'] },
                        saveManualExecutions: { type: 'boolean' },
                        saveExecutionProgress: { type: 'boolean' },
                        executionTimeout: { type: 'number' },
                        errorWorkflow: { type: 'string' }
                    },
                },
            },
            required: ['name', 'nodes', 'connections']
        },
        annotations: {
            title: 'Create Workflow',
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_get_workflow',
        description: `Get workflow by ID with different detail levels. Use mode='full' for complete workflow, 'details' for metadata+stats, 'structure' for nodes/connections only, 'minimal' for id/name/active/tags.`,
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Workflow ID'
                },
                mode: {
                    type: 'string',
                    enum: ['full', 'details', 'structure', 'minimal'],
                    default: 'full',
                    description: 'Detail level: full=complete workflow, details=full+execution stats, structure=nodes/connections topology, minimal=metadata only'
                },
            },
            required: ['id']
        },
        annotations: {
            title: 'Get Workflow',
            readOnlyHint: true,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_update_full_workflow',
        description: `Full workflow update. Requires complete nodes[] and connections{}. For incremental use n8n_update_partial_workflow.`,
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Workflow ID to update'
                },
                name: {
                    type: 'string',
                    description: 'New workflow name'
                },
                nodes: {
                    type: 'array',
                    description: 'Complete array of workflow nodes (required if modifying workflow structure)',
                    items: {
                        type: 'object',
                        additionalProperties: true
                    },
                },
                connections: {
                    type: 'object',
                    description: 'Complete connections object (required if modifying workflow structure)'
                },
                settings: {
                    type: 'object',
                    description: 'Workflow settings to update'
                },
            },
            required: ['id']
        },
        annotations: {
            title: 'Update Full Workflow',
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_update_partial_workflow',
        description: `Update workflow incrementally with diff operations. Types: addNode, removeNode, updateNode, moveNode, enable/disableNode, addConnection, removeConnection, updateSettings, updateName, add/removeTag. See tools_documentation("n8n_update_partial_workflow", "full") for details.`,
        inputSchema: {
            type: 'object',
            additionalProperties: true,
            properties: {
                id: {
                    type: 'string',
                    description: 'Workflow ID to update'
                },
                operations: {
                    type: 'array',
                    description: 'Array of diff operations to apply. Each operation must have a "type" field and relevant properties for that operation type.',
                    items: {
                        type: 'object',
                        additionalProperties: true
                    },
                },
                validateOnly: {
                    type: 'boolean',
                    description: 'If true, only validate operations without applying them'
                },
                continueOnError: {
                    type: 'boolean',
                    description: 'If true, apply valid operations even if some fail (best-effort mode). Returns applied and failed operation indices. Default: false (atomic)'
                },
            },
            required: ['id', 'operations']
        },
        annotations: {
            title: 'Update Partial Workflow',
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_delete_workflow',
        description: `Permanently delete a workflow. This action cannot be undone.`,
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Workflow ID to delete'
                },
            },
            required: ['id']
        },
        annotations: {
            title: 'Delete Workflow',
            readOnlyHint: false,
            destructiveHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_list_workflows',
        description: `List workflows (minimal metadata only). Returns id/name/active/dates/tags. Check hasMore/nextCursor for pagination.`,
        inputSchema: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Number of workflows to return (1-100, default: 100)'
                },
                cursor: {
                    type: 'string',
                    description: 'Pagination cursor from previous response'
                },
                active: {
                    type: 'boolean',
                    description: 'Filter by active status'
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter by tags (exact match)'
                },
                projectId: {
                    type: 'string',
                    description: 'Filter by project ID (enterprise feature)'
                },
                excludePinnedData: {
                    type: 'boolean',
                    description: 'Exclude pinned data from response (default: true)'
                },
            },
        },
        annotations: {
            title: 'List Workflows',
            readOnlyHint: true,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_validate_workflow',
        description: `Validate workflow by ID. Checks nodes, connections, expressions. Returns errors/warnings/suggestions.`,
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Workflow ID to validate'
                },
                options: {
                    type: 'object',
                    description: 'Validation options',
                    properties: {
                        validateNodes: {
                            type: 'boolean',
                            description: 'Validate node configurations (default: true)'
                        },
                        validateConnections: {
                            type: 'boolean',
                            description: 'Validate workflow connections (default: true)'
                        },
                        validateExpressions: {
                            type: 'boolean',
                            description: 'Validate n8n expressions (default: true)'
                        },
                        profile: {
                            type: 'string',
                            enum: ['minimal', 'runtime', 'ai-friendly', 'strict'],
                            description: 'Validation profile to use (default: runtime)'
                        },
                    },
                },
            },
            required: ['id']
        },
        annotations: {
            title: 'Validate Workflow',
            readOnlyHint: true,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_autofix_workflow',
        description: `Automatically fix common workflow validation errors. Preview fixes or apply them. Fixes expression format, typeVersion, error output config, webhook paths.`,
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Workflow ID to fix'
                },
                applyFixes: {
                    type: 'boolean',
                    description: 'Apply fixes to workflow (default: false - preview mode)'
                },
                fixTypes: {
                    type: 'array',
                    description: 'Types of fixes to apply (default: all)',
                    items: {
                        type: 'string',
                        enum: ['expression-format', 'typeversion-correction', 'error-output-config', 'node-type-correction', 'webhook-missing-path', 'typeversion-upgrade', 'version-migration']
                    },
                },
                confidenceThreshold: {
                    type: 'string',
                    enum: ['high', 'medium', 'low'],
                    description: 'Minimum confidence level for fixes (default: medium)'
                },
                maxFixes: {
                    type: 'number',
                    description: 'Maximum number of fixes to apply (default: 50)'
                },
            },
            required: ['id']
        },
        annotations: {
            title: 'Autofix Workflow',
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_test_workflow',
        description: `Test/trigger workflow execution. Auto-detects trigger type (webhook/form/chat). Supports: webhook (HTTP), form (fields), chat (message). Note: Only workflows with these trigger types can be executed externally.`,
        inputSchema: {
            type: 'object',
            properties: {
                workflowId: {
                    type: 'string',
                    description: 'Workflow ID to execute (required)'
                },
                triggerType: {
                    type: 'string',
                    enum: ['webhook', 'form', 'chat'],
                    description: 'Trigger type. Auto-detected if not specified. Workflow must have a matching trigger node.'
                },
                httpMethod: {
                    type: 'string',
                    enum: ['GET', 'POST', 'PUT', 'DELETE'],
                    description: 'For webhook: HTTP method (default: from workflow config or POST)'
                },
                webhookPath: {
                    type: 'string',
                    description: 'For webhook: override the webhook path'
                },
                message: {
                    type: 'string',
                    description: 'For chat: message to send (required for chat triggers)'
                },
                sessionId: {
                    type: 'string',
                    description: 'For chat: session ID for conversation continuity'
                },
                data: {
                    type: 'object',
                    description: 'Input data/payload for webhook, form fields, or execution data'
                },
                headers: {
                    type: 'object',
                    description: 'Custom HTTP headers'
                },
                timeout: {
                    type: 'number',
                    description: 'Timeout in ms (default: 120000)'
                },
                waitForResponse: {
                    type: 'boolean',
                    description: 'Wait for workflow completion (default: true)'
                },
            },
            required: ['workflowId']
        },
        annotations: {
            title: 'Test Workflow',
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_executions',
        description: `Manage workflow executions: get details, list, or delete. Use action='get' with id for execution details, action='list' for listing executions, action='delete' to remove execution record.`,
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['get', 'list', 'delete'],
                    description: 'Operation: get=get execution details, list=list executions, delete=delete execution'
                },
                id: {
                    type: 'string',
                    description: 'Execution ID (required for action=get or action=delete)'
                },
                mode: {
                    type: 'string',
                    enum: ['preview', 'summary', 'filtered', 'full', 'error'],
                    description: 'For action=get: preview=structure only, summary=2 items (default), filtered=custom, full=all data, error=optimized error debugging'
                },
                nodeNames: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'For action=get with mode=filtered: filter to specific nodes by name'
                },
                itemsLimit: {
                    type: 'number',
                    description: 'For action=get with mode=filtered: items per node (0=structure, 2=default, -1=unlimited)'
                },
                includeInputData: {
                    type: 'boolean',
                    description: 'For action=get: include input data in addition to output (default: false)'
                },
                errorItemsLimit: {
                    type: 'number',
                    description: 'For action=get with mode=error: sample items from upstream node (default: 2, max: 100)'
                },
                includeStackTrace: {
                    type: 'boolean',
                    description: 'For action=get with mode=error: include full stack trace (default: false, shows truncated)'
                },
                includeExecutionPath: {
                    type: 'boolean',
                    description: 'For action=get with mode=error: include execution path leading to error (default: true)'
                },
                fetchWorkflow: {
                    type: 'boolean',
                    description: 'For action=get with mode=error: fetch workflow for accurate upstream detection (default: true)'
                },
                limit: {
                    type: 'number',
                    description: 'For action=list: number of executions to return (1-100, default: 100)'
                },
                cursor: {
                    type: 'string',
                    description: 'For action=list: pagination cursor from previous response'
                },
                workflowId: {
                    type: 'string',
                    description: 'For action=list: filter by workflow ID'
                },
                projectId: {
                    type: 'string',
                    description: 'For action=list: filter by project ID (enterprise feature)'
                },
                status: {
                    type: 'string',
                    enum: ['success', 'error', 'waiting'],
                    description: 'For action=list: filter by execution status'
                },
                includeData: {
                    type: 'boolean',
                    description: 'For action=list: include execution data (default: false)'
                },
            },
            required: ['action']
        },
        annotations: {
            title: 'Manage Executions',
            readOnlyHint: false,
            destructiveHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_health_check',
        description: `Check n8n instance health and API connectivity. Use mode='diagnostic' for detailed troubleshooting with env vars and tool status.`,
        inputSchema: {
            type: 'object',
            properties: {
                mode: {
                    type: 'string',
                    enum: ['status', 'diagnostic'],
                    description: 'Mode: "status" (default) for quick health check, "diagnostic" for detailed debug info including env vars and tool status',
                    default: 'status'
                },
                verbose: {
                    type: 'boolean',
                    description: 'Include extra details in diagnostic mode (default: false)'
                },
            },
        },
        annotations: {
            title: 'Health Check',
            readOnlyHint: true,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_workflow_versions',
        description: `Manage workflow version history, rollback, and cleanup. Six modes:
- list: Show version history for a workflow
- get: Get details of specific version
- rollback: Restore workflow to previous version (creates backup first)
- delete: Delete specific version or all versions for a workflow
- prune: Manually trigger pruning to keep N most recent versions
- truncate: Delete ALL versions for ALL workflows (requires confirmation)`,
        inputSchema: {
            type: 'object',
            properties: {
                mode: {
                    type: 'string',
                    enum: ['list', 'get', 'rollback', 'delete', 'prune', 'truncate'],
                    description: 'Operation mode'
                },
                workflowId: {
                    type: 'string',
                    description: 'Workflow ID (required for list, rollback, delete, prune)'
                },
                versionId: {
                    type: 'number',
                    description: 'Version ID (required for get mode and single version delete, optional for rollback)'
                },
                limit: {
                    type: 'number',
                    default: 10,
                    description: 'Max versions to return in list mode'
                },
                validateBefore: {
                    type: 'boolean',
                    default: true,
                    description: 'Validate workflow structure before rollback'
                },
                deleteAll: {
                    type: 'boolean',
                    default: false,
                    description: 'Delete all versions for workflow (delete mode only)'
                },
                maxVersions: {
                    type: 'number',
                    default: 10,
                    description: 'Keep N most recent versions (prune mode only)'
                },
                confirmTruncate: {
                    type: 'boolean',
                    default: false,
                    description: 'REQUIRED: Must be true to truncate all versions (truncate mode only)'
                },
            },
            required: ['mode']
        },
        annotations: {
            title: 'Workflow Versions',
            readOnlyHint: false,
            destructiveHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_deploy_template',
        description: `Deploy a workflow template from n8n.io directly to your n8n instance. Deploys first, then auto-fixes common issues (expression format, typeVersions). Returns workflow ID, required credentials, and fixes applied.`,
        inputSchema: {
            type: 'object',
            properties: {
                templateId: {
                    type: 'number',
                    description: 'Template ID from n8n.io (required)'
                },
                name: {
                    type: 'string',
                    description: 'Custom workflow name (default: template name)'
                },
                autoUpgradeVersions: {
                    type: 'boolean',
                    default: true,
                    description: 'Automatically upgrade node typeVersions to latest supported (default: true)'
                },
                autoFix: {
                    type: 'boolean',
                    default: true,
                    description: 'Auto-apply fixes after deployment for expression format issues, missing = prefix, etc. (default: true)'
                },
                stripCredentials: {
                    type: 'boolean',
                    default: true,
                    description: 'Remove credential references from nodes - user configures in n8n UI (default: true)'
                },
            },
            required: ['templateId']
        },
        annotations: {
            title: 'Deploy Template',
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_credentials',
        description: `Manage credentials: list, get, create, delete, get schema, or transfer. Use action parameter to select operation.`,
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['list', 'get', 'create', 'delete', 'schema', 'transfer'],
                    description: 'Operation: list=list all, get=get by ID, create=create new, delete=delete, schema=get type schema, transfer=transfer to project'
                },
                id: {
                    type: 'string',
                    description: 'Credential ID (required for get, delete, transfer)'
                },
                name: {
                    type: 'string',
                    description: 'For create: credential name (required)'
                },
                type: {
                    type: 'string',
                    description: 'For create/schema: credential type name (e.g., "slackApi", "googleOAuth2Api")'
                },
                data: {
                    type: 'object',
                    description: 'For create: credential data (secrets, tokens, etc.)'
                },
                destinationProjectId: {
                    type: 'string',
                    description: 'For transfer: destination project ID'
                },
                limit: {
                    type: 'number',
                    description: 'For list: max results (default 100)'
                },
                cursor: {
                    type: 'string',
                    description: 'For list: pagination cursor'
                },
            },
            required: ['action']
        },
        annotations: {
            title: 'Manage Credentials',
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: false,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_tags',
        description: `Manage workflow tags: list, get, create, update, or delete. Use action parameter to select operation.`,
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['list', 'get', 'create', 'update', 'delete'],
                    description: 'Operation: list=list all, get=get by ID, create=create new, update=rename, delete=remove'
                },
                id: {
                    type: 'string',
                    description: 'Tag ID (required for get, update, delete)'
                },
                name: {
                    type: 'string',
                    description: 'Tag name (required for create, update)'
                },
                limit: {
                    type: 'number',
                    description: 'For list: max results (default 100, max 250)'
                },
                cursor: {
                    type: 'string',
                    description: 'For list: pagination cursor'
                },
            },
            required: ['action']
        },
        annotations: {
            title: 'Manage Tags',
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: false,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_variables',
        description: `Manage environment variables: list, create, update, or delete. Variables are key-value pairs accessible in workflows.`,
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['list', 'create', 'update', 'delete'],
                    description: 'Operation: list=list all, create=create new, update=modify, delete=remove'
                },
                id: {
                    type: 'string',
                    description: 'Variable ID (required for update, delete)'
                },
                key: {
                    type: 'string',
                    description: 'Variable key/name (required for create, update)'
                },
                value: {
                    type: 'string',
                    description: 'Variable value (required for create, update)'
                },
                projectId: {
                    type: 'string',
                    description: 'For create/list: project ID (optional)'
                },
                limit: {
                    type: 'number',
                    description: 'For list: max results'
                },
                cursor: {
                    type: 'string',
                    description: 'For list: pagination cursor'
                },
            },
            required: ['action']
        },
        annotations: {
            title: 'Manage Variables',
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: false,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_users',
        description: `Manage users (instance owner only): list, get, create/invite, delete, or change role.`,
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['list', 'get', 'create', 'delete', 'change_role'],
                    description: 'Operation: list=list all, get=get by ID/email, create=invite user(s), delete=remove, change_role=update global role'
                },
                id: {
                    type: 'string',
                    description: 'User ID or email (required for get, delete, change_role)'
                },
                users: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            email: { type: 'string' },
                            role: { type: 'string' }
                        },
                        required: ['email']
                    },
                    description: 'For create: array of users to invite with email and optional role'
                },
                newRoleName: {
                    type: 'string',
                    description: 'For change_role: new global role name (e.g., "global:member")'
                },
                includeRole: {
                    type: 'boolean',
                    description: 'For list/get: include role information'
                },
                projectId: {
                    type: 'string',
                    description: 'For list: filter by project'
                },
                limit: {
                    type: 'number',
                    description: 'For list: max results'
                },
                cursor: {
                    type: 'string',
                    description: 'For list: pagination cursor'
                },
            },
            required: ['action']
        },
        annotations: {
            title: 'Manage Users',
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: false,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_projects',
        description: `Manage projects: list, create, update, delete, or manage project users.`,
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['list', 'create', 'update', 'delete', 'add_users', 'remove_user', 'change_user_role'],
                    description: 'Operation: list, create, update, delete for projects; add_users, remove_user, change_user_role for project membership'
                },
                id: {
                    type: 'string',
                    description: 'Project ID (required for update, delete, user operations)'
                },
                name: {
                    type: 'string',
                    description: 'Project name (required for create, update)'
                },
                userId: {
                    type: 'string',
                    description: 'User ID (required for remove_user, change_user_role)'
                },
                users: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            userId: { type: 'string' },
                            role: { type: 'string' }
                        },
                        required: ['userId', 'role']
                    },
                    description: 'For add_users: array of {userId, role} objects. Roles: "project:viewer", "project:editor", "project:admin"'
                },
                role: {
                    type: 'string',
                    description: 'For change_user_role: new project role'
                },
                limit: {
                    type: 'number',
                    description: 'For list: max results'
                },
                cursor: {
                    type: 'string',
                    description: 'For list: pagination cursor'
                },
            },
            required: ['action']
        },
        annotations: {
            title: 'Manage Projects',
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: false,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_activate_workflow',
        description: `Activate a workflow to start processing triggers. Returns the updated workflow.`,
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Workflow ID to activate'
                },
            },
            required: ['id']
        },
        annotations: {
            title: 'Activate Workflow',
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_deactivate_workflow',
        description: `Deactivate a workflow to stop processing triggers. Returns the updated workflow.`,
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Workflow ID to deactivate'
                },
            },
            required: ['id']
        },
        annotations: {
            title: 'Deactivate Workflow',
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_source_control',
        description: `Pull changes from connected Git repository (Enterprise feature). Requires source control to be configured.`,
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['pull'],
                    description: 'Operation: pull=pull changes from repository'
                },
                force: {
                    type: 'boolean',
                    description: 'Force pull even if there are conflicts (default: false)'
                },
                variables: {
                    type: 'object',
                    description: 'Variables to use during pull'
                },
            },
            required: ['action']
        },
        annotations: {
            title: 'Source Control',
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_audit',
        description: `Generate a security/compliance audit report for the n8n instance.`,
        inputSchema: {
            type: 'object',
            properties: {
                daysAbandonedWorkflow: {
                    type: 'number',
                    description: 'Days after which inactive workflows are considered abandoned'
                },
                categories: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['credentials', 'database', 'nodes', 'filesystem', 'instance']
                    },
                    description: 'Categories to include in audit (default: all)'
                },
            },
        },
        annotations: {
            title: 'Security Audit',
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    {
        name: 'n8n_retry_execution',
        description: `Retry a failed workflow execution. Returns the new execution.`,
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Execution ID to retry'
                },
            },
            required: ['id']
        },
        annotations: {
            title: 'Retry Execution',
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
        },
    }
];
//# sourceMappingURL=tools-n8n-manager.js.map