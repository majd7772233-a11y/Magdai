export type PermissionStatus = 'allow_once' | 'allow_project' | 'deny';

export interface PermissionRequest {
  id: string;
  agentName: string;
  actionTitle: string;
  actionDetails: string;
  isDestructive?: boolean;
}

export class PermissionGuard {
  static formatWarning(request: PermissionRequest): string {
    if (request.isDestructive) {
      return `⚠️ إجراء حساس/خطِر من ${request.agentName}: ${request.actionTitle}\nالتفاصيل: ${request.actionDetails}`;
    }
    return `طلب إذن من ${request.agentName}: ${request.actionTitle}`;
  }
}
