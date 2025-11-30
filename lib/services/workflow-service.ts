import { ApiClient } from './api-client';

export interface WorkflowStep {
  stepNumber: number;
  approverRole: string;
  required: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  entityType: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  currentStep: number;
  steps: Array<{
    stepNumber: number;
    approverRole: string;
    status: string;
    comments?: string;
  }>;
  initiatedBy: string;
  createdAt: string;
}

export class WorkflowService {
  constructor(private readonly apiClient: ApiClient) {}

  async createWorkflow(
    name: string,
    entityType: string,
    steps: WorkflowStep[],
  ): Promise<Workflow> {
    return this.apiClient.post<Workflow>('/system/workflows', {
      name,
      entityType,
      steps,
    });
  }

  async listWorkflows(entityType?: string): Promise<Workflow[]> {
    const params = entityType ? `?entityType=${entityType}` : '';
    return this.apiClient.get<Workflow[]>(`/system/workflows${params}`);
  }

  async initiateWorkflow(
    workflowId: string,
    entityType: string,
    entityId: string,
  ): Promise<WorkflowInstance> {
    return this.apiClient.post<WorkflowInstance>(
      `/system/workflows/${workflowId}/initiate`,
      {
        entityType,
        entityId,
      },
    );
  }

  async approveWorkflowStep(
    instanceId: string,
    stepNumber: number,
    comments?: string,
  ): Promise<WorkflowInstance> {
    return this.apiClient.post<WorkflowInstance>(
      `/system/workflows/instances/${instanceId}/approve`,
      {
        stepNumber,
        comments,
      },
    );
  }

  async rejectWorkflowStep(
    instanceId: string,
    stepNumber: number,
    comments?: string,
  ): Promise<WorkflowInstance> {
    return this.apiClient.post<WorkflowInstance>(
      `/system/workflows/instances/${instanceId}/reject`,
      {
        stepNumber,
        comments,
      },
    );
  }
}

