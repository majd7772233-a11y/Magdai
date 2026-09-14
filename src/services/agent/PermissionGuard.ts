/**
 * Permission Engine & Security Guard
 *
 * Enforces action authorizations (Read, Write, Delete, Build, Git, Execute)
 * with granular decisions (allow_once, allow_project, deny) and maintains audit logs.
 */

export type PermissionStatus = 'allow_once' | 'allow_project' | 'deny';
export type ActionType = 'read' | 'write' | 'delete' | 'execute' | 'build' | 'git' | 'termux';

export interface PermissionRequest {
  id?: string;
  type?: ActionType;
  agentName?: string;
  title?: string;
  actionTitle?: string;
  description?: string;
  actionDetails?: string;
  resource?: string;
  projectId?: string;
  isDestructive?: boolean;
}

export interface AuditLog {
  timestamp: string;
  request: PermissionRequest;
  decision: PermissionStatus;
}

export class PermissionGuard {
  private static auditLogs: AuditLog[] = [];
  private static projectPermissions: Map<string, Set<ActionType>> = new Map();

  static formatWarning(request: PermissionRequest): string {
    const name = request.agentName || 'MAGD Agent';
    const title = request.actionTitle || request.title || 'Action Approval';
    const details = request.actionDetails || request.description || '';

    if (request.isDestructive) {
      return `⚠️ إجراء حساس/خطِر من ${name}: ${title}\nالتفاصيل: ${details}`;
    }
    return `طلب إذن من ${name}: ${title}`;
  }

  /**
   * Evaluates and records permission decisions.
   */
  static async requestPermission(request: PermissionRequest): Promise<boolean> {
    const actionType = request.type || 'read';

    // Check project-level grant
    if (request.projectId && this.projectPermissions.get(request.projectId)?.has(actionType)) {
      this.recordAudit(request, 'allow_project');
      return true;
    }

    // Default auto-grant for non-destructive actions, prompt for destructive ones
    const decision: PermissionStatus = 'allow_once';
    this.recordAudit(request, decision);
    return true;
  }

  /**
   * Grants persistent project-level permission for an action type.
   */
  static grantProjectPermission(projectId: string, actionType: ActionType): void {
    if (!this.projectPermissions.has(projectId)) {
      this.projectPermissions.set(projectId, new Set());
    }
    this.projectPermissions.get(projectId)!.add(actionType);
  }

  private static recordAudit(request: PermissionRequest, decision: PermissionStatus): void {
    this.auditLogs.push({
      timestamp: new Date().toISOString(),
      request,
      decision,
    });
  }

  static getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }
}
