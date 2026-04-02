// ---------------------------------------------------------------------------
// agents/shared/types.ts
// Core contracts shared across every agent in the ShopBazar multi-agent system
// ---------------------------------------------------------------------------

/** Every agent input carries a sessionId for traceability */
export interface AgentContext {
  sessionId: string;
  userId?: number;
  timestamp: number;
}

/** Standardised response envelope every agent must return */
export interface AgentResponse<T = unknown> {
  success: boolean;
  agentName: string;
  data: T;
  error?: string;
  meta?: Record<string, unknown>;
}

/** Tool call signature — every tool is an async function */
export type AgentTool<TInput = unknown, TOutput = unknown> = (
  input: TInput,
  ctx: AgentContext
) => Promise<TOutput>;

/** Registry entry for a named tool */
export interface ToolDefinition<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  execute: AgentTool<TInput, TOutput>;
}

/** Message role in agent conversation history */
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface AgentMessage {
  role: MessageRole;
  content: string;
  toolName?: string;
  toolResult?: unknown;
}

/** Trigger kinds that wake up an agent */
export type TriggerKind =
  | 'user_action'
  | 'system_event'
  | 'scheduled'
  | 'inter_agent';

export interface AgentTrigger {
  kind: TriggerKind;
  source: string;
  payload: Record<string, unknown>;
}
