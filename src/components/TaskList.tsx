'use client'

import { Task, RIBA_STAGES, RIBAStage } from '@/lib/types'
import { USERS } from '@/lib/mock-data'
import { statusLabel, statusColor, cn, isOverdue, formatDate } from '@/lib/utils'
import { useState } from 'react'

interface TaskListProps {
  tasks: Task[]
  currentStage: RIBAStage
  groupByStage?: boolean
}

export function TaskList({ tasks, currentStage, groupByStage = false }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'current'>('current')

  const displayed = filter === 'current'
    ? tasks.filter(t => t.stage === currentStage)
    : tasks

  // Group by stage
  const stages = [...new Set(displayed.map(t => t.stage))].sort((a, b) => a - b)

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Tasks</h2>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setFilter('current')}
            className={cn(
              'px-3 py-1 rounded-md text-xs font-medium transition-colors',
              filter === 'current' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            Current Stage
          </button>
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1 rounded-md text-xs font-medium transition-colors',
              filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            All Stages
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {stages.map(stage => (
          <div key={stage}>
            {(groupByStage || filter === 'all') && (
              <div className="px-5 py-2 bg-slate-50/50 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Stage {stage}: {RIBA_STAGES[stage as RIBAStage]}
                </span>
              </div>
            )}
            {displayed.filter(t => t.stage === stage).map(task => {
              const owner = task.owner_user_id ? USERS.find(u => u.id === task.owner_user_id) : null
              const overdue = isOverdue(task.due_date) && task.status !== 'done'

              return (
                <div
                  key={task.id}
                  className={cn(
                    'px-5 py-3 flex items-center gap-3 hover:bg-slate-50/50 transition-colors',
                    overdue && 'bg-red-50/30'
                  )}
                >
                  {/* Required indicator */}
                  <div className="w-1.5 shrink-0">
                    {task.required_flag && (
                      <span className="block w-1.5 h-1.5 rounded-full bg-brand-500" title="Required" />
                    )}
                  </div>

                  {/* Task info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'
                    )}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {owner && (
                        <span className="text-xs text-slate-400">{owner.name}</span>
                      )}
                      {task.due_date && (
                        <span className={cn(
                          'text-xs',
                          overdue ? 'text-red-600 font-medium' : 'text-slate-400'
                        )}>
                          {overdue ? 'Overdue: ' : 'Due: '}{formatDate(task.due_date)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={cn('px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap', statusColor(task.status))}>
                    {statusLabel(task.status)}
                  </span>
                </div>
              )
            })}
          </div>
        ))}

        {displayed.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-slate-400">No tasks to display.</div>
        )}
      </div>
    </div>
  )
}
