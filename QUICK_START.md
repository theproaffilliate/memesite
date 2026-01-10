# Quick Start Guide: Reports & User Attribution

## What Was Built

✅ **Creator Name Display** - Meme cards now show the actual username of who uploaded them
✅ **Clickable Creator Links** - Click any creator name to view their profile
✅ **Report System** - Users can report memes with reasons and comments
✅ **Backend Validation** - Reports are validated, deduplicated, and stored securely

---

## Getting Started (3 Steps)

### Step 1: Set Up Reports Table (5 minutes)

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the entire SQL from this file: `REPORTS_TABLE_SETUP.md`
4. Paste it into the SQL Editor
5. Click **Run**
6. Wait for success message

That's it! The reports table is ready.

### Step 2: Check Environment Variables (1 minute)

Make sure your `.env.local` has:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Find it in: Supabase Dashboard → Project Settings → API Keys → Service Role Key

If it's missing, copy it and add it to `.env.local`

### Step 3: Test It Out (2 minutes)

1. Start your dev server: `npm run dev`
2. Go to home page and find any meme
3. You should see creator name instead of "By User" ✅
4. Click the creator name - should go to their profile ✅
5. Click three-dot menu → "Report"
6. ReportModal should pop up ✅
7. Select a reason and click "Submit Report" ✅
8. See success message ✅

---

## Feature Overview

### Creator Names

**Before:**

```
Views: 123 • Downloads: 45
By User
```

**After:**

```
Views: 123 • Downloads: 45
By John Smith (clickable, cyan colored)
```

### Report System

Click menu → Report → Fill form → Submit → Done!

**Report Modal includes:**

- Reason dropdown (7 categories)
- Optional comment field (500 char limit)
- Character counter
- Auth validation
- Success/error messages

**Reports are saved with:**

- Meme ID
- Reporter ID
- Reason
- Comment (optional)
- Timestamp
- Status (pending for review)

---

## Database Schema

### Reports Table Structure

| Column      | Type      | Purpose                               |
| ----------- | --------- | ------------------------------------- |
| id          | UUID      | Unique report ID                      |
| meme_id     | UUID      | Which meme was reported               |
| reporter_id | UUID      | Who reported it                       |
| reason      | TEXT      | Why it was reported                   |
| comment     | TEXT      | Additional details                    |
| status      | TEXT      | pending/reviewed/dismissed/acted-upon |
| created_at  | TIMESTAMP | When reported                         |

**Unique Constraint:** One person can't report the same meme twice

---

## Code Changes Made

### 1. Database Layer (`lib/`)

**types.ts** - Added to Meme interface:

```typescript
creator_name?: string;
```

**memeApi.ts** - All 3 query functions now:

- Join with users table
- Fetch creator name
- Transform response to include `creator_name`

### 2. Components (`components/`)

**MemeCard.tsx** - Updated:

- Import ReportModal
- Add state for modal visibility
- Wrap creator name in clickable Link
- Show ReportModal when report clicked

**ReportModal.tsx** - NEW:

- Beautiful modal form
- Dropdown for reasons
- Text area for comments
- Auth check
- Duplicate prevention
- Loading/success states

### 3. API (`app/api/`)

**report/route.ts** - NEW POST endpoint:

- Validates user is logged in
- Checks meme exists
- Prevents duplicates
- Saves to database
- Returns proper HTTP codes

---

## How Data Flows

### User Sees Creator Name

```
1. User visits home page
2. App calls getMemes()
3. Query joins memes + users table
4. Returns data with creator_name field
5. MemeCard displays {meme.creator_name}
```

### User Reports a Meme

```
1. Click menu → Report
2. ReportModal opens
3. Fill out form
4. Click Submit
5. POST to /api/report
6. API checks:
   - User is logged in? ✓
   - Meme exists? ✓
   - Not already reported? ✓
7. Save to reports table
8. Return success
9. Modal closes
```

---

## Monitoring & Management

### View Reports in Supabase

1. Go to Supabase Dashboard
2. Click "reports" table
3. See all reports with:
   - Who reported it (reporter_id)
   - What meme (meme_id)
   - Why (reason)
   - When (created_at)
   - Status (pending/reviewed/etc)

### Manage Reports

- Click any report to edit
- Change status from "pending" to "reviewed" or "dismissed"
- Add notes in comment field (or use dedicated admin tools later)
- Delete if duplicate/test

---

## Troubleshooting

### Problem: Creator name shows as "User"

- Check Supabase users table has name field populated
- Verify user records weren't deleted
- Try logging out and back in

### Problem: Can't submit report

- Are you logged in? (ReportModal checks this)
- Try clearing cache: Ctrl+Shift+Del
- Check browser console for errors
- Verify SUPABASE_SERVICE_ROLE_KEY in .env.local

### Problem: Reports table doesn't exist

- Run SQL commands from REPORTS_TABLE_SETUP.md
- Refresh Supabase dashboard
- Check for any SQL errors

### Problem: Always get "already reported" error

- You can only report each meme once
- This is intentional (prevents spam)
- Try reporting a different meme

---

## Security & Privacy

### What's Protected

- ✅ Only logged-in users can report
- ✅ Each user can only report each meme once
- ✅ Reporters are authenticated via JWT
- ✅ RLS policies prevent unauthorized access
- ✅ Reports can't be deleted by reporters (only admins)

### What's Public

- ✅ Creator names (on meme cards)
- ✅ Creator profiles (via /profile?id=...)
- ✅ Meme metadata (title, tags, stats)

### What's Private

- ❌ Report contents (only admins see)
- ❌ Reporter identities (not shown on memes)
- ❌ Report statuses (hidden from public)

---

## Next Steps (Optional)

### Future Enhancements

1. **Moderation Dashboard**

   - View all pending reports
   - Filter by reason/date/meme
   - Bulk actions (dismiss/review)

2. **Admin Tools**

   - Mark reports as reviewed
   - Leave admin notes
   - Auto-notify moderators

3. **Creator Notifications**

   - Alert creators when meme reported
   - Show reason (if appropriate)
   - Request appeal process

4. **Metrics**

   - Most reported memes
   - Most common report reasons
   - Reports per meme type

5. **Auto-Actions**
   - Auto-hide after N reports
   - Remove after admin review
   - Suspend repeat offenders

---

## Testing Checklist

Before showing to users:

- [ ] Creator names display on home page
- [ ] Creator names are clickable
- [ ] Creator links go to correct profile
- [ ] Report modal opens when clicked
- [ ] Can submit report successfully
- [ ] Can't submit without reason selected
- [ ] Can't submit while logged out
- [ ] Can't report same meme twice
- [ ] New reports appear in Supabase
- [ ] Success message shows on submit
- [ ] Modal closes after success
- [ ] Error messages display properly

---

## Questions?

Check these files for details:

- **REPORTS_TABLE_SETUP.md** - Database schema and RLS setup
- **IMPLEMENTATION_SUMMARY.md** - Technical details and code changes
- **components/ReportModal.tsx** - Modal component code
- **app/api/report/route.ts** - Backend API code
- **lib/memeApi.ts** - Database query code
