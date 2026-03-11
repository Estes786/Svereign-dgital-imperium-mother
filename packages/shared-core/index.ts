// ============================================================
// SOVEREIGN SHARED CORE - Central Logic Hub
// Shared API clients, constants, and utilities
// ============================================================

// === CONSTANTS ===
export const SOVEREIGN_CONFIG = {
  name: 'Sovereign Digital Imperium',
  version: '1.0.0',
  owner: 'GYS (The Sovereign Orchestrator)',
  target_liquidity_idr: 7_500_000,
  target_liquidity_usd: 500,

  // Revenue Split (Harvester Pattern)
  profit_split: {
    operational: 0.30,  // 30% - Daily ops
    growth: 0.20,       // 20% - Marketing & scaling
    liquidity: 0.30,    // 30% - $HYPHA LP
    staking: 0.10,      // 10% - Staking yield
    owner: 0.10,        // 10% - Owner profit
  },

  // Agent Types
  agents: ['scout', 'profiler', 'ghostwriter', 'architect', 'harvester', 'orchestrator'] as const,

  // Layers
  layers: {
    L0: 'Real World (Physical Business)',
    L1: 'Web 2.5 Bridge (Revenue Engine)',
    L2: 'Web 3.0 Token Economy ($HYPHA)',
    L3: 'Web 4.0 AI Orchestration (CrewAI)',
    L4: 'Web 5.0 Self-Sovereign Identity (DID)',
  },
} as const

export type AgentType = typeof SOVEREIGN_CONFIG.agents[number]

// === IDR / USD CONVERSION ===
export function idrToUsd(idr: number, rate: number = 15000): number {
  return Math.round((idr / rate) * 100) / 100
}

export function usdToIdr(usd: number, rate: number = 15000): number {
  return Math.round(usd * rate)
}

export function formatIDR(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID')
}

export function formatUSD(amount: number): string {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// === PROGRESS CALCULATOR ===
export function calculateProgress(currentRevenue: number): {
  percent: number
  remaining_idr: number
  remaining_usd: number
  status: 'starting' | 'hunting' | 'closing' | 'scaling' | 'achieved'
} {
  const percent = Math.min(100, Math.round((currentRevenue / SOVEREIGN_CONFIG.target_liquidity_idr) * 100))
  const remaining = Math.max(0, SOVEREIGN_CONFIG.target_liquidity_idr - currentRevenue)

  let status: 'starting' | 'hunting' | 'closing' | 'scaling' | 'achieved'
  if (percent >= 100) status = 'achieved'
  else if (percent >= 75) status = 'scaling'
  else if (percent >= 40) status = 'closing'
  else if (percent >= 10) status = 'hunting'
  else status = 'starting'

  return { percent, remaining_idr: remaining, remaining_usd: idrToUsd(remaining), status }
}

// === PROFIT SPLIT CALCULATOR ===
export function calculateProfitSplit(totalRevenue: number) {
  const { profit_split } = SOVEREIGN_CONFIG
  return {
    operational: Math.round(totalRevenue * profit_split.operational),
    growth: Math.round(totalRevenue * profit_split.growth),
    liquidity: Math.round(totalRevenue * profit_split.liquidity),
    staking: Math.round(totalRevenue * profit_split.staking),
    owner: Math.round(totalRevenue * profit_split.owner),
    total: totalRevenue,
  }
}

// === GROQ API CLIENT (Shared) ===
export async function callGroqAPI(
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  model: string = 'llama-3.3-70b-versatile',
  temperature: number = 0.7,
  maxTokens: number = 1024,
): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Groq API Error ${response.status}: ${err}`)
  }

  const data: any = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

// === TIMESTAMP HELPERS ===
export function nowISO(): string {
  return new Date().toISOString()
}

export function todayDate(): string {
  return new Date().toISOString().split('T')[0]
}

// === SOVEREIGN BRIDGE EVENT ===
export interface BridgeEvent {
  type: 'revenue_in' | 'agent_upgraded' | 'lead_found' | 'deal_closed' | 'demo_deployed'
  source: 'web2-predator' | 'web25-store' | 'web3-economy'
  payload: Record<string, any>
  timestamp: string
}

export function createBridgeEvent(
  type: BridgeEvent['type'],
  source: BridgeEvent['source'],
  payload: Record<string, any>
): BridgeEvent {
  return { type, source, payload, timestamp: nowISO() }
}
