import { describe, it, expect } from 'vitest'
import { calculateRisks, calculateHealth, calculateCompletion, calculateStageCompletion } from '../risk-engine'
import { Project, Task } from '../types'

const mockProject: Project = {
  id: 'test-1',
  name: 'Test Project',
  client: 'Test Client',
  start_date: '2024-01-01',
  current_stage: 3,
  status: 'active',
  created_by_user_id: 'user-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  last_activity_at: '2024-01-01T00:00:00Z',
}

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  project_id: 'test-1',
  title: 'Test Task',
  stage: 3,
  status: 'not_started',
  required_flag: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

describe('calculateCompletion', () => {
  it('returns 0 for no tasks', () => {
    expect(calculateCompletion([])).toBe(0)
  })
  it('returns 100 for all done', () => {
    const tasks = [
      createTask({ id: 't1', status: 'done' }),
      createTask({ id: 't2', status: 'done' }),
    ]
    expect(calculateCompletion(tasks)).toBe(100)
  })
  it('returns correct percentage for mixed', () => {
    const tasks = [
      createTask({ id: 't1', status: 'done' }),
      createTask({ id: 't2', status: 'not_started' }),
      createTask({ id: 't3', status: 'in_progress' }),
      createTask({ id: 't4', status: 'done' }),
    ]
    expect(calculateCompletion(tasks)).toBe(50)
  })
  it('returns correct percentage for in-progress tasks', () => {
    const tasks = [
      createTask({ id: 't1', status: 'done' }),
      createTask({ id: 't2', status: 'in_progress' }),
      createTask({ id: 't3', status: 'done' }),
    ]
    expect(calculateCompletion(tasks)).toBe(66.67)
  })
  it('returns correct percentage for single blocked task', () => {
    const tasks = [
      createTask({ id: 't1', status: 'blocked' }),
    ]
    expect(calculateCompletion(tasks)).toBe(0)
  })
})

describe('calculateStageCompletion', () => {
  it('returns 0 for no tasks in stage', () => {
    const tasks = [createTask({ stage: 2 })]
    expect(calculateStageCompletion(tasks, 3)).toBe(0)
  })
  it('returns correct percentage for stage tasks', () => {
    const tasks = [
      createTask({ id: 't1', stage: 3, status: 'done' }),
      createTask({ id: 't2', stage: 3, status: 'not_started' }),
      createTask({ id: 't3', stage: 2, status: 'done' }),
    ]
    expect(calculateStageCompletion(tasks, 3)).toBe(50)
  })
  it('returns 100 for all tasks in stage completed', () => {
    const tasks = [
      createTask({ id: 't1', stage: 3, status: 'done' }),
      createTask({ id: 't2', stage: 3, status: 'done' }),
      createTask({ id: 't3', stage: 2, status: 'not_started' }),
    ]
    expect(calculateStageCompletion(tasks, 3)).toBe(100)
  })
  it('ignores tasks from other stages', () => {
    const tasks = [
      createTask({ id: 't1', stage: 3, status: 'done' }),
      createTask({ id: 't2', stage: 1, status: 'not_started' }),
      createTask({ id: 't3', stage: 2, status: 'not_started' }),
      createTask({ id: 't4', stage: 5, status: 'done' }),
    ]
    expect(calculateStageCompletion(tasks, 3)).toBe(100)
  })
})

describe('calculateRisks', () => {
  it('returns empty array for project with no issues', () => {
    const tasks = [createTask({ status: 'done' })]
    const risks = calculateRisks(mockProject, tasks)
    expect(Array.isArray(risks)).toBe(true)
  })

  it('detects overdue tasks', () => {
    const tasks = [
      createTask({
        id: 'overdue-1',
        status: 'not_started',
        due_date: '2020-01-01',
        required_flag: true,
      }),
    ]
    const risks = calculateRisks(mockProject, tasks)
    const overdueRisk = risks.find(r => r.title.toLowerCase().includes('overdue'))
    expect(overdueRisk).toBeTruthy()
  })

  it('detects multiple overdue tasks', () => {
    const tasks = [
      createTask({
        id: 'overdue-1',
        status: 'not_started',
        due_date: '2020-01-01',
        required_flag: true,
      }),
      createTask({
        id: 'overdue-2',
        status: 'in_progress',
        due_date: '2020-06-01',
        required_flag: true,
      }),
    ]
    const risks = calculateRisks(mockProject, tasks)
    const overdueRisk = risks.find(r => r.title.toLowerCase().includes('overdue'))
    if (overdueRisk) {
      expect(overdueRisk.description).toContain('2')
    }
  })

  it('detects blocked tasks', () => {
    const tasks = [
      createTask({
        id: 'blocked-1',
        status: 'blocked',
        required_flag: true,
      }),
    ]
    const risks = calculateRisks(mockProject, tasks)
    const blockedRisk = risks.find(r => r.title.toLowerCase().includes('blocked'))
    expect(blockedRisk).toBeTruthy()
  })

  it('ignores optional tasks', () => {
    const tasks = [
      createTask({
        id: 'optional-overdue',
        status: 'not_started',
        due_date: '2020-01-01',
        required_flag: false,
      }),
    ]
    const risks = calculateRisks(mockProject, tasks)
    const overdueRisk = risks.find(r => r.title.toLowerCase().includes('overdue'))
    expect(overdueRisk).toBeUndefined()
  })

  it('each risk has required fields', () => {
    const tasks = [
      createTask({
        id: 'risk-task',
        status: 'blocked',
        required_flag: true,
      }),
    ]
    const risks = calculateRisks(mockProject, tasks)
    risks.forEach(r => {
      expect(r.id).toBeTruthy()
      expect(r.project_id).toBe('test-1')
      expect(r.title).toBeTruthy()
      expect(r.description).toBeTruthy()
      expect(r.severity).toMatch(/^(low|medium|high)$/)
      expect(r.source_type).toMatch(/^(manual|detected|stage_blocked|overdue_required|multiple_overdue|unassigned_required|stagnant|deadline_risk)$/)
      expect(typeof r.resolved_flag).toBe('boolean')
    })
  })
})

describe('calculateHealth', () => {
  it('returns green with no risks and no overdue tasks', () => {
    expect(calculateHealth([], [])).toBe('green')
  })

  it('returns red with high severity risk', () => {
    const risks = [{
      id: 'r1',
      project_id: 'test-1',
      title: 'Test Risk',
      description: 'Test',
      severity: 'high' as const,
      source_type: 'manual' as const,
      resolved_flag: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }]
    expect(calculateHealth(risks, [])).toBe('red')
  })

  it('returns amber with medium severity risk', () => {
    const risks = [{
      id: 'r1',
      project_id: 'test-1',
      title: 'Test Risk',
      description: 'Test',
      severity: 'medium' as const,
      source_type: 'manual' as const,
      resolved_flag: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }]
    expect(calculateHealth(risks, [])).toBe('amber')
  })

  it('returns amber with overdue required tasks', () => {
    const tasks = [
      createTask({
        id: 't1',
        status: 'not_started',
        due_date: '2020-01-01',
        required_flag: true,
      }),
    ]
    expect(calculateHealth([], tasks)).toBe('amber')
  })

  it('ignores resolved risks', () => {
    const risks = [{
      id: 'r1',
      project_id: 'test-1',
      title: 'Test Risk',
      description: 'Test',
      severity: 'high' as const,
      source_type: 'manual' as const,
      resolved_flag: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }]
    expect(calculateHealth(risks, [])).toBe('green')
  })

  it('worst status wins (red > amber > green)', () => {
    const risks = [
      {
        id: 'r1',
        project_id: 'test-1',
        title: 'Medium Risk',
        description: 'Test',
        severity: 'medium' as const,
        source_type: 'manual' as const,
        resolved_flag: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'r2',
        project_id: 'test-1',
        title: 'High Risk',
        description: 'Test',
        severity: 'high' as const,
        source_type: 'manual' as const,
        resolved_flag: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ]
    expect(calculateHealth(risks, [])).toBe('red')
  })
})

describe('Risk engine integration', () => {
  it('handles project with mixed completion and risks', () => {
    const tasks = [
      createTask({ id: 't1', status: 'done' }),
      createTask({ id: 't2', status: 'in_progress' }),
      createTask({ id: 't3', status: 'blocked', required_flag: true }),
    ]
    const completion = calculateCompletion(tasks)
    const risks = calculateRisks(mockProject, tasks)
    const health = calculateHealth(risks, tasks)

    expect(completion).toBe(33.33)
    expect(risks.length).toBeGreaterThan(0)
    expect(health).toMatch(/^(green|amber|red)$/)
  })

  it('handles multi-stage project', () => {
    const tasks = [
      createTask({ id: 't1', stage: 1, status: 'done' }),
      createTask({ id: 't2', stage: 1, status: 'done' }),
      createTask({ id: 't3', stage: 2, status: 'in_progress' }),
      createTask({ id: 't4', stage: 2, status: 'not_started' }),
      createTask({ id: 't5', stage: 3, status: 'not_started' }),
    ]
    expect(calculateStageCompletion(tasks, 1)).toBe(100)
    expect(calculateStageCompletion(tasks, 2)).toBe(0) // 0 done out of 2 stage-2 tasks
    expect(calculateStageCompletion(tasks, 3)).toBe(0)
  })
})
