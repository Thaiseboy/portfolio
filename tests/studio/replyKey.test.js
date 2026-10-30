import { beforeEach, describe, expect, it } from "vitest";
import {
  loadReplyKey,
  storeReplyKey,
} from "../../studio/components/inbox/replyKey.ts";

const STORAGE_KEY = "inbox-reply-key:message.1";

describe("reply key", () => {
  beforeEach(() => sessionStorage.clear());

  it("stores a new key at once, so a reload before sending keeps it", () => {
    const first = loadReplyKey(STORAGE_KEY, "concept");
    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY))).toEqual(first);
    expect(loadReplyKey(STORAGE_KEY, "concept")).toEqual(first);
  });

  it("makes a new key for a changed concept", () => {
    storeReplyKey(STORAGE_KEY, { content: "old", key: "k1" });
    const next = loadReplyKey(STORAGE_KEY, "new");
    expect(next.content).toBe("new");
    expect(next.key).not.toBe("k1");
  });
});
