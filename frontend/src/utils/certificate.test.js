import { certificateDate, formatDonationDetail } from "./certificate";

describe("certificate presentation helpers", () => {
  test("formats a monetary donation with the campaign title", () => {
    expect(formatDonationDetail({ amount: 1500, type: "Money", campaignId: { title: "Classroom fund" } })).toContain("₹1,500");
    expect(formatDonationDetail({ amount: 1500, type: "Money", campaignId: { title: "Classroom fund" } })).toContain("Classroom fund");
  });

  test("formats a stable certificate date", () => {
    expect(certificateDate("2026-08-24T00:00:00.000Z")).toContain("2026");
  });
});

