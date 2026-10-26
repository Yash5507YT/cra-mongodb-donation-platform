import { roleDashboardPath } from "./Shell";

describe("roleDashboardPath", () => {
  test("routes each protected role to its appropriate workspace", () => {
    expect(roleDashboardPath("donor")).toBe("/dashboard");
    expect(roleDashboardPath("ngo")).toBe("/ngo");
    expect(roleDashboardPath("admin")).toBe("/admin");
  });
});
