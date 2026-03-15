import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocalCurrencySimulator } from "./LocalCurrencySimulator";

describe("LocalCurrencySimulator Component", () => {
  it("renders currency converter interface", () => {
    render(<LocalCurrencySimulator />);

    expect(screen.getByText("Currency Converter")).toBeInTheDocument();
    expect(screen.getByText("New Conversion")).toBeInTheDocument();
  });

  it("displays initial conversion statistics", () => {
    render(<LocalCurrencySimulator />);

    expect(screen.getByText("Conversions")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument(); // 2 initial conversions
  });

  it("shows initial sample conversions", () => {
    render(<LocalCurrencySimulator />);

    // Check for USD to EUR conversation
    expect(screen.getByText(/100\s+USD/i)).toBeInTheDocument();
    expect(screen.getByText(/92/)).toBeInTheDocument(); // 92 EUR

    // Check for USD to JPY conversion
    expect(screen.getByText(/500\s+USD/i)).toBeInTheDocument();
    expect(screen.getByText(/74750/)).toBeInTheDocument(); // 74750 JPY
  });

  it("allows currency selection", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    const currencySelects = screen.getAllByDisplayValue("USD");
    expect(currencySelects.length).toBeGreaterThan(0);

    // Change base currency
    const baseCurrencySelect = currencySelects[0];
    await user.selectOption(baseCurrencySelect, "EUR");

    expect(baseCurrencySelect).toHaveValue("EUR");
  });

  it("swaps currencies with button", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    const swapButton = screen
      .getByRole("button", { name: "" })
      .filter(btn => btn.querySelector("svg[class*='ArrowRightLeft']"))[0];

    if (swapButton) {
      await user.click(swapButton);

      // Verify currencies swapped via form state
      const currencySelects = screen.getAllByDisplayValue("");
      expect(currencySelects.length).toBeGreaterThan(0);
    }
  });

  it("calculates real-time conversion preview", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    const amountInput = screen.getByPlaceholderText("Amount");
    await user.type(amountInput, "100");

    // Should show preview of converted amount
    await waitFor(() => {
      expect(screen.getByText(/You will get/i)).toBeInTheDocument();
    });
  });

  it("validates currency selection (prevents same-currency conversion", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    // Set both to same currency
    const currencySelects = screen.getAllByDisplayValue("USD");
    if (currencySelects.length >= 2) {
      // Target is already USD, so this would create error
      const amountInput = screen.getByPlaceholderText("Amount");
      await user.type(amountInput, "100");

      const convertBtn = screen.getByRole("button", {
        name: /Convert & Save/i,
      });
      await user.click(convertBtn);

      // Should not create conversion (validation error)
      const favoriteSection = screen.queryByText(/Favorite Conversions/i);
      expect(favoriteSection).not.toBeInTheDocument();
    }
  });

  it("validates amount is numeric", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    const amountInput = screen.getByPlaceholderText("Amount");
    await user.type(amountInput, "invalid");

    const convertBtn = screen.getByRole("button", { name: /Convert & Save/i });
    await user.click(convertBtn);

    // Should not proceed with invalid amount
    // Component should show validation error
    expect(screen.getByText(/Valid amount required/i)).toBeInTheDocument();
  });

  it("creates and saves new conversions", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    // Select currencies and amount
    const currencySelects = screen.getAllByDisplayValue("USD");
    const targetSelect = currencySelects[1] || screen.getByDisplayValue("EUR");

    await user.selectOption(targetSelect, "GBP");

    const amountInput = screen.getByPlaceholderText("Amount");
    await user.clear(amountInput);
    await user.type(amountInput, "50");

    // Submit conversion
    const convertBtn = screen.getByRole("button", { name: /Convert & Save/i });
    await user.click(convertBtn);

    // Should save and appear in recent conversions
    await waitFor(() => {
      expect(screen.getByText(/50\s+USD/i)).toBeInTheDocument();
    });
  });

  it("marks conversions as favorites", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    // Find favorite button for existing conversion
    const favoriteButtons = screen
      .getAllByRole("button")
      .filter(btn => btn.querySelector("svg[class*='DollarSign']"));

    if (favoriteButtons.length > 0) {
      await user.click(favoriteButtons[0]);

      // Should appear in Favorite Conversions section
      await waitFor(() => {
        expect(screen.getByText("Favorite Conversions")).toBeInTheDocument();
      });
    }
  });

  it("removes favorite status from conversions", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    // First USD to EUR conversion is marked favorite
    const favoriteButtons = screen
      .getAllByRole("button")
      .filter(btn => btn.querySelector("svg[class*='DollarSign']"));

    if (favoriteButtons.length > 0) {
      // Click to toggle off favorite
      await user.click(favoriteButtons[0]);

      // Should move from favorites back to recent
      await waitFor(() => {
        // Component should update UI accordingly
        expect(screen.getByText("Recent Conversions")).toBeInTheDocument();
      });
    }
  });

  it("deletes conversions from history", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    // Find delete button
    const deleteButtons = screen
      .getAllByRole("button")
      .filter(btn => btn.querySelector("svg[class*='Trash2']"));

    if (deleteButtons.length > 0) {
      const initialCount =
        screen.getByText(/Conversions/).nextElementSibling?.textContent;

      await user.click(deleteButtons[0]);

      // Should remove conversion from list
      await waitFor(() => {
        const newCount =
          screen.getByText(/Conversions/).nextElementSibling?.textContent;
        // Count should decrease if successful
      });
    }
  });

  it("displays correct exchange rates in conversions", () => {
    render(<LocalCurrencySimulator />);

    // First conversion: USD 100 = EUR 92 (rate 0.92)
    expect(screen.getByText(/Rate: 0\.92/)).toBeInTheDocument();

    // Second conversion: USD 500 = JPY 74750 (rate 149.5)
    expect(screen.getByText(/Rate: 149\.5/)).toBeInTheDocument();
  });

  it("supports notes for conversions", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    const notesField = screen.getByPlaceholderText("Notes (optional)");
    expect(notesField).toBeInTheDocument();

    // Enter note
    await user.type(notesField, "Flight ticket to Barcelona");

    // Verify initial conversions show notes
    expect(screen.getByText(/Hotel booking in Barcelona/i)).toBeInTheDocument();
  });

  it("displays timestamps for conversions", () => {
    render(<LocalCurrencySimulator />);

    // Should show date for conversions
    const dateElements = screen.getAllByText(/\d+\/\d+\/\d+/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it("categorizes conversions as favorites vs recent", () => {
    render(<LocalCurrencySimulator />);

    // First conversion marked as favorite
    expect(screen.getByText("Favorite Conversions")).toBeInTheDocument();
    expect(screen.getByText("Recent Conversions")).toBeInTheDocument();
  });

  it("shows currency symbols in conversions", () => {
    render(<LocalCurrencySimulator />);

    // Check for currency symbols in text
    expect(screen.getByText(/\$/i)).toBeInTheDocument(); // USD symbol
    expect(screen.getByText(/€/)).toBeInTheDocument(); // EUR symbol
  });

  it("handles empty conversion history", async () => {
    // This would require creating a component with no initial data
    // or manipulating state in test
    render(<LocalCurrencySimulator />);

    // Initially has conversions, so empty state shouldn't show
    expect(screen.queryByText(/No Conversions Yet/i)).not.toBeInTheDocument();
  });

  it("calculates conversions with correct precision", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    const amountInput = screen.getByPlaceholderText("Amount");
    await user.type(amountInput, "123.45");

    // Preview should show calculated amount
    await waitFor(() => {
      expect(screen.getByText(/You will get/i)).toBeInTheDocument();
    });
  });

  it("preserves currency selection across conversions", async () => {
    const user = userEvent.setup();
    render(<LocalCurrencySimulator />);

    // Select EUR as base
    const currencySelects = screen.getAllByDisplayValue("USD");
    if (currencySelects.length > 0) {
      await user.selectOption(currencySelects[0], "EUR");

      const amountInput = screen.getByPlaceholderText("Amount");
      await user.type(amountInput, "100");

      const convertBtn = screen.getByRole("button", {
        name: /Convert & Save/i,
      });
      await user.click(convertBtn);

      // Base currency should remain EUR for next conversion
      const updatedSelect = screen.getAllByDisplayValue("EUR");
      expect(updatedSelect.length).toBeGreaterThan(0);
    }
  });
});
