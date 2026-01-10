# Avatar Upload Implementation

## ⚠️ Setup Required - "Bucket not found" Error

If you see **"Bucket not found"** error, follow these steps immediately:

## Supabase Storage Bucket Setup (REQUIRED)

### Step 1: Access Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Click **"Storage"** in the left sidebar

### Step 2: Create Avatar Bucket

1. Click the **"New bucket"** button (top right)
2. Enter bucket name: **`avatars`** (exactly as shown, lowercase)
3. **Uncheck** "Private bucket" to make it PUBLIC
4. Click **"Create new bucket"**

### Step 3: Verify Bucket is Public

After creation:

1. Click on the **`avatars`** bucket name
2. Go to **"Policies"** tab
3. You should see default policies for public access
4. If not, add a policy allowing SELECT for all authenticated users

### Step 4: Test Avatar Upload

1. Go to your profile settings page: `/profile/settings`
2. The "Bucket not found" error should be gone
3. Try uploading an image!

## Troubleshooting

### Still Getting "Bucket not found"?

- Verify bucket name is exactly: `avatars` (lowercase, no underscores)
- Make sure the bucket is set to **PUBLIC** (not Private)
- Clear browser cache and reload
- Try incognito/private window

### "Not authenticated"?

- Make sure you're signed in
- Check your Supabase auth configuration

### Upload hangs or fails?

- Check file size (max 5MB)
- Verify bucket is PUBLIC
- Check browser console for detailed errors

## Features Implemented

### In Profile Settings Page (`/profile/settings`):

✅ **Avatar Upload Section**

- Live preview of current avatar
- File input for selecting new image
- Supported formats: JPG, PNG, GIF
- Max file size: 5MB with validation

✅ **Upload Process**

- Client-side file preview before upload
- Upload to Supabase Storage bucket
- Auto-generates unique filename: `{user-id}-{timestamp}.{ext}`
- Updates user's avatar_url in database
- Success/error messaging
- Auto-refresh after successful upload

✅ **Integration Points**

- Edit button on profile page directs to settings
- Uses existing Supabase client
- Integrates with useUserProfile hook
- Automatic profile refresh after upload
- Avatar displays across app immediately

✅ **Error Handling**

- Friendly error message if bucket is missing
- File size validation (5MB limit)
- Upload error catching
- Database error handling
- User-friendly notifications
- Integrates with useUserProfile hook
- Automatic profile refresh after upload

## How It Works

1. User clicks edit button on profile avatar
2. Directed to `/profile/settings`
3. Select image file (with instant preview)
4. Click "Upload Avatar" button
5. Image uploads to `avatars/` bucket in Supabase
6. Profile record updates with new avatar_url
7. Success message shown
8. Avatar updates across app (profile page + header)

## Database Fields Required

The `users` table needs this field:

- `avatar_url` (text/varchar) - stores the Supabase public URL

This field was already in the schema, so no migrations needed!

## Error Handling

✅ File size validation (max 5MB)
✅ Upload error handling
✅ Database update error handling
✅ User-friendly error messages
✅ Loading states during upload

## Notes

- Avatars are stored in Supabase Storage (not database)
- Public bucket means CDN-fast delivery
- Old avatar URLs remain in database (can implement cleanup later)
- Avatar changes take effect immediately
