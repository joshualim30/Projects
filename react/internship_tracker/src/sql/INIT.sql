-- INIT.sql
-- This file is used to initialize the database for Supabase

-- Create the internship table
CREATE TABLE IF NOT EXISTS internships (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_location VARCHAR(255),
    company_website VARCHAR(500),
    company_logo VARCHAR(500),
    company_description TEXT,
    company_industry VARCHAR(255),
    company_size VARCHAR(100),
    position_description TEXT,
    salary_range VARCHAR(100),
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'interview_scheduled', 'interview_completed', 'offer_received', 'offer_accepted', 'offer_declined', 'rejected', 'withdrawn')),
    interview_date TIMESTAMP,
    notes TEXT,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    application_url VARCHAR(500),
    resume_version VARCHAR(100),
    cover_letter_version VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_internships_company ON internships(company_name);
CREATE INDEX IF NOT EXISTS idx_internships_date ON internships(application_date);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_internships_updated_at 
    BEFORE UPDATE ON internships 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
