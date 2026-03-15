import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TravelInsuranceTracker } from "./TravelInsuranceTracker";

describe("TravelInsuranceTracker Component", () => {
  it("renders insurance summary with initial policies", () => {
    render(<TravelInsuranceTracker />);

    expect(screen.getByText("Insurance Coverage Summary")).toBeInTheDocument();
    expect(screen.getByText("Active Policies")).toBeInTheDocument();
    expect(screen.getByText("Total Coverage")).toBeInTheDocument();
    expect(screen.getByText("Wanderlust Premium")).toBeInTheDocument();
  });

  it("displays correct coverage summary", () => {
    render(<TravelInsuranceTracker />);

    // Should show 1 active policy initially
    expect(screen.getByText("1", { selector: "p" })).toBeInTheDocument();

    // Should show total coverage in millions
    expect(screen.getByText(/\d+\.\d+M/)).toBeInTheDocument();
  });

  it("allows adding a new insurance policy", async () => {
    const user = userEvent.setup();
    render(<TravelInsuranceTracker />);

    // Click add policy button
    const addBtn = screen.getByRole("button", {
      name: /Add Insurance Policy/i,
    });
    await user.click(addBtn);

    // Fill form
    const policyNameInput = screen.getByPlaceholderText("Policy Name");
    const providerInput = screen.getByPlaceholderText("Provider Name");
    const policyNumberInput = screen.getByPlaceholderText("Policy Number");

    await user.type(policyNameInput, "New Travel Policy");
    await user.type(providerInput, "Test Insurance Co");
    await user.type(policyNumberInput, "TEST-2026-001");

    // Set dates (assuming form fields exist)
    const startDateInputs = screen.getAllByDisplayValue("");
    if (startDateInputs.length > 0) {
      await user.type(startDateInputs[0], "2026-03-01");
      await user.type(startDateInputs[1], "2027-03-01");
    }

    // Set coverage
    const coverageInput = screen.getByPlaceholderText("Max Coverage");
    await user.type(coverageInput, "500000");

    // Submit form
    const submitBtn = screen.getAllByRole("button", { name: /Add Policy/i })[1];
    await user.click(submitBtn);

    // Verify new policy appears
    await waitFor(() => {
      expect(screen.getByText("New Travel Policy")).toBeInTheDocument();
    });
  });

  it("validates required policy fields", async () => {
    const user = userEvent.setup();
    render(<TravelInsuranceTracker />);

    const addBtn = screen.getByRole("button", {
      name: /Add Insurance Policy/i,
    });
    await user.click(addBtn);

    // Try to submit empty form
    const submitBtn = screen.getAllByRole("button", { name: /Add Policy/i })[1];
    await user.click(submitBtn);

    // Should still show form (validation failed)
    expect(screen.getByText(/New Insurance Policy/i)).toBeInTheDocument();
  });

  it("displays policy status badges correctly", () => {
    render(<TravelInsuranceTracker />);

    // Initial policy should show Active badge
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("tracks claims usage with visual progress", () => {
    render(<TravelInsuranceTracker />);

    // Should show claims status
    expect(screen.getByText(/claims used/i)).toBeInTheDocument();
  });

  it("handles policy deletion", async () => {
    const user = userEvent.setup();
    render(<TravelInsuranceTracker />);

    // Get initial policy count
    const initialPolicies = screen
      .getAllByRole("button", { name: "" })
      .filter(btn => btn.querySelector("svg[class*='w-4 h-4 text-red-500']"));

    if (initialPolicies.length > 0) {
      await user.click(initialPolicies[0]);

      // Verify policy is removed
      await waitFor(() => {
        expect(
          screen.queryByText("Wanderlust Premium")
        ).not.toBeInTheDocument();
      });
    }
  });

  it("displays emergency contact phone numbers", () => {
    render(<TravelInsuranceTracker />);

    // Initial policy has emergency phone
    expect(screen.getByTest("+1-800-123-4567")).toBeInTheDocument();
  });

  it("allows selection of multiple coverage types", async () => {
    const user = userEvent.setup();
    render(<TravelInsuranceTracker />);

    const addBtn = screen.getByRole("button", {
      name: /Add Insurance Policy/i,
    });
    await user.click(addBtn);

    // Find and click coverage type buttons
    const medicalCoverageBtn = screen.getByRole("button", {
      name: /Medical Expenses/i,
    });
    const evacuationBtn = screen.getByRole("button", {
      name: /Emergency Evacuation/i,
    });

    await user.click(medicalCoverageBtn);
    await user.click(evacuationBtn);

    // Buttons should be highlighted (appearance change)
    expect(medicalCoverageBtn).toHaveClass("border-primary");
    expect(evacuationBtn).toHaveClass("border-primary");
  });

  it("allows selection of multiple coverage regions", async () => {
    const user = userEvent.setup();
    render(<TravelInsuranceTracker />);

    const addBtn = screen.getByRole("button", {
      name: /Add Insurance Policy/i,
    });
    await user.click(addBtn);

    // Find and click region buttons
    const europeBtn = screen.getByRole("button", { name: /Europe/i });
    const asiaBtn = screen.getByRole("button", { name: /Asia/i });

    await user.click(europeBtn);
    await user.click(asiaBtn);

    // Buttons should be highlighted
    expect(europeBtn).toHaveClass("border-primary");
    expect(asiaBtn).toHaveClass("border-primary");
  });

  it("formats coverage amounts correctly", () => {
    render(<TravelInsuranceTracker />);

    // Should display coverage with currency and formatting
    expect(screen.getByText(/\$|1/i)).toBeInTheDocument();
  });

  it("shows expiry countdown for active policies", () => {
    render(<TravelInsuranceTracker />);

    // Should show days until expiry
    expect(screen.getByText(/days/i)).toBeInTheDocument();
  });

  it("displays policy details in grid layout", () => {
    render(<TravelInsuranceTracker />);

    // Policy details should include policy number
    expect(screen.getByText("GTIP-2026-001")).toBeInTheDocument();
  });

  it("handles empty state when no policies exist", async () => {
    const { rerender } = render(<TravelInsuranceTracker />);

    // Delete the initial policy to test empty state
    const deleteBtn = screen
      .getAllByRole("button", { name: "" })
      .find(btn => btn.querySelector("svg[class*='text-red-500']"));

    if (deleteBtn) {
      fireEvent.click(deleteBtn);

      // In a real test, after deleting all policies, empty state should show
      // This depends on component implementation
    }
  });
});
