-- ============================================================
-- SOVEREIGN PREDATOR SUITE - Initial Database Schema
-- Phase 1: Foundation
-- Target: Supabase PostgreSQL
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: leads
-- Bisnis UMKM yang ditemukan oleh Scout Agent
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'generic',
    address TEXT,
    phone TEXT,
    owner_name TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    website_url TEXT,
    google_maps_url TEXT,
    gps_lat DECIMAL(10,7),
    gps_lng DECIMAL(10,7),
    ai_score INTEGER DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
    digital_gap_score INTEGER DEFAULT 0 CHECK (digital_gap_score >= 0 AND digital_gap_score <= 100),
    digital_gap_analysis JSONB DEFAULT '{}',
    recommended_approach TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'converted', 'rejected')),
    notes TEXT,
    source TEXT DEFAULT 'serpapi',
    search_query TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category);
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON leads(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- ============================================================
-- TABLE: messages
-- Pesan WhatsApp yang di-generate oleh Closer Agent
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'initial' CHECK (message_type IN ('initial', 'followup', 'closing')),
    wa_deeplink TEXT,
    sent_at TIMESTAMPTZ,
    response_status TEXT DEFAULT 'pending' CHECK (response_status IN ('pending', 'sent', 'read', 'replied', 'no_response')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- ============================================================
-- TABLE: demo_websites
-- Ghost Websites yang di-generate oleh Architect Agent
-- ============================================================
CREATE TABLE IF NOT EXISTS demo_websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    business_name TEXT NOT NULL,
    template_type TEXT NOT NULL DEFAULT 'generic' CHECK (template_type IN ('barber', 'cafe', 'salon', 'workshop', 'generic')),
    deploy_url TEXT,
    html_content TEXT,
    generated_content JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'deployed', 'active', 'expired')),
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for demo_websites
CREATE INDEX IF NOT EXISTS idx_demos_lead_id ON demo_websites(lead_id);
CREATE INDEX IF NOT EXISTS idx_demos_status ON demo_websites(status);
CREATE INDEX IF NOT EXISTS idx_demos_created_at ON demo_websites(created_at DESC);

-- ============================================================
-- TABLE: transactions
-- Revenue tracking oleh Harvester Agent
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    amount_idr DECIMAL(15,2) NOT NULL DEFAULT 0,
    amount_usd DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    payment_method TEXT DEFAULT 'transfer' CHECK (payment_method IN ('transfer', 'ewallet', 'qris', 'midtrans', 'doku', 'cash', 'other')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    invoice_number TEXT,
    invoice_url TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_txn_lead_id ON transactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_txn_status ON transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_txn_paid_at ON transactions(paid_at DESC);
CREATE INDEX IF NOT EXISTS idx_txn_created_at ON transactions(created_at DESC);

-- ============================================================
-- TABLE: agent_logs
-- Activity log dari semua AI Agents
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type TEXT NOT NULL CHECK (agent_type IN ('scout', 'profiler', 'closer', 'architect', 'harvester', 'orchestrator')),
    action TEXT NOT NULL,
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'error')),
    error_message TEXT,
    execution_time_ms INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for agent_logs
CREATE INDEX IF NOT EXISTS idx_logs_agent_type ON agent_logs(agent_type);
CREATE INDEX IF NOT EXISTS idx_logs_status ON agent_logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON agent_logs(created_at DESC);

-- ============================================================
-- TABLE: system_config
-- Konfigurasi sistem (target, settings, dll)
-- ============================================================
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default config
INSERT INTO system_config (key, value) VALUES
    ('target_revenue', '{"idr": 7500000, "usd": 500}'),
    ('profit_split', '{"operational": 30, "growth": 20, "liquidity": 30, "staking": 20}'),
    ('default_area', '"Jakarta Selatan"'),
    ('default_category', '"barber"'),
    ('ai_score_threshold', '70'),
    ('version', '"1.0.0"')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to leads table
DROP TRIGGER IF EXISTS trigger_leads_updated_at ON leads;
CREATE TRIGGER trigger_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Basic setup
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated and anon users (for MVP)
-- In production, restrict to authenticated users only
CREATE POLICY "Allow all for anon" ON leads FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON messages FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON demo_websites FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON transactions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON agent_logs FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON system_config FOR ALL TO anon USING (true) WITH CHECK (true);

-- Service role policies (full access)
CREATE POLICY "Allow all for service_role" ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service_role" ON messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service_role" ON demo_websites FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service_role" ON transactions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service_role" ON agent_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service_role" ON system_config FOR ALL TO service_role USING (true) WITH CHECK (true);
