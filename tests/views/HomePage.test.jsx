import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/views/HomePage.jsx";

describe("HomePage", () => {
  it("renders the intro content", () => {
    render(<HomePage />);
    expect(screen.getByText(/Nice/i)).toBeInTheDocument();
    expect(screen.getByText(/Master Supakon Karanyawad/i)).toBeInTheDocument();
  });
});
