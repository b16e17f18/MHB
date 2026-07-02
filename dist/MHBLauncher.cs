using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Text;
using System.Threading;

namespace MHBLauncher
{
    internal static class Program
    {
        private const string AppName = "MHB";
        private const string PayloadResourceName = "MHB.Payload.zip";

        private static string rootDirectory = "";
        private static bool running = true;

        private static void Main()
        {
            Console.OutputEncoding = Encoding.UTF8;
            Console.Title = "MHB";

            try
            {
                rootDirectory = ExtractPayload();
                var listener = new TcpListener(IPAddress.Loopback, 0);
                listener.Start();
                var port = ((IPEndPoint)listener.LocalEndpoint).Port;
                var url = "http://127.0.0.1:" + port + "/index.html";

                var serverThread = new Thread(() => Serve(listener));
                serverThread.IsBackground = true;
                serverThread.Start();

                Console.WriteLine("MHB を起動しました。");
                Console.WriteLine(url);
                Console.WriteLine("このウィンドウを閉じるとゲームも終了します。終了する時は Enter を押してください。");
                Process.Start(url);
                Console.ReadLine();

                running = false;
                listener.Stop();
            }
            catch (Exception ex)
            {
                Console.WriteLine("起動に失敗しました。");
                Console.WriteLine(ex.Message);
                Console.WriteLine("Enter を押して終了します。");
                Console.ReadLine();
            }
        }

        private static string ExtractPayload()
        {
            var assembly = Assembly.GetExecutingAssembly();
            using (var stream = assembly.GetManifestResourceStream(PayloadResourceName))
            {
                if (stream == null)
                {
                    throw new InvalidOperationException("ゲームデータが exe に埋め込まれていません。");
                }

                var destination = Path.Combine(Path.GetTempPath(), AppName + "-exe");
                if (Directory.Exists(destination))
                {
                    Directory.Delete(destination, true);
                }
                Directory.CreateDirectory(destination);

                using (var archive = new ZipArchive(stream, ZipArchiveMode.Read))
                {
                    foreach (var entry in archive.Entries)
                    {
                        var targetPath = Path.GetFullPath(Path.Combine(destination, entry.FullName));
                        if (!targetPath.StartsWith(destination, StringComparison.OrdinalIgnoreCase))
                        {
                            continue;
                        }

                        if (String.IsNullOrEmpty(entry.Name))
                        {
                            Directory.CreateDirectory(targetPath);
                            continue;
                        }

                        var targetDirectory = Path.GetDirectoryName(targetPath);
                        if (!Directory.Exists(targetDirectory))
                        {
                            Directory.CreateDirectory(targetDirectory);
                        }
                        entry.ExtractToFile(targetPath, true);
                    }
                }

                return destination;
            }
        }

        private static void Serve(TcpListener listener)
        {
            while (running)
            {
                try
                {
                    var client = listener.AcceptTcpClient();
                    ThreadPool.QueueUserWorkItem(_ => HandleClient(client));
                }
                catch
                {
                    if (running)
                    {
                        Thread.Sleep(100);
                    }
                }
            }
        }

        private static void HandleClient(TcpClient client)
        {
            using (client)
            using (var stream = client.GetStream())
            using (var reader = new StreamReader(stream, Encoding.ASCII, false, 4096, true))
            {
                var requestLine = reader.ReadLine();
                if (String.IsNullOrEmpty(requestLine))
                {
                    return;
                }

                var parts = requestLine.Split(' ');
                var rawPath = parts.Length >= 2 ? parts[1] : "/";
                var queryIndex = rawPath.IndexOf('?');
                if (queryIndex >= 0)
                {
                    rawPath = rawPath.Substring(0, queryIndex);
                }

                var path = Uri.UnescapeDataString(rawPath).Replace('/', Path.DirectorySeparatorChar);
                if (path == Path.DirectorySeparatorChar.ToString())
                {
                    path = Path.DirectorySeparatorChar + "index.html";
                }

                var fullPath = Path.GetFullPath(Path.Combine(rootDirectory, path.TrimStart(Path.DirectorySeparatorChar)));
                if (!fullPath.StartsWith(rootDirectory, StringComparison.OrdinalIgnoreCase))
                {
                    WriteResponse(stream, "403 Forbidden", "text/plain; charset=utf-8", Encoding.UTF8.GetBytes("Forbidden"));
                    return;
                }

                if (!File.Exists(fullPath))
                {
                    WriteResponse(stream, "404 Not Found", "text/plain; charset=utf-8", Encoding.UTF8.GetBytes("Not Found"));
                    return;
                }

                var bytes = File.ReadAllBytes(fullPath);
                WriteResponse(stream, "200 OK", MimeType(fullPath), bytes);
            }
        }

        private static void WriteResponse(Stream stream, string status, string contentType, byte[] body)
        {
            var header =
                "HTTP/1.1 " + status + "\r\n" +
                "Content-Type: " + contentType + "\r\n" +
                "Content-Length: " + body.Length + "\r\n" +
                "Cache-Control: no-store\r\n" +
                "Connection: close\r\n\r\n";
            var headerBytes = Encoding.ASCII.GetBytes(header);
            stream.Write(headerBytes, 0, headerBytes.Length);
            stream.Write(body, 0, body.Length);
        }

        private static string MimeType(string path)
        {
            switch (Path.GetExtension(path).ToLowerInvariant())
            {
                case ".html": return "text/html; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".js": return "application/javascript; charset=utf-8";
                case ".csv": return "text/csv; charset=utf-8";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".gif": return "image/gif";
                case ".svg": return "image/svg+xml";
                default: return "application/octet-stream";
            }
        }
    }
}
