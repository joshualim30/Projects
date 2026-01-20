-- Create application_status enum if you want strict types (optional)
-- CREATE TYPE application_status AS ENUM ('Applied', 'Screening', 'Interviewing', 'Technical', 'Offer', 'Rejected', 'InActive');

CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  status TEXT NOT NULL DEFAULT 'Applied',
  job_url TEXT,
  notes TEXT,
  contact_name TEXT,
  contact_email TEXT,
  applied_date DATE DEFAULT CURRENT_DATE,
  last_activity TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access (since it's a local personal app, we keep it simple)
-- In a real production app, you would restrict this to authenticated users.
CREATE POLICY "Allow all access" ON applications FOR ALL USING (true) WITH CHECK (true);
