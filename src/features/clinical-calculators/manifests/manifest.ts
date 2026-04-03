import type { CalculatorManifest } from "@/features/clinical-calculators/types";

const yesNoOptions = [
  { label: "Selecione...", value: "" },
  { label: "Sim", value: "yes" },
  { label: "Não", value: "no" },
];

export const glasgowBlatchfordManifest: CalculatorManifest = {
  slug: "glasgow-blatchford-score",
  title: "Glasgow-Blatchford Score",
  shortTitle: "Glasgow-Blatchford",
  description: "Risco pré-endoscopia em hemorragia digestiva alta.",
  seoTitle: "Glasgow-Blatchford Score | Dosefy",
  seoDescription: "Calcule o Glasgow-Blatchford Score com interpretação prática para hemorragia digestiva alta.",
  heroEyebrow: "Hemorragia digestiva alta",
  heroDescription:
    "Score pré-endoscopia para estimar risco, necessidade de intervenção e potencial elegibilidade para manejo ambulatorial em pacientes estáveis.",
  heroHighlights: [
    "Aplica a tabela completa de ureia, hemoglobina, pressão e marcadores clínicos.",
    "Destaca os componentes que mais puxaram a pontuação.",
    "Mantém linguagem segura: GBS baixo não significa alta automática.",
  ],
  resultMetricLabel: "GBS",
  actionLabel: "Calcular Glasgow-Blatchford",
  note: "Ferramenta de apoio à decisão. Não substitui julgamento clínico. Mesmo com score baixo, instabilidade, sangramento ativo ou comorbidades relevantes podem exigir internação.",
  limitations: [
    "Não substitui avaliação hemodinâmica, laboratório seriado ou endoscopia quando indicada.",
    "GBS 0 a 1 apoia muito baixo risco, mas não define alta automática.",
    "Cirrose, choque, uso de anticoagulantes e contexto clínico podem modificar a conduta independentemente do score.",
  ],
  references: [
    {
      label: "ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding",
      href: "https://pubmed.ncbi.nlm.nih.gov/33929377/",
    },
    {
      label: "Development and validation of a risk score to predict need for treatment for upper-GI bleeding",
      href: "https://pubmed.ncbi.nlm.nih.gov/14684409/",
    },
  ],
  sections: [
    {
      id: "labs",
      title: "Laboratório e hemodinâmica",
      description: "Preencha ureia, hemoglobina, sexo, pressão arterial e frequência cardíaca.",
    },
    {
      id: "history",
      title: "Achados clínicos adicionais",
      description: "Complete com marcadores clínicos e comorbidades incluídas no score.",
    },
  ],
  fields: [
    {
      name: "urea",
      label: "Ureia",
      type: "number",
      sectionId: "labs",
      inputMode: "decimal",
      placeholder: "Ex.: 7.8",
      min: 0,
      max: 40,
      suffix: "mmol/L",
    },
    {
      name: "sex",
      label: "Sexo biológico",
      type: "select",
      sectionId: "labs",
      options: [
        { label: "Selecione...", value: "" },
        { label: "Masculino", value: "male" },
        { label: "Feminino", value: "female" },
      ],
    },
    {
      name: "hemoglobin",
      label: "Hemoglobina",
      type: "number",
      sectionId: "labs",
      inputMode: "decimal",
      placeholder: "Ex.: 11.4",
      min: 1,
      max: 25,
      suffix: "g/dL",
    },
    {
      name: "systolicBloodPressure",
      label: "Pressão sistólica",
      type: "number",
      sectionId: "labs",
      inputMode: "numeric",
      placeholder: "Ex.: 102",
      min: 30,
      max: 300,
      suffix: "mmHg",
    },
    {
      name: "heartRate",
      label: "Frequência cardíaca",
      type: "number",
      sectionId: "labs",
      inputMode: "numeric",
      placeholder: "Ex.: 108",
      min: 20,
      max: 250,
      suffix: "bpm",
    },
    {
      name: "melena",
      label: "Melena",
      type: "select",
      sectionId: "history",
      options: yesNoOptions,
    },
    {
      name: "syncope",
      label: "Síncope",
      type: "select",
      sectionId: "history",
      options: yesNoOptions,
    },
    {
      name: "liverDisease",
      label: "Doença hepática",
      type: "select",
      sectionId: "history",
      options: yesNoOptions,
    },
    {
      name: "heartFailure",
      label: "Insuficiência cardíaca",
      type: "select",
      sectionId: "history",
      options: yesNoOptions,
    },
  ],
  initialValues: {
    urea: "",
    sex: "",
    hemoglobin: "",
    systolicBloodPressure: "",
    heartRate: "",
    melena: "",
    syncope: "",
    liverDisease: "",
    heartFailure: "",
  },
};

export const calculatorManifest = glasgowBlatchfordManifest;
