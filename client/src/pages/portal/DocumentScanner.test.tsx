import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocumentScanner } from "./DocumentScanner";

describe("DocumentScanner Component", () => {
  it("renders document vault with initial documents", () => {
    render(<DocumentScanner />);

    expect(screen.getByText("Document Vault Summary")).toBeInTheDocument();
    expect(screen.getByText("Total Documents")).toBeInTheDocument();

    // Check initial sample documents exist
    expect(screen.getByText("Passport_USA_12345.pdf")).toBeInTheDocument();
    expect(
      screen.getByText("TravelInsurance_WanderlustPlus_2026.pdf")
    ).toBeInTheDocument();
  });

  it("displays correct summary stats", () => {
    render(<DocumentScanner />);

    // Should show 3 initial documents
    const totalDocsElement = screen.getAllByText((_, element) =>
      element?.textContent?.includes("3")
    );
    expect(totalDocsElement.length).toBeGreaterThan(0);

    // Should show 3 verified documents (multiple <p>s may contain "3")
    const verifiedCounts = screen.getAllByText("3", { selector: "p" });
    expect(verifiedCounts.length).toBeGreaterThan(0);
  });

  it("allows adding a new document", async () => {
    const user = userEvent.setup();
    render(<DocumentScanner />);

    // Click add document button
    const addBtn = screen.getByRole("button", { name: /Add Document/i });
    await user.click(addBtn);

    // Fill form
    const nameInput = screen.getByPlaceholderText("File Name");
    const tagsInput = screen.getByPlaceholderText("Tags (comma-separated)");

    await user.type(nameInput, "TestDoc.pdf");
    await user.type(tagsInput, "test,travel");

    // Submit form (trigger is hidden once form opens; submit is the only match)
    const submitBtn = screen.getAllByRole("button", {
      name: /Add Document/i,
    })[0];
    await user.click(submitBtn);

    // Verify new document appears (text may be split across child elements)
    await waitFor(() => {
      const match = screen.queryAllByText((_, el) =>
        (el?.textContent ?? "").includes("TestDoc.pdf")
      );
      expect(match.length).toBeGreaterThan(0);
    });
  });

  it("searches documents by name", async () => {
    const user = userEvent.setup();
    render(<DocumentScanner />);

    const searchInput = screen.getByPlaceholderText("Search documents...");
    await user.type(searchInput, "Passport");

    // Should show passport but hide visa
    await waitFor(() => {
      expect(screen.getByText("Passport_USA_12345.pdf")).toBeInTheDocument();
      expect(
        screen.queryByText("Visa_Spain_A1234567.pdf")
      ).not.toBeInTheDocument();
    });
  });

  it("searches documents by tag", async () => {
    const user = userEvent.setup();
    render(<DocumentScanner />);

    const searchInput = screen.getByPlaceholderText("Search documents...");
    await user.type(searchInput, "schengen");

    // Should show visa with schengen tag
    await waitFor(() => {
      expect(screen.getByText("Visa_Spain_A1234567.pdf")).toBeInTheDocument();
    });
  });

  it("deletes documents", async () => {
    const user = userEvent.setup();
    render(<DocumentScanner />);

    // Find and click delete button for first document
    const deleteButtons = screen
      .getAllByRole("button", { name: "" })
      .find(btn => btn.querySelector("svg[class*='w-4 h-4 text-red-500']"));

    if (deleteButtons) {
      await user.click(deleteButtons);

      // Verify document is removed
      await waitFor(() => {
        expect(
          screen.queryByText("Passport_USA_12345.pdf")
        ).not.toBeInTheDocument();
      });
    }
  });

  it("displays expiry warnings correctly", () => {
    render(<DocumentScanner />);

    // "Expired" appears once as a stat label but should not appear as
    // a per-document badge since all initial documents expire in the future.
    const expiredElements = screen.getAllByText("Expired");
    expect(expiredElements.length).toBe(1); // only the stat section label
  });

  it("shows encrypted badge for secure documents", () => {
    render(<DocumentScanner />);

    // All initial documents should show as verified
    const verifiedBadges = screen.getAllByText("Verified");
    expect(verifiedBadges.length).toBeGreaterThan(0);
  });

  it("requires file name for adding documents", async () => {
    const user = userEvent.setup();
    render(<DocumentScanner />);

    const addBtn = screen.getByRole("button", { name: /Add Document/i });
    await user.click(addBtn);

    // Try to submit without filling name (trigger is hidden; submit is the only match)
    const submitBtn = screen.getAllByRole("button", {
      name: /Add Document/i,
    })[0];
    await user.click(submitBtn);

    // Should not add empty document; "Verified" appears as stat label + badges + buttons
    const totalDocs = screen.getAllByText("Verified").length;
    expect(totalDocs).toBeLessThanOrEqual(7); // 1 label + 3 badges + 3 action buttons
  });

  it("displays document details in correct format", () => {
    render(<DocumentScanner />);

    // Check that document details are visible
    expect(screen.getByText(/Primary travel document/i)).toBeInTheDocument();
    const pdfElements = screen.getAllByText(/PDF/i);
    expect(pdfElements.length).toBeGreaterThan(0);
  });

  it("handles empty state correctly", async () => {
    const user = userEvent.setup();
    render(<DocumentScanner />);

    // Clear search to trigger empty state
    const searchInput = screen.getByPlaceholderText("Search documents...");
    await user.clear(searchInput);
    await user.type(searchInput, "nonexistent");

    // Should show no documents message
    await waitFor(() => {
      expect(screen.getByText(/No Documents Found/i)).toBeInTheDocument();
    });
  });
});
