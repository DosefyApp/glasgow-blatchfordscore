import { describe, expect, it } from "vitest";
import { glasgowBlatchfordEngine } from "@/features/clinical-calculators/engines/engine";

describe("glasgowBlatchfordEngine", () => {
  it("retorna zero em cenário de muito baixo risco", () => {
    const parsed = glasgowBlatchfordEngine.parse({
      urea: 5,
      sex: "male",
      hemoglobin: 14,
      systolicBloodPressure: 120,
      heartRate: 80,
      melena: "no",
      syncope: "no",
      liverDisease: "no",
      heartFailure: "no",
    });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(glasgowBlatchfordEngine.compute(parsed.data).headline.value).toBe("0");
  });

  it("pontua 9 no cenário feminino com Hb 9.5, PAS 95 e melena", () => {
    const parsed = glasgowBlatchfordEngine.parse({
      urea: 5,
      sex: "female",
      hemoglobin: 9.5,
      systolicBloodPressure: 95,
      heartRate: 80,
      melena: "yes",
      syncope: "no",
      liverDisease: "no",
      heartFailure: "no",
    });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(glasgowBlatchfordEngine.compute(parsed.data).headline.value).toBe("9");
  });

  it("pontua alto em cenário com Hb 11 homem, ureia 12, FC 110 e síncope", () => {
    const parsed = glasgowBlatchfordEngine.parse({
      urea: 12,
      sex: "male",
      hemoglobin: 11,
      systolicBloodPressure: 120,
      heartRate: 110,
      melena: "no",
      syncope: "yes",
      liverDisease: "no",
      heartFailure: "no",
    });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(glasgowBlatchfordEngine.compute(parsed.data).headline.value).toBe("10");
  });
});
