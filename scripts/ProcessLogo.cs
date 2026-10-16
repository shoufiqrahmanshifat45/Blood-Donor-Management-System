using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Collections.Generic;

class ProcessLogo
{
    static void Main()
    {
        string inputPath = @"C:\Users\hp\.gemini\antigravity-ide\brain\141e4e4c-df97-4c33-ad7f-3e78d7797577\.user_uploaded\media_1792164077440.jpg";
        Console.WriteLine("Loading original logo from: " + inputPath);

        Bitmap srcBmp = new Bitmap(inputPath);
        int w = srcBmp.Width;
        int h = srcBmp.Height;

        // Step 1: Read all pixels into memory
        Color[,] pixels = new Color[w, h];
        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w; x++)
            {
                pixels[x, y] = srcBmp.GetPixel(x, y);
            }
        }
        srcBmp.Dispose();

        // Step 2: Flood fill to find all background-connected white/light pixels
        // Background condition: high brightness and low color saturation toward red
        // Since the logo is pure red shades, background pixels have G > 180 and B > 180.
        // Even the antialiased transition pixels next to the background have G > 35, B > 35.
        bool[,] isBg = new bool[w, h];
        Queue<Point> queue = new Queue<Point>();

        // Enqueue all boundary pixels that are light
        for (int x = 0; x < w; x++)
        {
            if (IsLightPixel(pixels[x, 0])) { isBg[x, 0] = true; queue.Enqueue(new Point(x, 0)); }
            if (IsLightPixel(pixels[x, h - 1])) { isBg[x, h - 1] = true; queue.Enqueue(new Point(x, h - 1)); }
        }
        for (int y = 0; y < h; y++)
        {
            if (IsLightPixel(pixels[0, y])) { isBg[0, y] = true; queue.Enqueue(new Point(0, y)); }
            if (IsLightPixel(pixels[w - 1, y])) { isBg[w - 1, y] = true; queue.Enqueue(new Point(w - 1, y)); }
        }

        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };

        while (queue.Count > 0)
        {
            Point p = queue.Dequeue();
            for (int i = 0; i < 4; i++)
            {
                int nx = p.X + dx[i];
                int ny = p.Y + dy[i];
                if (nx >= 0 && nx < w && ny >= 0 && ny < h && !isBg[nx, ny])
                {
                    if (IsLightPixel(pixels[nx, ny]))
                    {
                        isBg[nx, ny] = true;
                        queue.Enqueue(new Point(nx, ny));
                    }
                }
            }
        }

        // Also check if any open areas inside the heart weren't reached due to a 1px boundary
        // Let's check internal points in the open heart space:
        Point[] internalSeeds = new Point[] {
            new Point(330, 320), // Top left lobe space
            new Point(690, 320), // Top right lobe space
            new Point(350, 620), // Bottom left space
            new Point(670, 620)  // Bottom right space
        };
        foreach (Point seed in internalSeeds)
        {
            if (!isBg[seed.X, seed.Y] && IsLightPixel(pixels[seed.X, seed.Y]))
            {
                Console.WriteLine("Internal seed " + seed + " was not connected to outside, filling region...");
                isBg[seed.X, seed.Y] = true;
                queue.Enqueue(seed);
                while (queue.Count > 0)
                {
                    Point p = queue.Dequeue();
                    for (int i = 0; i < 4; i++)
                    {
                        int nx = p.X + dx[i];
                        int ny = p.Y + dy[i];
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h && !isBg[nx, ny])
                        {
                            if (IsLightPixel(pixels[nx, ny]))
                            {
                                isBg[nx, ny] = true;
                                queue.Enqueue(new Point(nx, ny));
                            }
                        }
                    }
                }
            }
        }

        // Step 3: Compute exact Alpha and Color de-contamination for transparent PNG
        Bitmap outBmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        int minX = w, maxX = 0, minY = h, maxY = 0;

        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w; x++)
            {
                Color c = pixels[x, y];
                if (isBg[x, y])
                {
                    // It's part of the background region
                    // If it's near pure white (G > 240, B > 240, R > 240): 100% transparent
                    if (c.G >= 242 && c.B >= 242 && c.R >= 242)
                    {
                        outBmp.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                    }
                    else
                    {
                        // Antialiased edge between background and red foreground
                        // Alpha is determined by how much green/blue differs from 255
                        int gb = Math.Min(c.G, c.B);
                        // gb ranges from ~35 (almost pure red) to 242 (almost pure white)
                        double alphaFrac = 1.0 - ((double)(gb - 25) / (242.0 - 25.0));
                        if (alphaFrac < 0.0) alphaFrac = 0.0;
                        if (alphaFrac > 1.0) alphaFrac = 1.0;

                        int alpha = (int)Math.Round(alphaFrac * 255.0);
                        if (alpha <= 4)
                        {
                            outBmp.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        }
                        else
                        {
                            // De-contaminate white background from RGB channels
                            // F = (C - (1-alpha)*255) / alpha
                            double bgWeight = 1.0 - alphaFrac;
                            int r = (int)Math.Round((c.R - bgWeight * 255.0) / alphaFrac);
                            int g = (int)Math.Round((c.G - bgWeight * 255.0) / alphaFrac);
                            int b = (int)Math.Round((c.B - bgWeight * 255.0) / alphaFrac);

                            r = Math.Max(0, Math.Min(255, r));
                            g = Math.Max(0, Math.Min(255, g));
                            b = Math.Max(0, Math.Min(255, b));

                            outBmp.SetPixel(x, y, Color.FromArgb(alpha, r, g, b));

                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }
                else
                {
                    // Foreground logo pixel (including the specular highlight inside the droplet!)
                    outBmp.SetPixel(x, y, Color.FromArgb(255, c.R, c.G, c.B));
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        Console.WriteLine("Content bounding box: X=" + minX + " to " + maxX + " (W=" + (maxX - minX + 1) + "), Y=" + minY + " to " + maxY + " (H=" + (maxY - minY + 1) + ")");

        // Step 4: Create perfectly centered and framed master transparent logo
        // To ensure the logo fits the frame perfectly:
        // We crop to content bounding box, then place it centered onto a square canvas with a 6% balanced margin.
        int contentW = maxX - minX + 1;
        int contentH = maxY - minY + 1;
        int maxDim = Math.Max(contentW, contentH);

        // Target canvas size: 1024x1024 for maximum high-resolution crispness
        int targetSize = 1024;
        // Make content take ~90% of the canvas (50px padding on each side)
        double scale = (targetSize * 0.90) / (double)maxDim;
        int scaledW = (int)Math.Round(contentW * scale);
        int scaledH = (int)Math.Round(contentH * scale);
        int destX = (targetSize - scaledW) / 2;
        int destY = (targetSize - scaledH) / 2;

        Bitmap finalBmp = new Bitmap(targetSize, targetSize, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(finalBmp))
        {
            g.Clear(Color.Transparent);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.CompositingQuality = CompositingQuality.HighQuality;

            Rectangle srcRect = new Rectangle(minX, minY, contentW, contentH);
            Rectangle destRect = new Rectangle(destX, destY, scaledW, scaledH);
            g.DrawImage(outBmp, destRect, srcRect, GraphicsUnit.Pixel);
        }

        // Save high-resolution transparent master PNG
        string masterPngPath = @"public\logo.png";
        finalBmp.Save(masterPngPath, ImageFormat.Png);
        Console.WriteLine("Saved: " + masterPngPath);

        string redpulsePngPath = @"public\redpulse-logo.png";
        finalBmp.Save(redpulsePngPath, ImageFormat.Png);
        Console.WriteLine("Saved: " + redpulsePngPath);

        string assetsLogoPath = @"src\assets\logo.png";
        finalBmp.Save(assetsLogoPath, ImageFormat.Png);
        Console.WriteLine("Saved: " + assetsLogoPath);

        string faviconPngPath = @"public\favicon.png";
        finalBmp.Save(faviconPngPath, ImageFormat.Png);
        Console.WriteLine("Saved: " + faviconPngPath);

        // Step 5: Convert final transparent logo to Base64 data URL for PDF export
        using (MemoryStream ms = new MemoryStream())
        {
            finalBmp.Save(ms, ImageFormat.Png);
            byte[] bytes = ms.ToArray();
            string b64 = Convert.ToBase64String(bytes);
            string dataUrl = "data:image/png;base64," + b64;
            string tsContent = "export const redPulseLogoBase64 = '" + dataUrl + "';\n";
            File.WriteAllText(@"src\assets\logoBase64.ts", tsContent);
            Console.WriteLine("Updated src/assets/logoBase64.ts (Data URL length: " + dataUrl.Length + " chars)");
        }

        finalBmp.Dispose();
        outBmp.Dispose();
        Console.WriteLine("Logo background removal and frame adjustment completed successfully!");
    }

    static bool IsLightPixel(Color c)
    {
        // Light background pixels have high green and blue, whereas red foreground has G < 60, B < 60
        return (c.G > 120 && c.B > 120 && c.R > 180);
    }
}
