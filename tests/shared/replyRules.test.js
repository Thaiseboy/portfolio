// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  isMessageId,
  normalizeReaction,
  normalizeReplyBody,
  normalizeReplySubject,
  replyBodyToText,
  replyLinkHref,
} from "../../studio/shared/replyRules.js";

const span = (key, text, marks = []) => ({ _type: "span", _key: key, text, marks });
const block = (key, children, extra = {}) => ({ _type: "block", _key: key, style: "normal", markDefs: [], children, ...extra });

describe("reply rules", () => {
  it("keeps paragraphs, lists, bold, italic, underline and links", () => {
    const body = normalizeReplyBody([
      block("a", [span("a1", "Hello "), span("a2", "there", ["strong", "underline"])]),
      block("b", [span("b1", "React")], { listItem: "bullet", level: 1 }),
      block("c", [span("c1", "site", ["l1"])], { markDefs: [{ _type: "replyLink", _key: "l1", href: "https://getdeveloper.nl" }] }),
    ]);

    expect(body).toHaveLength(3);
    expect(body[0].children[1].marks).toEqual(["strong", "underline"]);
    expect(body[1].listItem).toBe("bullet");
    expect(body[2].markDefs[0].href).toBe("https://getdeveloper.nl");
  });

  it("drops headings, unknown marks, objects and unsafe links", () => {
    const body = normalizeReplyBody([
      block("a", [span("a1", "Title", ["code"])], { style: "h1" }),
      { _type: "image", _key: "img" },
      block("b", [span("b1", "click", ["bad"])], { markDefs: [{ _type: "replyLink", _key: "bad", href: "javascript:alert(1)" }] }),
    ]);

    expect(body).toHaveLength(2);
    expect(body[0].style).toBe("normal");
    expect(body[0].children[0].marks).toEqual([]);
    expect(body[1].markDefs).toEqual([]);
    expect(body[1].children[0].marks).toEqual([]);
  });

  it("refuses empty or non-Portable-Text bodies", () => {
    expect(normalizeReplyBody([block("a", [span("a1", "   ")])])).toBeNull();
    expect(normalizeReplyBody("hello")).toBeNull();
    expect(normalizeReplyBody([block("a", "not children")])).toBeNull();
  });

  it("turns the body into plain text with list markers and links", () => {
    const text = replyBodyToText(
      normalizeReplyBody([
        block("a", [span("a1", "Hi Jane,")]),
        block("b", [span("b1", "one")], { listItem: "number", level: 1 }),
        block("c", [span("c1", "two")], { listItem: "number", level: 1 }),
        block("d", [span("d1", "my site", ["l"])], { markDefs: [{ _type: "replyLink", _key: "l", href: "https://getdeveloper.nl" }] }),
      ]),
    );

    expect(text).toBe("Hi Jane,\n\n1. one\n2. two\n\nmy site (https://getdeveloper.nl)");
  });

  it("checks subjects, links, ids and reactions", () => {
    expect(normalizeReplySubject("  Re:\nyour message ")).toBe("Re: your message");
    expect(normalizeReplySubject("x".repeat(151))).toBeNull();
    expect(replyLinkHref("mailto:get@example.com")).toBe("mailto:get@example.com");
    expect(replyLinkHref("/studio")).toBeNull();
    expect(isMessageId("message.0b7f4f5c-1c2d-4e5f-8a9b-0c1d2e3f4a5b")).toBe(true);
    expect(isMessageId("drafts.message.0b7f4f5c-1c2d-4e5f-8a9b-0c1d2e3f4a5b")).toBe(false);
    expect(normalizeReaction("  Hi\r\nthere  ")).toBe("Hi\nthere");
    expect(normalizeReaction("x".repeat(3001))).toBeNull();
  });
});
