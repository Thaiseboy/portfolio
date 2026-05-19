import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";

describe("SkeletonLoader", () => {
  it("renders multiple skeletons", () => {
    const { container } = render(<SkeletonLoader type="card" count={3} />);
    expect(container.querySelectorAll(".skeleton-card")).toHaveLength(3);
  });

  it("applies sizing", () => {
    const { container } = render(<SkeletonLoader type="box" width="200px" height="50px" />);
    const element = container.querySelector(".skeleton-box");
    expect(element).toHaveStyle({ width: "200px", height: "50px" });
  });
});
