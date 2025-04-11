
export type CreditRuleAction = "Відмова" | "Видача" | "Андеррайтинг";
export type ClientType = "Новий" | "Повторний" | "Всі";
export type RuleSource = "УБКІ" | "Вертекс" | "Скаріста";

export interface CreditRule {
  id: number;
  description: string;
  condition: string;
  conditionValue: string;
  action: CreditRuleAction;
  priority: number;
  isActive: boolean;
  clientType: ClientType;
  creditProduct: string;
  startDate: string;
  endDate: string | null;
  source: RuleSource;
}

export interface RuleTemplate {
  description: string;
  condition: string;
}

export const ruleTemplates: RuleTemplate[] = [
  { description: "Заборонені біни карт", condition: "Біни карт" },
  { description: "Прострочений борг", condition: "UBKI score" },
  { description: "Раніше закриті кредити", condition: "dbaCloseIsBad" },
  { description: "Кількість МФО", condition: "donorTypeDealCountCountMFO" },
  { description: "Кредит від своєї компанії", condition: "donorTypeDealCountCountOWN" },
  { description: "КиївУКР, прострочка", condition: "Область: UBKI score, UBKI debt" },
  { description: "Високий скоринг", condition: "UBKI score, UBKI debt" },
  { description: "Анкета з простроченням", condition: "high debt" },
  { description: "Військова анкета", condition: "Військова анкета галузь" },
  { description: "МФО скор", condition: "UBKI score" },
];
