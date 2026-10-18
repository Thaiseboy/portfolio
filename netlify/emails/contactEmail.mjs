// The mails of the contact form and the Studio inbox, in the site's brutalist style.
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

const quote = (text) =>
  `<div style="margin:0 0 28px;border-left:4px solid ${COLORS.accent};padding:2px 0 2px 14px;font-family:${SANS};font-size:16px;line-height:1.6;color:${COLORS.ink};white-space:pre-wrap;">${escapeHtml(text)}</div>`;

/** Red (primary) or white button with a hard shadow; `href` must already be safe. */
const button = (href, text, primary = true) => `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 12px 12px 0;">
              <tr>
                <td style="background:${primary ? COLORS.accent : COLORS.surface};border:2px solid ${COLORS.ink};border-right-width:6px;border-bottom-width:6px;">
                  <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 20px;font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${primary ? "#FFFFFF" : COLORS.ink};text-decoration:none;">${text}</a>
                </td>
              </tr>
            </table>`;

/** The shared frame: wordmark, white card with a tag and a heading, footer line. */
function layout({ lang, title, preheader, tag, heading, content, footer }) {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(title)}</title>
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
                  ${tag}
                </td>
              </tr>
            </table>

            <h1 style="margin:20px 0 4px;font-family:${SANS};font-size:30px;line-height:1.05;font-weight:700;text-transform:uppercase;letter-spacing:-0.5px;color:${COLORS.ink};">
              ${heading}<span style="color:${COLORS.accent};">_</span>
            </h1>
${content}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 4px 0;font-family:${MONO};font-size:11px;line-height:1.6;color:${COLORS.grey};">
            ${footer}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

const subline = (text) =>
  `            <p style="margin:0 0 24px;font-family:${MONO};font-size:12px;color:${COLORS.grey};">${text}</p>`;

const emailLine = (email) => `            ${label("E-mail")}
            <p style="margin:0 0 20px;font-family:${SANS};font-size:16px;">
              <a href="mailto:${escapeHtml(email)}" style="color:${COLORS.accent};font-weight:700;text-decoration:underline;">${escapeHtml(email)}</a>
            </p>`;

/** To Get: a new message through the contact form. `studioHref` once it is stored in the inbox. */
export function buildContactEmail({
  name,
  email,
  message,
  sentAt = new Date(),
  studioHref = null,
}) {
  const subject = `Nieuw bericht van ${name} via getdeveloper.nl`;
  const date = formatDate(sentAt);
  const replyHref = `mailto:${email}?subject=${encodeURIComponent("Re: je bericht via getdeveloper.nl")}`;

  const html = layout({
    lang: "nl",
    title: subject,
    // Shown as the inbox preview line; hidden in the mail itself.
    preheader: message.replace(/\s+/g, " ").slice(0, 110),
    tag: "Nieuw bericht",
    heading: escapeHtml(name),
    content: [
      subline("via het contactformulier op getdeveloper.nl"),
      emailLine(email),
      `            ${label("Bericht")}`,
      `            ${quote(message)}`,
      studioHref ? button(studioHref, "Antwoord in de Studio &rarr;") : "",
      button(replyHref, `Beantwoord ${escapeHtml(name)} &rarr;`, !studioHref),
    ].join("\n"),
    footer: `Ontvangen op ${escapeHtml(date)}<br>
            Antwoorden kan ook gewoon met &ldquo;Beantwoorden&rdquo; in je mailprogramma.`,
  });

  const text = [
    `NIEUW BERICHT via getdeveloper.nl`,
    ``,
    `Naam:   ${name}`,
    `E-mail: ${email}`,
    ``,
    message,
    ``,
    `---`,
    ...(studioHref ? [`Antwoord in de Studio: ${studioHref}`] : []),
    `Ontvangen op ${date}. Beantwoorden gaat direct naar ${email}.`,
  ].join("\n");

  return { subject, html, text };
}

/** To Get: a visitor reacted to a reply through the link in the mail. */
export function buildReactionEmail({
  name,
  email,
  message,
  sentAt = new Date(),
  studioHref,
}) {
  const subject = `Nieuwe reactie van ${name} via getdeveloper.nl`;
  const date = formatDate(sentAt);

  const html = layout({
    lang: "nl",
    title: subject,
    preheader: message.replace(/\s+/g, " ").slice(0, 110),
    tag: "Nieuwe reactie",
    heading: escapeHtml(name),
    content: [
      subline("reageerde op je antwoord, via de link in de mail"),
      emailLine(email),
      `            ${label("Reactie")}`,
      `            ${quote(message)}`,
      button(studioHref, "Bekijk in de Studio &rarr;"),
    ].join("\n"),
    footer: `Ontvangen op ${escapeHtml(date)}`,
  });

  const text = [
    `NIEUWE REACTIE via getdeveloper.nl`,
    ``,
    `Naam:   ${name}`,
    `E-mail: ${email}`,
    ``,
    message,
    ``,
    `---`,
    `Bekijk in de Studio: ${studioHref}`,
  ].join("\n");

  return { subject, html, text };
}

const MARK_TAGS = { strong: "strong", em: "em", underline: "u" };

function spanHtml(span, links) {
  let html = escapeHtml(span.text).replace(/\n/g, "<br>");

  for (const mark of span.marks) {
    if (MARK_TAGS[mark]) {
      html = `<${MARK_TAGS[mark]}>${html}</${MARK_TAGS[mark]}>`;
    } else if (links.has(mark)) {
      html = `<a href="${escapeHtml(links.get(mark))}" style="color:${COLORS.accent};font-weight:700;text-decoration:underline;">${html}</a>`;
    }
  }

  return html;
}

const blockHtml = (block) => {
  const links = new Map(block.markDefs.map((mark) => [mark._key, mark.href]));
  return block.children.map((child) => spanHtml(child, links)).join("");
};

const textStyle = `font-family:${SANS};font-size:16px;line-height:1.6;color:${COLORS.ink};`;

/** Paragraphs, and consecutive list items as one list; deeper levels are indented. */
export function replyBodyHtml(blocks) {
  const parts = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];

    if (!block.listItem) {
      const html = blockHtml(block);
      parts.push(
        html.trim()
          ? `<p style="margin:0 0 14px;${textStyle}">${html}</p>`
          : "",
      );
      index += 1;
      continue;
    }

    const tag = block.listItem === "number" ? "ol" : "ul";
    const items = [];

    while (index < blocks.length && blocks[index].listItem === block.listItem) {
      const indent = ((blocks[index].level ?? 1) - 1) * 20;
      items.push(
        `<li style="margin:0 0 6px ${indent}px;${textStyle}">${blockHtml(blocks[index])}</li>`,
      );
      index += 1;
    }

    parts.push(
      `<${tag} style="margin:0 0 14px;padding-left:22px;${textStyle}">${items.join("")}</${tag}>`,
    );
  }

  return parts.join("\n");
}

/**
 * To the visitor: Get's reply from the Studio. Photos are inline attachments (`cid:`), shown under the
 * text; `reactionHref` is the personal link to react, or null when no secret is configured.
 */
export function buildReplyEmail({
  subject,
  body,
  plain,
  photos = [],
  reactionHref = null,
  original = null,
}) {
  const photosHtml = photos
    .map(
      (photo) =>
        `<img src="cid:${escapeHtml(photo.contentId)}" width="500" alt="" style="display:block;width:100%;max-width:500px;height:auto;border:2px solid ${COLORS.ink};margin:16px 0 0;">`,
    )
    .join("");

  const html = layout({
    lang: "en",
    title: subject,
    preheader: plain.replace(/\s+/g, " ").slice(0, 110),
    tag: "Reply from Get",
    heading: escapeHtml(subject),
    content: [
      subline("from getdeveloper.nl"),
      replyBodyHtml(body),
      photosHtml,
      reactionHref
        ? `<div style="margin:28px 0 0;">${button(reactionHref, "Reply to this message &rarr;")}</div>`
        : "",
      original
        ? `<div style="margin:12px 0 0;">${label("Your message")}${quote(original).replace("margin:0 0 28px", "margin:0")}</div>`
        : "",
    ].join("\n"),
    footer: `Get Karanyawad &middot; frontend developer &middot; <a href="https://getdeveloper.nl" style="color:${COLORS.accent};">getdeveloper.nl</a>`,
  });

  const text = [
    plain,
    ...(reactionHref ? ["", `Reply to this message: ${reactionHref}`] : []),
    ...(original ? ["", "--- Your message ---", original] : []),
    "",
    "--",
    "Get Karanyawad · frontend developer · getdeveloper.nl",
  ].join("\n");

  return { subject, html, text };
}
