-- 1. Migration Logic: Rename legacy 'internships' table to 'applications' if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'internships') THEN
    ALTER TABLE IF EXISTS internships RENAME TO applications;
  END IF;
END $$;

-- 2. Applications Table Definition
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Core Fields
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied',
  
  -- Details
  location TEXT,
  salary_range TEXT,
  job_url TEXT,
  notes TEXT,
  
  -- Dates
  applied_date DATE DEFAULT CURRENT_DATE,
  last_activity TIMESTAMPTZ DEFAULT now(),
  
  -- Contact Info
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- V2 Fields (Ensure existence if table was renamed)
  salary_min NUMERIC,
  salary_max NUMERIC,
  currency TEXT DEFAULT 'USD',
  locations TEXT[],           -- Array of strings for multiple locations
  rejection_source TEXT,      -- 'Me' | 'Them' | 'Auto'
  rejection_reason TEXT,
  interview_stages JSONB DEFAULT '[]'::jsonb
);

-- 3. Add Columns Safely (Idempotent Migration for existing tables)
DO $$
BEGIN
    -- Ensure columns exist if table was migrated or created with old schema
    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS salary_min NUMERIC;
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS salary_max NUMERIC;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
         ALTER TABLE applications ADD COLUMN IF NOT EXISTS locations TEXT[];
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejection_source TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_stages JSONB DEFAULT '[]'::jsonb;
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_version TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS cover_letter_version TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- 4. Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Allow all access" ON applications;
CREATE POLICY "Allow all access" ON applications FOR ALL USING (true) WITH CHECK (true);

-- 6. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE,
  bio TEXT,
  key_achievements TEXT,
  experience_summary TEXT,
  skills TEXT,
  updated_at TIMESTAMPTZ DEFAULT current_timestamp
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access" ON user_profiles;
CREATE POLICY "Allow all access" ON user_profiles FOR ALL USING (true);
