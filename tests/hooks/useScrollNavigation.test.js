import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useScrollNavigation } from "@/hooks/useScrollNavigation";

const sectionIds = ["home", "about", "project"];
const OriginalObserver = global.IntersectionObserver;

describe("useScrollNavigation", () => {
  afterEach(() => {
    global.IntersectionObserver = OriginalObserver;
    document.body.innerHTML = "";
  });

  it("marks the section crossing the middle line as active, however tall it is", () => {
    let observer;
    global.IntersectionObserver = class {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        observer = this;
      }
      observe() {}
      disconnect() {}
    };
    sectionIds.forEach((id) => document.body.insertAdjacentHTML("beforeend", `<section id="${id}"></section>`));

    const { result } = renderHook(() => useScrollNavigation(sectionIds));

    // A ratio threshold never fires for very tall sections; the middle line does.
    expect(observer.options).toEqual({ rootMargin: "-45% 0px -54% 0px", threshold: 0 });

    act(() => observer.callback([{ isIntersecting: true, target: document.getElementById("project") }]));

    expect(result.current.currentIndex).toBe(2);
  });
});
