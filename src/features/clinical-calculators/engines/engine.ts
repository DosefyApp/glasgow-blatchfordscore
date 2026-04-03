import { z } from "zod";
import { buildEngine } from "@/features/clinical-calculators/engines/helpers";
import { formatInteger } from "@/features/clinical-calculators/utils";

const yesNoSchema = z.string().refine((value) => value === "yes" || value === "no", {
  message: "Selecione uma opção.",
});

const sexSchema = z.string().refine((value) => value === "male" || value === "female", {
  message: "Selecione o sexo biológico para aplicar a tabela de hemoglobina.",
});

const schema = z.object({
  urea: z.coerce.number().min(0, "Informe ureia entre 0 e 40 mmol/L.").max(40, "Informe ureia entre 0 e 40 mmol/L."),
  sex: sexSchema,
  hemoglobin: z.coerce.number().min(1, "Informe hemoglobina entre 1 e 25 g/dL.").max(25, "Informe hemoglobina entre 1 e 25 g/dL."),
  systolicBloodPressure: z.coerce.number().int().min(30, "Informe PAS entre 30 e 300 mmHg.").max(300, "Informe PAS entre 30 e 300 mmHg."),
  heartRate: z.coerce.number().int().min(20, "Informe FC entre 20 e 250 bpm.").max(250, "Informe FC entre 20 e 250 bpm."),
  melena: yesNoSchema,
  syncope: yesNoSchema,
  liverDisease: yesNoSchema,
  heartFailure: yesNoSchema,
});

function getUreaPoints(urea: number) {
  if (urea >= 25) return 6;
  if (urea >= 10) return 4;
  if (urea >= 8) return 3;
  if (urea >= 6.5) return 2;
  return 0;
}

function getHemoglobinPoints(sex: string, hemoglobin: number) {
  if (sex === "male") {
    if (hemoglobin < 10) return 6;
    if (hemoglobin < 12) return 3;
    if (hemoglobin < 13) return 1;
    return 0;
  }

  if (hemoglobin < 10) return 6;
  if (hemoglobin < 12) return 1;
  return 0;
}

function getSystolicPoints(systolicBloodPressure: number) {
  if (systolicBloodPressure < 90) return 3;
  if (systolicBloodPressure < 100) return 2;
  if (systolicBloodPressure < 110) return 1;
  return 0;
}

export const glasgowBlatchfordEngine = buildEngine(schema, (values) => {
  const scoreBreakdown = [
    { label: "Ureia", points: getUreaPoints(values.urea) },
    { label: "Hemoglobina", points: getHemoglobinPoints(values.sex, values.hemoglobin) },
    { label: "Pressão sistólica", points: getSystolicPoints(values.systolicBloodPressure) },
    { label: "FC >= 100 bpm", points: values.heartRate >= 100 ? 1 : 0 },
    { label: "Melena", points: values.melena === "yes" ? 1 : 0 },
    { label: "Síncope", points: values.syncope === "yes" ? 2 : 0 },
    { label: "Doença hepática", points: values.liverDisease === "yes" ? 2 : 0 },
    { label: "Insuficiência cardíaca", points: values.heartFailure === "yes" ? 2 : 0 },
  ];

  const total = scoreBreakdown.reduce((acc, item) => acc + item.points, 0);
  const positiveComponents = scoreBreakdown.filter((item) => item.points > 0).map((item) => `${item.label}: +${item.points}`);

  const lowRisk = total <= 1;
  const highBurden = total >= 8;

  return {
    headline: {
      label: "Glasgow-Blatchford Score",
      value: formatInteger(total),
      status: lowRisk ? "Muito baixo risco" : highBurden ? "Risco elevado" : "Não é baixo risco",
      tone: lowRisk ? "success" : highBurden ? "danger" : "warning",
      description: "O escore varia de 0 a 23 e ajuda a estimar necessidade de intervenção e segurança de manejo ambulatorial.",
    },
    interpretation: {
      title: "Interpretação clínica",
      tone: lowRisk ? "success" : highBurden ? "danger" : "warning",
      description: lowRisk
        ? "GBS entre 0 e 1, compatível com muito baixo risco. Pode ser elegível para manejo ambulatorial se estiver clinicamente estável e com retaguarda adequada."
        : "GBS acima de 1 deixa de ser baixo risco e geralmente apoia investigação e manejo hospitalar conforme o contexto clínico.",
      bullets: [
        "Não prometer alta automática: sinais de choque, sangramento ativo, cirrose descompensada e comorbidades graves podem exigir internação independentemente do score.",
      ],
    },
    calculation: {
      title: "Como foi calculado",
      rows: scoreBreakdown.map((item) => ({
        label: item.label,
        value: `${item.points} ponto(s)`,
      })),
      bullets: [`Pontuação total = ${total} ponto(s).`],
    },
    extraPanels: [
      {
        title: "Componentes que mais contribuíram",
        tone: lowRisk ? "info" : highBurden ? "danger" : "warning",
        bullets: positiveComponents.length ? positiveComponents : ["Nenhum componente pontuou; score final igual a zero."],
      },
    ],
  };
});

export const calculatorEngine = glasgowBlatchfordEngine;
