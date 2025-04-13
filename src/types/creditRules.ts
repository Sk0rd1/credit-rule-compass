
export type CreditRuleAction = "Відмова" | "Видача" | "Андеррайтинг";
export type ClientType = "Новий" | "Повторний" | "Всі";
export type RuleSource = "УБКІ" | "Вертекс" | "Скаріста";

export type ConditionOperator = ">" | "<" | "=" | ">=" | "<=" | "BETWEEN" | "IN" | "CONTAINS" | "NOT";
export type ConditionValueType = 
  | "NUMBER" 
  | "BOOLEAN" 
  | "TEXT" 
  | "TEXT_LIST" 
  | "DATE" 
  | "DATE_RANGE" 
  | "ENUM" 
  | "COMBINED";

export type LogicalOperator = "AND" | "OR";

export interface RuleCondition {
  condition: string;
  operator?: ConditionOperator;
  value: string;
  valueType: ConditionValueType;
  isDataMissing?: boolean;
}

export interface CreditRule {
  id: number;
  description: string;
  conditions: RuleCondition[];
  logicalOperator: LogicalOperator;
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
  valueType: ConditionValueType;
  possibleValues?: string[];
  format?: string;
}

export const ruleTemplates: RuleTemplate[] = [
  { 
    description: "Заборонені біни карт", 
    condition: "Біни карт", 
    valueType: "TEXT_LIST",
    format: "Comma separated values (516780xx, 414849xx)"
  },
  { 
    description: "Прострочений борг", 
    condition: "UBKI score", 
    valueType: "NUMBER",
    format: "Number with operator (>100000, <5000)"
  },
  { 
    description: "Раніше закриті кредити", 
    condition: "dbaCloseIsBad", 
    valueType: "BOOLEAN",
    possibleValues: ["true", "false"]
  },
  { 
    description: "Кількість МФО", 
    condition: "donorTypeDealCountCountMFO", 
    valueType: "NUMBER",
    format: "Number with operator (>200, =0)"
  },
  { 
    description: "Кредит від своєї компанії", 
    condition: "donorTypeDealCountCountOWN", 
    valueType: "NUMBER",
    format: "Number with operator (>1, =0)"
  },
  { 
    description: "КиївУКР, прострочка", 
    condition: "Область: UBKI score, UBKI debt", 
    valueType: "COMBINED",
    format: "Text, number range, number with operator (Київ, 170-180, >90000)"
  },
  { 
    description: "Високий скоринг", 
    condition: "UBKI score, UBKI debt", 
    valueType: "COMBINED",
    format: "Numbers with operators (>200, >90000)"
  },
  { 
    description: "Анкета з простроченням", 
    condition: "high debt", 
    valueType: "NUMBER",
    format: "Number with operator (<20000)"
  },
  { 
    description: "Військова анкета", 
    condition: "Військова анкета галузь", 
    valueType: "TEXT",
    format: "Text value"
  },
  { 
    description: "МФО скор", 
    condition: "UBKI score", 
    valueType: "NUMBER",
    format: "Number with operator"
  },
  { 
    description: "Термін кредиту", 
    condition: "Дата видачі", 
    valueType: "DATE_RANGE",
    format: "Date range (01.01.2023 - 31.12.2023)"
  },
  { 
    description: "Статус клієнта", 
    condition: "status", 
    valueType: "ENUM",
    possibleValues: ["active", "blocked", "new"]
  },
];

export const getConditionTemplate = (condition: string): RuleTemplate | undefined => {
  return ruleTemplates.find(template => template.condition === condition);
};

// Helper function to create an empty condition
export const createEmptyCondition = (): RuleCondition => ({
  condition: "",
  value: "",
  valueType: "TEXT",
  isDataMissing: false
});
