// lib/videoProcessor.ts
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Process video with specified options
 * @param inputPath Path to input video file
 * @param outputPath Path to output video file
 * @param format Output format (MP4, WEBM, GIF)
 * @param audioType Whether to include audio ('with' or 'no')
 */
export async function processVideo(
  inputPath: string,
  outputPath: string,
  format: string = "MP4",
  audioType: "with" | "no" = "with"
): Promise<void> {
  let command = "";

  switch (format.toUpperCase()) {
    case "MP4":
      if (audioType === "no") {
        // MP4 without audio
        command = `ffmpeg -i "${inputPath}" -c:v libx264 -an -crf 23 "${outputPath}"`;
      } else {
        // MP4 with audio
        command = `ffmpeg -i "${inputPath}" -c:v libx264 -c:a aac -crf 23 "${outputPath}"`;
      }
      break;

    case "WEBM":
      if (audioType === "no") {
        // WEBM without audio
        command = `ffmpeg -i "${inputPath}" -c:v libvpx-vp9 -an "${outputPath}"`;
      } else {
        // WEBM with audio
        command = `ffmpeg -i "${inputPath}" -c:v libvpx-vp9 -c:a libopus "${outputPath}"`;
      }
      break;

    case "GIF":
      // GIF doesn't support audio, so we ignore audioType
      command = `ffmpeg -i "${inputPath}" -vf "fps=10,scale=320:-1:flags=lanczos" "${outputPath}"`;
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  try {
    const { stdout, stderr } = await execAsync(command);
    console.log("FFmpeg stdout:", stdout);
  } catch (error: any) {
    console.error("FFmpeg error:", error);
    throw new Error(`Video processing failed: ${error.message}`);
  }
}

/**
 * Get video metadata (duration, resolution, etc.)
 */
export async function getVideoMetadata(
  videoPath: string
): Promise<{ duration: number; width: number; height: number }> {
  const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:nk=1 "${videoPath}"`;

  try {
    const { stdout } = await execAsync(command);
    const duration = parseFloat(stdout.trim());
    return { duration, width: 0, height: 0 };
  } catch (error: any) {
    console.error("FFprobe error:", error);
    throw new Error("Failed to get video metadata");
  }
}
