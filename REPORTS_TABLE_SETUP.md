# Reports Table Setup

This file contains the SQL commands needed to set up the reports table in your Supabase database.

## 1. Create the Reports Table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meme_id UUID NOT NULL REFERENCES memes(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  comment TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'acted-upon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reporter_id, meme_id)
);

-- Create indexes for faster queries
CREATE INDEX idx_reports_meme_id ON reports(meme_id);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
```

## 2. Set Up Row Level Security (RLS)

Run these SQL commands to enable RLS:

```sql
-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create reports (insert)
CREATE POLICY "Users can create reports"
ON reports
FOR INSERT
WITH CHECK (reporter_id = auth.uid());

-- Policy: Users can view their own reports
CREATE POLICY "Users can view their own reports"
ON reports
FOR SELECT
USING (reporter_id = auth.uid());

-- Policy: Admin/Service role can view all reports (for moderation)
-- Note: This uses the authenticated user as a proxy; adjust based on your admin system
CREATE POLICY "Service role can manage all reports"
ON reports
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);
```

## 3. Verify the Setup

After running the SQL:

1. Go to Supabase Dashboard → SQL Editor
2. Run a test query:
   ```sql
   SELECT * FROM reports LIMIT 1;
   ```
3. You should see an empty table with the correct columns

## Alternative: Quick Copy-Paste

If your Supabase SQL Editor accepts all commands at once, copy this entire block:

```sql
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meme_id UUID NOT NULL REFERENCES memes(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  comment TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'acted-upon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reporter_id, meme_id)
);

CREATE INDEX idx_reports_meme_id ON reports(meme_id);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
ON reports
FOR INSERT
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view their own reports"
ON reports
FOR SELECT
USING (reporter_id = auth.uid());

CREATE POLICY "Service role can manage all reports"
ON reports
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);
```

## Important Notes

- The `UNIQUE(reporter_id, meme_id)` constraint prevents users from reporting the same meme multiple times
- The CASCADE delete rules ensure reports are deleted when a user or meme is deleted
- The `status` field can be: 'pending', 'reviewed', 'dismissed', or 'acted-upon'
- Make sure to set `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local` for the API endpoint to work
