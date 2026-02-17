-- Table to track API usage and costs per transaction
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    
    -- Transaction Details
    input_text TEXT,
    translated_text TEXT,
    from_lang TEXT,
    to_lang TEXT,
    
    -- AI Providers Used
    provider_stt TEXT, -- e.g., 'openai-whisper', 'deepgram'
    provider_llm TEXT, -- e.g., 'gpt-4o', 'deepseek-chat'
    provider_tts TEXT, -- e.g., 'elevenlabs', 'google-neural'
    
    -- Performance & Cost
    latency_ms INTEGER, -- Total processing time
    cost_estimated NUMERIC(10, 6) DEFAULT 0, -- Estimated cost in USD ($0.005000)
    
    -- Optimization Flags
    is_cache_hit BOOLEAN DEFAULT FALSE, -- True if served from Smart Cache
    is_challenger BOOLEAN DEFAULT FALSE -- True if used Low-Cost stack
);

-- Index for faster analytics
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
