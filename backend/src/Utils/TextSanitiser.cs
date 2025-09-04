using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace PeepoBackend.Utils;

public static partial class TextSanitiser
{
    // Precompiled regexes
    private static readonly Regex HtmlTagRx = GetHtmlTagRx();
    private static readonly Regex MultiWsRx = GetMultiWsRx();
    private static readonly Regex UrlRx = GetUrlRx();
    private static readonly Regex HeaderLineRx = GetHeaderLineRx();
    private static readonly Regex ZeroWidthRx = GetZeroWidthRx();

    /// <summary>
    /// Returns strictly plain-text content:
    /// - Decodes HTML entities, strips tags/attributes
    /// - Removes control chars (except \n and \t), zero-width chars
    /// - Drops header-injection style lines, defangs URLs
    /// - Collapses whitespace, trims, and caps length/lines
    /// </summary>
    public static string Sanitise(string? input, int maxChars = 4000, int maxLines = 200) 
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        // 1) Normalize & decode HTML entities first
        var s = WebUtility.HtmlDecode(input).Normalize(NormalizationForm.FormKC);

        // 2) Strip HTML/XML tags like <script>, <a href=...>, etc.
        s = HtmlTagRx.Replace(s, string.Empty);

        // 3) Remove zero-width/invisible trickery
        s = ZeroWidthRx.Replace(s, string.Empty);

        // 4) Remove all control chars except newline and tab
        var sb = new StringBuilder(s.Length);
        foreach (var ch in s)
        {
            if (ch == '\n' || ch == '\t')
            {
                sb.Append(ch);
                continue;
            }
            if (!char.IsControl(ch))
                sb.Append(ch);
        }
        s = sb.ToString();

        // 5) Split to lines to apply line-oriented rules
        var lines = s.Replace("\r", "\n").Split('\n');

        var outSb = new StringBuilder(Math.Min(maxChars, s.Length));
        int lineCount = 0;

        foreach (var rawLine in lines)
        {
            if (lineCount >= maxLines)
                break;

            var line = rawLine;

            // Drop header-injection style lines (e.g., "Subject: ...")
            if (HeaderLineRx.IsMatch(line))
                continue;

            // Optionally remove URLs completely (set removeUrls=true for strictest)
            line = UrlRx.Replace(line, m => $"[link removed for security]");

            // Collapse excessive whitespace in line
            line = MultiWsRx.Replace(line.Trim(), " ");

            if (line.Length == 0)
                continue;

            // Enforce total char cap while keeping whole lines
            if (outSb.Length + line.Length + 1 > maxChars)
            {
                var remaining = Math.Max(0, maxChars - outSb.Length);
                if (remaining > 0)
                    outSb.Append(line.AsSpan(0, Math.Min(remaining, line.Length)));
                break;
            }

            if (outSb.Length > 0)
                outSb.Append('\n');

            outSb.Append(line);
            lineCount++;
        }

        return outSb.ToString().Trim();
    }

    [GeneratedRegex(@"<[^>]+>", RegexOptions.Compiled)]
    private static partial Regex GetHtmlTagRx();
    
    [GeneratedRegex(@"\s{2,}", RegexOptions.Compiled)]
    private static partial Regex GetMultiWsRx();

    [GeneratedRegex(@"\b(?:https?|ftp)://\S+\b", RegexOptions.IgnoreCase | RegexOptions.Compiled)]
    private static partial Regex GetUrlRx();

    [GeneratedRegex(@"^(from|to|cc|bcc|subject|content-type|mime-version|content-transfer-encoding)\s*:", RegexOptions.IgnoreCase | RegexOptions.Compiled, "en-GB")]
    private static partial Regex GetHeaderLineRx();

    [GeneratedRegex(@"[\u200B-\u200F\uFEFF]", RegexOptions.Compiled)]  // ZWSP/ZWJ/LRM/RLM/FEFF
    private static partial Regex GetZeroWidthRx();
}
