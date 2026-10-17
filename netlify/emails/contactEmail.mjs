// The notification mail for a contact form message, in the site's brutalist style.
// Email clients only support a small part of CSS: tables, inline styles, no web fonts
// or box-shadow, so the hard shadow is a thick right/bottom border.

const COLORS = {
  paper: "#F6F7F9",
  surface: "#FFFFFF",
  ink: "#0E1116",
  grey: "#4B5563",
  accent: "#DC2626",
};

const SANS = "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', Menlo, Consolas, 'Courier New', monospace";

export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDate = (date) =>
  new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(date);

const label = (text) =>
  `<div style="margin:0 0 6px;font-family:${MONO};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.grey};">${text}</div>`;

export function buildContactEmail({ name, email, message, sentAt = new Date() }) {
  const subject = `Nieuw bericht van ${name} via getdeveloper.nl`;
  const date = formatDate(sentAt);
  const replyHref = `mailto:${email}?subject=${encodeURIComponent("Re: je bericht via getdeveloper.nl")}`;
  // Shown as the inbox preview line; hidden in the mail itself.
  const preheader = message.replace(/\s+/g, " ").slice(0, 110);

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.paper};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr>
          <td style="padding:0 0 24px;font-family:${SANS};font-size:24px;font-weight:700;color:${COLORS.ink};">
            <span style="color:${COLORS.grey};font-weight:500;">get</span><span style="color:${COLORS.accent};">&lt;</span>developer<span style="color:${COLORS.accent};">/&gt;</span>
          </td>
        </tr>
        <tr>
          <td style="background:${COLORS.surface};border:2px solid ${COLORS.ink};border-right-width:8px;border-bottom-width:8px;padding:28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:${COLORS.ink};border-right:4px solid ${COLORS.accent};border-bottom:4px solid ${COLORS.accent};padding:6px 10px;font-family:${MONO};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FFFFFF;">
                  Nieuw bericht
                </td>
              </tr>
            </table>

            <h1 style="margin:20px 0 4px;font-family:${SANS};font-size:30px;line-height:1.05;font-weight:700;text-transform:uppercase;letter-spacing:-0.5px;color:${COLORS.ink};">
              ${escapeHtml(name)}<span style="color:${COLORS.accent};">_</span>
            </h1>
            <p style="margin:0 0 24px;font-family:${MONO};font-size:12px;color:${COLORS.grey};">via het contactformulier op getdeveloper.nl</p>

            ${label("E-mail")}
            <p style="margin:0 0 20px;font-family:${SANS};font-size:16px;">
              <a href="mailto:${escapeHtml(email)}" style="color:${COLORS.accent};font-weight:700;text-decoration:underline;">${escapeHtml(email)}</a>
            </p>

            ${label("Bericht")}
            <div style="margin:0 0 28px;border-left:4px solid ${COLORS.accent};padding:2px 0 2px 14px;font-family:${SANS};font-size:16px;line-height:1.6;color:${COLORS.ink};white-space:pre-wrap;">${escapeHtml(message)}</div>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:${COLORS.accent};border:2px solid ${COLORS.ink};border-right-width:6px;border-bottom-width:6px;">
                  <a href="${escapeHtml(replyHref)}" style="display:inline-block;padding:12px 20px;font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#FFFFFF;text-decoration:none;">Beantwoord ${escapeHtml(name)} &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 4px 0;font-family:${MONO};font-size:11px;line-height:1.6;color:${COLORS.grey};">
            Ontvangen op ${escapeHtml(date)}<br>
            Antwoorden kan ook gewoon met &ldquo;Beantwoorden&rdquo; in je mailprogramma.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    `NIEUW BERICHT via getdeveloper.nl`,
    ``,
    `Naam:   ${name}`,
    `E-mail: ${email}`,
    ``,
    message,
    ``,
    `---`,
    `Ontvangen op ${date}. Beantwoorden gaat direct naar ${email}.`,
  ].join("\n");

  return { subject, html, text };
}
