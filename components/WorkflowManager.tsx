'use client';

import { useState } from 'react';
import { workflowService } from '../lib/services/service-registry';
import { Workflow, WorkflowStep } from '../lib/services/workflow-service';
import { StatusPill } from './StatusPill';

interface WorkflowManagerProps {
  workflows: Workflow[];
  onRefresh: () => void;
}

export function WorkflowManager({ workflows, onRefresh }: WorkflowManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    entityType: '',
    steps: [] as WorkflowStep[],
  });

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name || !newWorkflow.entityType || newWorkflow.steps.length === 0) {
      alert('Please fill all fields');
      return;
    }

    try {
      await workflowService.createWorkflow(
        newWorkflow.name,
        newWorkflow.entityType,
        newWorkflow.steps,
      );
      setShowCreateForm(false);
      setNewWorkflow({ name: '', entityType: '', steps: [] });
      onRefresh();
    } catch (error: any) {
      alert(`Failed to create workflow: ${error.message}`);
    }
  };

  const addStep = () => {
    setNewWorkflow({
      ...newWorkflow,
      steps: [
        ...newWorkflow.steps,
        {
          stepNumber: newWorkflow.steps.length + 1,
          approverRole: 'MANAGER',
          required: true,
        },
      ],
    });
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Workflows</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'var(--accent)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {showCreateForm ? 'Cancel' : 'Create Workflow'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <input
            type="text"
            placeholder="Workflow Name"
            value={newWorkflow.name}
            onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'var(--text)',
            }}
          />
          <input
            type="text"
            placeholder="Entity Type (e.g., PurchaseOrder)"
            value={newWorkflow.entityType}
            onChange={(e) => setNewWorkflow({ ...newWorkflow, entityType: e.target.value })}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'var(--text)',
            }}
          />
          <div>
            <button
              onClick={addStep}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                marginBottom: '0.5rem',
              }}
            >
              Add Step
            </button>
            {newWorkflow.steps.map((step, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Approver Role"
                  value={step.approverRole}
                  onChange={(e) => {
                    const newSteps = [...newWorkflow.steps];
                    newSteps[index].approverRole = e.target.value;
                    setNewWorkflow({ ...newWorkflow, steps: newSteps });
                  }}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'transparent',
                    color: 'var(--text)',
                    flex: 1,
                  }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={step.required}
                    onChange={(e) => {
                      const newSteps = [...newWorkflow.steps];
                      newSteps[index].required = e.target.checked;
                      setNewWorkflow({ ...newWorkflow, steps: newSteps });
                    }}
                  />
                  Required
                </label>
              </div>
            ))}
          </div>
          <button
            onClick={handleCreateWorkflow}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Create
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            style={{
              padding: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: '600' }}>{workflow.name}</div>
              <div className="kpi-label">
                {workflow.entityType} • {workflow.steps.length} steps
              </div>
            </div>
            <StatusPill
              label={workflow.isActive ? 'Active' : 'Inactive'}
              variant={workflow.isActive ? 'success' : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

