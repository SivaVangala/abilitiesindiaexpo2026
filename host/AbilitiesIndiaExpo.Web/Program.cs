// Abilities India Expo — static host. Serves the generated site (dist/) with compression, caching,
// security headers, the 404 page and 301 redirects from the old WordPress URLs.
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddResponseCompression(o => { o.EnableForHttps = true; o.Providers.Add<BrotliCompressionProvider>(); o.Providers.Add<GzipCompressionProvider>(); });

var app = builder.Build();
var root = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, app.Configuration["Site:Root"] ?? "../../dist"));
if (!Directory.Exists(root)) throw new DirectoryNotFoundException($"Site build not found at {root}. Run `npm run build` in the repository root first.");
var files = new PhysicalFileProvider(root);

// Tickets99 checkout may be framed only when embed mode is configured (and Tickets99 allows this domain in frame-ancestors).
var t99 = app.Configuration["Site:Tickets99FrameOrigin"];
// VERSION B demo: Google website translator (loaded only after a visitor picks a language) needs its hosts allowed.
const string gt = "https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com https://www.google.com";
var csp = $"default-src 'self'; img-src 'self' data: {gt}; style-src 'self' 'unsafe-inline' {gt}; font-src 'self' {gt}; " +
          $"script-src 'self' 'unsafe-inline' 'unsafe-eval' {gt}; connect-src 'self' {gt}; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none'; " +
          (string.IsNullOrWhiteSpace(t99) ? $"frame-src {gt}" : $"frame-src {t99} {gt}");

if (!app.Environment.IsDevelopment()) { app.UseHsts(); app.UseHttpsRedirection(); }
app.UseResponseCompression();
app.Use(async (ctx, next) =>
{
    var h = ctx.Response.Headers;
    h["Content-Security-Policy"] = csp;
    h["X-Content-Type-Options"] = "nosniff";
    h["Referrer-Policy"] = "strict-origin-when-cross-origin";
    h["Permissions-Policy"] = "camera=(), microphone=(self), geolocation=()"; // microphone allowed for this site only (voice commands)
    await next();
});

// 301s from the old WordPress site (see docs/01-existing-site-audit.md §8)
var redirects = new (string Prefix, string Target)[]
{
    ("/palace_ground", "/venue/"),
    ("/registration", "/programs/"), ("/registration-checkout", "/programs/"), ("/thank-you", "/programs/"), ("/transactions", "/programs/"), ("/shop", "/programs/"), ("/cart", "/programs/"), ("/checkout", "/programs/"),
    ("/tickets", "/programs/"), ("/ticket", "/programs/"), ("/ticktify-", "/programs/"), ("/tickets-", "/programs/"), ("/my-account", "/programs/"),
    ("/job-seekers-registration", "/programs/job-seeker/"), ("/employer-registration", "/programs/employer/"),
    ("/achievement-award", "/programs/achievement-award/"), ("/assistive-technology-registration", "/programs/assistive-technology-award/"),
    ("/schedule-", "/expo/seminars/"), ("/speaker-style-3", "/expo/"), ("/blog", "/"),
    ("/apply-for-msme-stall-grant", "/msme-stall-grant/"), ("/about-us", "/about/"), ("/abilities-international-expo", "/international-expo/"),
    ("/elderly-services", "/expo/elderly-services/"), ("/media-coverage", "/media/"), ("/services", "/expo/services/"),
    ("/privacy-policy", "/privacy/"), ("/terms-and-conditions", "/terms/"), ("/refund-policy", "/refund/"),
    ("/seminars", "/expo/seminars/"), ("/workshops", "/expo/workshops/"),
    ("/assistive-technology-fest", "/expo/assistive-technology-fest/"), ("/accessible-tourism-fest", "/expo/accessible-tourism-fest/"),
    ("/medical-tourism-fest", "/expo/medical-tourism-fest/"), ("/shopping-fest", "/expo/shopping-fest/"), ("/cultural-fest", "/expo/cultural-fest/"),
    ("/short-film-fest", "/expo/short-film-fest/"), ("/job-fair", "/expo/job-fair/"), ("/business-meets", "/expo/business-meets/"),
    ("/matrimonial-meet", "/expo/matrimonial-meet/"), ("/awards", "/expo/awards/"),
};
app.Use(async (ctx, next) =>
{
    var path = ctx.Request.Path.Value ?? "/";
    if (!files.GetFileInfo(path.TrimEnd('/') + "/index.html").Exists && !files.GetFileInfo(path).Exists)
    {
        // Prefixes ending in "-" match any URL that starts with them; others must match a whole path segment
        // (so "/shop" never catches "/shopping-fest").
        var hit = redirects.FirstOrDefault(r => r.Prefix.EndsWith("-")
            ? path.StartsWith(r.Prefix, StringComparison.OrdinalIgnoreCase)
            : path.Equals(r.Prefix, StringComparison.OrdinalIgnoreCase) || path.StartsWith(r.Prefix + "/", StringComparison.OrdinalIgnoreCase));
        if (hit.Target is not null) { ctx.Response.StatusCode = 301; ctx.Response.Headers.Location = hit.Target; return; }
    }
    await next();
});

app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = files });
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = files,
    OnPrepareResponse = c =>
    {
        var p = c.File.Name;
        c.Context.Response.Headers.CacheControl = p.EndsWith(".html") || p.EndsWith(".xml") || p.EndsWith(".txt")
            ? "no-cache" : "public, max-age=604800";
    },
});

// Folder without trailing slash -> redirect; otherwise the generated 404 page
app.Run(async ctx =>
{
    var path = ctx.Request.Path.Value ?? "/";
    if (!path.EndsWith('/') && files.GetFileInfo(path + "/index.html").Exists) { ctx.Response.Redirect(path + "/", true); return; }
    ctx.Response.StatusCode = 404;
    ctx.Response.ContentType = "text/html; charset=utf-8";
    await ctx.Response.SendFileAsync(files.GetFileInfo("/404.html"));
});

app.Run();
