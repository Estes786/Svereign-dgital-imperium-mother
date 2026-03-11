#!/usr/bin/env python3
"""
Apply Supabase Database Migration for Sovereign Predator Suite
Uses Supabase Management API with Access Key (sbp_...)
"""
import requests
import sys

# Supabase Management API
SUPABASE_ACCESS_KEY = "sbp_4995bddd765d0bd89c1e80b19086c9d70ec7220f"
PROJECT_REF = "ztndcxvgcwppihtipntg"  # extracted from SUPABASE_URL

# Management API base URL
MGMT_API = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"

headers = {
    "Authorization": f"Bearer {SUPABASE_ACCESS_KEY}",
    "Content-Type": "application/json"
}

# Read the migration SQL file
with open("/home/user/webapp/migrations/0001_initial_schema.sql", "r") as f:
    full_sql = f.read()

# Split SQL into individual statements (handling functions/triggers separately)
# We'll execute key blocks separately to handle errors gracefully
sql_blocks = [
    # Block 1: Enable UUID extension
    """CREATE EXTENSION IF NOT EXISTS "uuid-ossp";""",
    
    # Block 2: Create leads table
    """CREATE TABLE IF NOT EXISTS leads (
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
    );""",
    
    # Block 3: Leads indexes
    """CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category);
    CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON leads(ai_score DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);""",
    
    # Block 4: Messages table
    """CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
        message_text TEXT NOT NULL,
        message_type TEXT NOT NULL DEFAULT 'initial' CHECK (message_type IN ('initial', 'followup', 'closing')),
        wa_deeplink TEXT,
        sent_at TIMESTAMPTZ,
        response_status TEXT DEFAULT 'pending' CHECK (response_status IN ('pending', 'sent', 'read', 'replied', 'no_response')),
        created_at TIMESTAMPTZ DEFAULT NOW()
    );""",
    
    # Block 5: Messages indexes
    """CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON messages(lead_id);
    CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);""",
    
    # Block 6: Demo websites table
    """CREATE TABLE IF NOT EXISTS demo_websites (
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
    );""",
    
    # Block 7: Demo indexes
    """CREATE INDEX IF NOT EXISTS idx_demos_lead_id ON demo_websites(lead_id);
    CREATE INDEX IF NOT EXISTS idx_demos_status ON demo_websites(status);
    CREATE INDEX IF NOT EXISTS idx_demos_created_at ON demo_websites(created_at DESC);""",
    
    # Block 8: Transactions table
    """CREATE TABLE IF NOT EXISTS transactions (
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
    );""",
    
    # Block 9: Transaction indexes
    """CREATE INDEX IF NOT EXISTS idx_txn_lead_id ON transactions(lead_id);
    CREATE INDEX IF NOT EXISTS idx_txn_status ON transactions(payment_status);
    CREATE INDEX IF NOT EXISTS idx_txn_paid_at ON transactions(paid_at DESC);
    CREATE INDEX IF NOT EXISTS idx_txn_created_at ON transactions(created_at DESC);""",
    
    # Block 10: Agent logs table
    """CREATE TABLE IF NOT EXISTS agent_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        agent_type TEXT NOT NULL CHECK (agent_type IN ('scout', 'profiler', 'closer', 'architect', 'harvester', 'orchestrator')),
        action TEXT NOT NULL,
        input_data JSONB DEFAULT '{}',
        output_data JSONB DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'error')),
        error_message TEXT,
        execution_time_ms INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );""",
    
    # Block 11: Agent logs indexes
    """CREATE INDEX IF NOT EXISTS idx_logs_agent_type ON agent_logs(agent_type);
    CREATE INDEX IF NOT EXISTS idx_logs_status ON agent_logs(status);
    CREATE INDEX IF NOT EXISTS idx_logs_created_at ON agent_logs(created_at DESC);""",
    
    # Block 12: System config table
    """CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );""",
    
    # Block 13: Default config
    """INSERT INTO system_config (key, value) VALUES
        ('target_revenue', '{"idr": 7500000, "usd": 500}'),
        ('profit_split', '{"operational": 30, "growth": 20, "liquidity": 30, "staking": 20}'),
        ('default_area', '"Jakarta Selatan"'),
        ('default_category', '"barber"'),
        ('ai_score_threshold', '70'),
        ('version', '"1.0.0"')
    ON CONFLICT (key) DO NOTHING;""",
    
    # Block 14: Update trigger function
    """CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;""",
    
    # Block 15: Apply trigger
    """DROP TRIGGER IF EXISTS trigger_leads_updated_at ON leads;
    CREATE TRIGGER trigger_leads_updated_at
        BEFORE UPDATE ON leads
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();""",
    
    # Block 16: Enable RLS
    """ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
    ALTER TABLE demo_websites ENABLE ROW LEVEL SECURITY;
    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;""",
    
    # Block 17: RLS policies for anon
    """DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon' AND tablename = 'leads') THEN
            CREATE POLICY "Allow all for anon" ON leads FOR ALL TO anon USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon' AND tablename = 'messages') THEN
            CREATE POLICY "Allow all for anon" ON messages FOR ALL TO anon USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon' AND tablename = 'demo_websites') THEN
            CREATE POLICY "Allow all for anon" ON demo_websites FOR ALL TO anon USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon' AND tablename = 'transactions') THEN
            CREATE POLICY "Allow all for anon" ON transactions FOR ALL TO anon USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon' AND tablename = 'agent_logs') THEN
            CREATE POLICY "Allow all for anon" ON agent_logs FOR ALL TO anon USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon' AND tablename = 'system_config') THEN
            CREATE POLICY "Allow all for anon" ON system_config FOR ALL TO anon USING (true) WITH CHECK (true);
        END IF;
    END $$;""",
    
    # Block 18: RLS policies for service_role
    """DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for service_role' AND tablename = 'leads') THEN
            CREATE POLICY "Allow all for service_role" ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for service_role' AND tablename = 'messages') THEN
            CREATE POLICY "Allow all for service_role" ON messages FOR ALL TO service_role USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for service_role' AND tablename = 'demo_websites') THEN
            CREATE POLICY "Allow all for service_role" ON demo_websites FOR ALL TO service_role USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for service_role' AND tablename = 'transactions') THEN
            CREATE POLICY "Allow all for service_role" ON transactions FOR ALL TO service_role USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for service_role' AND tablename = 'agent_logs') THEN
            CREATE POLICY "Allow all for service_role" ON agent_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for service_role' AND tablename = 'system_config') THEN
            CREATE POLICY "Allow all for service_role" ON system_config FOR ALL TO service_role USING (true) WITH CHECK (true);
        END IF;
    END $$;""",
]

print("=" * 60)
print("SOVEREIGN PREDATOR SUITE - Database Migration")
print("=" * 60)
print(f"Project: {PROJECT_REF}")
print(f"Total SQL blocks: {len(sql_blocks)}")
print()

success_count = 0
error_count = 0

for i, sql in enumerate(sql_blocks, 1):
    print(f"[{i}/{len(sql_blocks)}] Executing block...", end=" ")
    
    try:
        resp = requests.post(
            MGMT_API,
            headers=headers,
            json={"query": sql}
        )
        
        if resp.status_code == 201 or resp.status_code == 200:
            print("OK")
            success_count += 1
        else:
            # Try to get error detail
            try:
                err = resp.json()
                err_msg = err.get('message', err.get('error', str(err)))
            except:
                err_msg = resp.text[:200]
            print(f"WARN ({resp.status_code}): {err_msg}")
            # Still count as success if it's a duplicate/already exists error
            if "already exists" in str(err_msg).lower() or "duplicate" in str(err_msg).lower():
                success_count += 1
            else:
                error_count += 1
    except Exception as e:
        print(f"ERROR: {str(e)}")
        error_count += 1

print()
print("=" * 60)
print(f"Migration Complete: {success_count} OK, {error_count} errors")
print("=" * 60)

# Verify tables exist
print("\nVerifying tables...")
verify_sql = """
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
"""
try:
    resp = requests.post(MGMT_API, headers=headers, json={"query": verify_sql})
    if resp.status_code in [200, 201]:
        tables = resp.json()
        print(f"Tables found: {tables}")
    else:
        print(f"Verify failed: {resp.status_code} - {resp.text[:200]}")
except Exception as e:
    print(f"Verify error: {e}")
