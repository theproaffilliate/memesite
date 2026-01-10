# Video Download Feature Setup

This document explains how the video download feature works with audio/no-audio options.

## Overview

The download feature allows users to download videos in multiple formats (MP4, WEBM, GIF) with or without audio.

## Components

### 1. Frontend - DownloadMenu Component

**Location:** `components/DownloadMenu.tsx`

Features:

- Audio selection toggle (With Audio / No Audio)
- Format selection (MP4, WEBM, GIF)
- Handles download via API call
- Displays loading state during download

Props:

- `memeId` (string): The ID of the meme to download
- `onDownload` (callback): Optional callback when download completes

### 2. Backend - Download API

**Location:** `app/api/download/route.ts`

Endpoints:

- `POST /api/download` - Process and download video

Request body:

```json
{
  "memeId": "string",
  "format": "MP4" | "WEBM" | "GIF",
  "audioType": "with" | "no"
}
```

### 3. Video Processor Utility

**Location:** `lib/videoProcessor.ts`

Exports:

- `processVideo(inputPath, outputPath, format, audioType)` - Processes video with FFmpeg
- `getVideoMetadata(videoPath)` - Gets video duration and resolution

## FFmpeg Requirements

The feature requires FFmpeg and FFprobe to be installed on the server:

### Installation

**Windows (using Chocolatey):**

```powershell
choco install ffmpeg
```

**macOS (using Homebrew):**

```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get install ffmpeg
```

Verify installation:

```bash
ffmpeg -version
ffprobe -version
```

## Supported Formats

### MP4

- **With Audio:** H.264 video codec + AAC audio codec
- **Without Audio:** H.264 video codec only (removes all audio)

### WEBM

- **With Audio:** VP9 video codec + Opus audio codec
- **Without Audio:** VP9 video codec only (removes all audio)

### GIF

- **Note:** GIF format doesn't support audio, so audio selection is ignored
- Creates optimized GIF with 10 FPS and scaled down (320px width)

## Flow Diagram

```
User selects audio option & format
          ↓
Clicks format button (MP4/WEBM/GIF)
          ↓
DownloadMenu.handleDownload() called
          ↓
POST to /api/download with params
          ↓
API fetches video from Supabase Storage
          ↓
Creates temporary input file
          ↓
Calls processVideo() with FFmpeg
          ↓
FFmpeg creates output file (with/without audio)
          ↓
API reads processed file
          ↓
Sends to client with proper headers
          ↓
Browser downloads file
          ↓
Temp files cleaned up
```

## Temporary Files

The API creates temporary files in the system's temp directory:

- **Input:** `/tmp/input-{timestamp}.mp4` (on Linux/Mac) or `C:\Users\{User}\AppData\Local\Temp\input-{timestamp}.mp4` (on Windows)
- **Output:** `/tmp/output-{timestamp}.{format}` (on Linux/Mac) or equivalent on Windows

These files are automatically cleaned up after the response is sent.

## Error Handling

The API handles several error cases:

- Missing parameters (400 Bad Request)
- Meme not found (404 Not Found)
- Video download from storage fails (500 Internal Server Error)
- FFmpeg processing fails (500 Internal Server Error)

## Performance Considerations

1. **Processing Time:** FFmpeg processing can take time depending on:

   - Video duration and resolution
   - Output format (GIF conversion is slower)
   - Server CPU capacity

2. **Disk Space:** Ensure sufficient disk space in temp directory for:

   - Input file (size of original video)
   - Output file (typically smaller due to compression)

3. **Memory Usage:** Processing is done synchronously, so server resources are consumed during download requests

## Future Improvements

1. **Async Processing with Queues:** Use Bull or similar to queue downloads
2. **Caching:** Cache popular downloads to avoid re-processing
3. **Progress Updates:** WebSocket support for progress notifications
4. **Cloud Processing:** Offload to cloud service (AWS Lambda, Mux, etc.)
5. **Batch Downloads:** Support downloading multiple videos as ZIP
6. **Watermarking:** Add watermarks to downloaded videos

## Environment Variables

No additional environment variables required. Ensure `NEXT_PUBLIC_SUPABASE_URL` and service role key are configured in `.env.local`.

## Testing

To test the download feature:

1. Navigate to a meme detail page
2. Click the Download button
3. Select audio option (With Audio / No Audio)
4. Select format (MP4 / WEBM / GIF)
5. Click format button
6. Browser should download the processed video
7. Verify the downloaded file:
   - For "No Audio": Check with media player that no audio track exists
   - For different formats: Verify correct file type
   - For GIF: Verify animation is correct

## Troubleshooting

**Error: "Command not found" for ffmpeg**

- FFmpeg is not installed or not in PATH
- Install FFmpeg (see requirements section)
- On Windows, restart terminal after installation

**Error: "Failed to download video"**

- Check Supabase Storage credentials
- Verify meme exists in database
- Check meme's `video_url` is correct

**Download takes very long**

- Video is large or processing power is limited
- Monitor server CPU/disk usage
- Consider optimizing FFmpeg parameters

**File is corrupted**

- Temporary file cleanup failed
- Check disk space
- Try downloading again
