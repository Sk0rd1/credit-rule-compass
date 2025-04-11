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
