/**
 * route.ts
 *
 * Location: src/app/api/kdos/route.ts
 *
 * Next.js App Router POST endpoint. Accepts a raw request string,
 * instantiates KDOSRuntime with its existing subsystems, and returns
 * the runtime's response.
 *
 * NOTE ON IMPORTS:
 * Every subsystem below is imported from its existing location.
 * Adjust the paths if the actual module locations differ:
 *   - KDOSRuntime:           '@/core/runtime/KDOSRuntime'
 *   - ExecutiveAssistant:    '@/core/executive/ExecutiveAssistant'
 *   - WorkforceCoordinator:  '@/core/workforce/orchestrator/WorkforceCoordinator'
 *   - TaskQueue:             '@/core/workforce/tasks/TaskQueue'
 *   - ExecutionEngine:       '@/core/workforce/execution/ExecutionEngine'
 *   - WorkflowEngine:        '@/core/workforce/workflow/WorkflowEngine'
 *   - MemorySynchronizer:    '@/core/workforce/memory/MemorySynchronizer'
 *   - EventBus:              '@/core/events/EventBus'
 *   - EmployeeRegistry:      '@/core/workforce/registry/EmployeeRegistry'
 *   - AIGateway:             '@/core/workforce/gateway/AIGateway'
 */

import { NextRequest, NextResponse } from 'next/server'
import { KDOSRuntime } from '@/core/runtime/KDOSRuntime'
import { ExecutiveAssistant } from '@/core/executive/ExecutiveAssistant'
import { WorkforceCoordinator } from '@/core/workforce/orchestrator/WorkforceCoordinator'
import { TaskQueue } from '@/core/workforce/tasks/TaskQueue'
import { ExecutionEngine } from '@/core/workforce/execution/ExecutionEngine'
import { WorkflowEngine } from '@/core/workforce/workflow/WorkflowEngine'
import { MemorySynchronizer } from '@/core/workforce/memory/MemorySynchronizer'
import { EventBus } from '@/core/events/EventBus'
import { EmployeeRegistry } from '@/core/workforce/registry/EmployeeRegistry'
import { AIGateway } from '@/core/workforce/gateway/AIGateway'

/**
 * Expected shape of the incoming POST body.
 */
interface KDOSRequestBody {
  request: string
}

/**
 * Builds a fresh, fully-wired KDOSRuntime instance.
 *
 * A new instance is constructed per request rather than cached at
 * module scope, so each request gets isolated TaskQueue, WorkflowEngine,
 * and MemorySynchronizer state and one request's in-flight work can
 * never leak into another's.
 */
function createRuntime(): KDOSRuntime {
  const eventBus = new EventBus()
  const employeeRegistry = new EmployeeRegistry()
  const aiGateway = new AIGateway()
  const taskQueue = new TaskQueue()

  const executiveAssistant = new ExecutiveAssistant()
  const workforceCoordinator = new WorkforceCoordinator(employeeRegistry)
  const executionEngine = new ExecutionEngine(taskQueue, employeeRegistry, aiGateway)
  const workflowEngine = new WorkflowEngine()
  const memorySynchronizer = new MemorySynchronizer()

  return new KDOSRuntime(
    executiveAssistant,
    workforceCoordinator,
    taskQueue,
    executionEngine,
    workflowEngine,
    memorySynchronizer,
    eventBus,
    aiGateway
  )
}

/**
 * POST /api/kdos
 *
 * Body: { "request": "..." }
 * Response (success): { "success": true, "response": ... }
 * Response (failure): { "success": false, "error": "..." }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: KDOSRequestBody

  try {
    body = (await req.json()) as KDOSRequestBody
  } catch {
    return NextResponse.json(
      { success: false, error: 'Request body must be valid JSON.' },
      { status: 400 }
    )
  }

  if (typeof body.request !== 'string' || body.request.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: 'Field "request" is required and must be a non-empty string.' },
      { status: 400 }
    )
  }

  try {
    const runtime = createRuntime()
    const response = await runtime.execute(body.request)

    return NextResponse.json(
      { success: true, response },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}