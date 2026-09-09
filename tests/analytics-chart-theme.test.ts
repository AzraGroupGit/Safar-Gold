import { describe, expect, it } from "vitest";
import { formatChartDateLabel, formatCompactNumber, percentChange } from "../src/lib/analytics-chart-theme";

describe("analytics chart formatters", () => {
  it("formats daily and monthly bucket labels for Indonesian readers", () => {
    expect(formatChartDateLabel("2026-09-07")).toBe("7 Sep");
    expect(formatChartDateLabel("2026-09")).toBe("Sep 2026");
    expect(formatChartDateLabel("Label lain")).toBe("Label lain");
  });

  it("uses compact Indonesian units without hiding the full scale", () => {
    expect(formatCompactNumber(850_000)).toContain("rb");
    expect(formatCompactNumber(1_200_000)).toContain("jt");
    expect(formatCompactNumber(1_400_000_000)).toContain("M");
  });

  it("calculates period change safely", () => {
    expect(percentChange(120, 100)).toBe(20);
    expect(percentChange(0, 0)).toBe(0);
    expect(percentChange(10, 0)).toBeNull();
  });
});
