CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    username VARCHAR(255),
    picture TEXT,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    tutorial_completed BOOLEAN DEFAULT FALSE,
    tutorial_progress JSONB DEFAULT '{"lastStep": 0, "completedSteps": [], "dismissedPages": []}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
