/**
 * Receipt OCR Service
 * Processes receipt images and extracts expense information
 */

export interface ReceiptImage {
  id: string;
  url: string;
  timestamp: number;
  tripId: string;
}

export interface ExtractedExpense {
  id: string;
  receiptId: string;
  vendor: string;
  category:
    | "food"
    | "transport"
    | "accommodation"
    | "activity"
    | "shopping"
    | "entertainment"
    | "other";
  amount: number;
  currency: string;
  date: number;
  items?: string[];
  paymentMethod?: "cash" | "credit" | "debit" | "other";
  confidence: number; // 0-1 confidence score
  rawText?: string;
  processedAt: number;
}

export interface ExpenseCategory {
  name: string;
  emoji: string;
  color: string;
  budget?: number;
}

interface OCRResult {
  vendor?: string;
  amount?: number;
  currency?: string;
  date?: number;
  items?: string[];
  confidence: number;
}

class ReceiptOCRService {
  private receipts: Map<string, ReceiptImage> = new Map();
  private expenses: Map<string, ExtractedExpense> = new Map();
  private processingQueue: ReceiptImage[] = [];
  private isProcessing = false;

  /**
   * Process receipt image and extract expense
   */
  async processReceipt(image: ReceiptImage): Promise<ExtractedExpense | null> {
    try {
      console.log(`[ReceiptOCR] Processing receipt: ${image.id}`);

      // Simulate OCR processing (in production: Google Vision, Microsoft Computer Vision, etc.)
      const ocrResult = await this.simulateOCR(image);

      if (!ocrResult || ocrResult.confidence < 0.3) {
        console.warn(
          `[ReceiptOCR] Low confidence reading: ${ocrResult?.confidence || 0}`
        );
        return null;
      }

      const expense: ExtractedExpense = {
        id: `expense-${Date.now()}`,
        receiptId: image.id,
        vendor: ocrResult.vendor || "Unknown",
        category: this.categorizeVendor(ocrResult.vendor || ""),
        amount: ocrResult.amount || 0,
        currency: ocrResult.currency || "USD",
        date: ocrResult.date || image.timestamp,
        items: ocrResult.items,
        paymentMethod: "credit",
        confidence: ocrResult.confidence,
        processedAt: Date.now(),
      };

      this.expenses.set(expense.id, expense);
      this.receipts.set(image.id, image);

      console.log(
        `[ReceiptOCR] Extracted: ${expense.vendor} $${expense.amount} (${Math.round(expense.confidence * 100)}% confidence)`
      );
      return expense;
    } catch (err) {
      console.error("[ReceiptOCR] Processing error:", err);
      return null;
    }
  }

  /**
   * Get all expenses for a trip
   */
  getExpensesByTrip(tripId: string): ExtractedExpense[] {
    return Array.from(this.expenses.values()).filter(e => {
      const receipt = this.receipts.get(e.receiptId);
      return receipt?.tripId === tripId;
    });
  }

  /**
   * Get expenses by category
   */
  getExpensesByCategory(tripId: string, category: string): ExtractedExpense[] {
    return this.getExpensesByTrip(tripId).filter(e => e.category === category);
  }

  /**
   * Calculate total spending by category
   */
  getTotalByCategory(tripId: string): Record<string, number> {
    const totals: Record<string, number> = {};
    this.getExpensesByTrip(tripId).forEach(expense => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }
      totals[expense.category] += expense.amount;
    });
    return totals;
  }

  /**
   * Calculate total trip spending
   */
  getTotalSpending(tripId: string): number {
    return this.getExpensesByTrip(tripId).reduce((sum, e) => sum + e.amount, 0);
  }

  /**
   * Get spending by date (for timeline)
   */
  getSpendingByDate(tripId: string): Record<string, number> {
    const byDate: Record<string, number> = {};
    this.getExpensesByTrip(tripId).forEach(expense => {
      const date = new Date(expense.date).toISOString().split("T")[0];
      if (!byDate[date]) {
        byDate[date] = 0;
      }
      byDate[date] += expense.amount;
    });
    return byDate;
  }

  /**
   * Get expense statistics
   */
  getStatistics(tripId: string): {
    totalSpent: number;
    avgExpense: number;
    highestExpense: ExtractedExpense | null;
    lowestExpense: ExtractedExpense | null;
    expenseCount: number;
  } {
    const expenses = this.getExpensesByTrip(tripId);
    if (expenses.length === 0) {
      return {
        totalSpent: 0,
        avgExpense: 0,
        highestExpense: null,
        lowestExpense: null,
        expenseCount: 0,
      };
    }

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const sorted = [...expenses].sort((a, b) => b.amount - a.amount);

    return {
      totalSpent,
      avgExpense: totalSpent / expenses.length,
      highestExpense: sorted[0],
      lowestExpense: sorted[sorted.length - 1],
      expenseCount: expenses.length,
    };
  }

  /**
   * Delete expense
   */
  deleteExpense(expenseId: string): boolean {
    return this.expenses.delete(expenseId);
  }

  /**
   * Update expense
   */
  updateExpense(
    expenseId: string,
    updates: Partial<ExtractedExpense>
  ): ExtractedExpense | null {
    const expense = this.expenses.get(expenseId);
    if (!expense) return null;

    const updated = {
      ...expense,
      ...updates,
      id: expense.id,
      receiptId: expense.receiptId,
    };
    this.expenses.set(expenseId, updated);
    return updated;
  }

  // Private methods

  /**
   * Simulate receipt OCR (mock implementation)
   * In production: Use Google Vision API, Azure Computer Vision, etc.
   */
  private async simulateOCR(image: ReceiptImage): Promise<OCRResult> {
    // Mock receipt data for demonstration
    const mockReceipts = [
      {
        vendor: "Orlando International Airport",
        amount: 45.5,
        currency: "USD",
        items: ["Parking", "2 hours"],
        confidence: 0.92,
      },
      {
        vendor: "The Cheesecake Factory",
        amount: 67.89,
        currency: "USD",
        items: ["Dinner for 2", "Cheesecake"],
        confidence: 0.88,
      },
      {
        vendor: "Uber",
        amount: 22.5,
        currency: "USD",
        items: ["Ride STL-Hotel"],
        confidence: 0.95,
      },
      {
        vendor: "Magic Kingdom",
        amount: 159.0,
        currency: "USD",
        items: ["Park ticket", "1 day"],
        confidence: 0.91,
      },
      {
        vendor: "CVS Pharmacy",
        amount: 18.75,
        currency: "USD",
        items: ["Sunscreen", "Snacks"],
        confidence: 0.87,
      },
    ];

    // Simulate processing delay
    await new Promise(resolve =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    // Return random mock receipt
    const receipt =
      mockReceipts[Math.floor(Math.random() * mockReceipts.length)];
    return {
      ...receipt,
      date: image.timestamp,
    };
  }

  /**
   * Categorize vendor based on name
   */
  private categorizeVendor(vendor: string): ExtractedExpense["category"] {
    const lower = vendor.toLowerCase();

    if (
      lower.includes("restaurant") ||
      lower.includes("cafe") ||
      lower.includes("pizza") ||
      lower.includes("burger") ||
      lower.includes("cheesecake")
    ) {
      return "food";
    }
    if (
      lower.includes("uber") ||
      lower.includes("taxi") ||
      lower.includes("lyft") ||
      lower.includes("parking") ||
      lower.includes("transit")
    ) {
      return "transport";
    }
    if (
      lower.includes("hotel") ||
      lower.includes("airbnb") ||
      lower.includes("resort") ||
      lower.includes("hilton")
    ) {
      return "accommodation";
    }
    if (
      lower.includes("disney") ||
      lower.includes("park") ||
      lower.includes("museum") ||
      lower.includes("theater") ||
      lower.includes("concert")
    ) {
      return "activity";
    }
    if (
      lower.includes("mall") ||
      lower.includes("store") ||
      lower.includes("shop") ||
      lower.includes("target") ||
      lower.includes("cvs")
    ) {
      return "shopping";
    }
    if (
      lower.includes("bar") ||
      lower.includes("club") ||
      lower.includes("nightclub")
    ) {
      return "entertainment";
    }

    return "other";
  }
}

// Singleton instance
let receiptOCRInstance: ReceiptOCRService | null = null;

export function getReceiptOCRService(): ReceiptOCRService {
  if (!receiptOCRInstance) {
    receiptOCRInstance = new ReceiptOCRService();
  }
  return receiptOCRInstance;
}
