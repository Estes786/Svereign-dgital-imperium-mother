// ============================================================
// SOVEREIGN PREDATOR SUITE - Supabase Client (Edge-compatible)
// Using REST API directly (no @supabase/supabase-js needed)
// ============================================================

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

export class SupabaseClient {
  private url: string
  private key: string

  constructor(config: SupabaseConfig) {
    this.url = config.url
    this.key = config.serviceRoleKey || config.anonKey
  }

  private get headers() {
    return {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  }

  // ============ GENERIC REST OPERATIONS ============

  async select(table: string, query?: string): Promise<any[]> {
    const url = `${this.url}/rest/v1/${table}${query ? '?' + query : ''}`
    const res = await fetch(url, { headers: this.headers })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Supabase SELECT error: ${res.status} - ${err}`)
    }
    return res.json()
  }

  async insert(table: string, data: any | any[]): Promise<any[]> {
    const url = `${this.url}/rest/v1/${table}`
    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(Array.isArray(data) ? data : [data])
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Supabase INSERT error: ${res.status} - ${err}`)
    }
    return res.json()
  }

  async update(table: string, data: any, query: string): Promise<any[]> {
    const url = `${this.url}/rest/v1/${table}?${query}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Supabase UPDATE error: ${res.status} - ${err}`)
    }
    return res.json()
  }

  async delete(table: string, query: string): Promise<any[]> {
    const url = `${this.url}/rest/v1/${table}?${query}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.headers
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Supabase DELETE error: ${res.status} - ${err}`)
    }
    return res.json()
  }

  // ============ RPC (Stored Procedures) ============

  async rpc(fn: string, params?: any): Promise<any> {
    const url = `${this.url}/rest/v1/rpc/${fn}`
    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: params ? JSON.stringify(params) : '{}'
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Supabase RPC error: ${res.status} - ${err}`)
    }
    return res.json()
  }
}

// ============ HELPER: Create client from env ============
export function createSupabaseClient(env: {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}): SupabaseClient {
  return new SupabaseClient({
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY
  })
}
