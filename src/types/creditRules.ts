
export type CreditRuleAction = "Відмова" | "Видача" | "Андеррайтинг";
export type ClientType = "Новий" | "Повторний" | "Всі";
export type RuleSource = "УБКІ" | "Вертекс" | "Скаріста";

export type ConditionOperator = ">" | "<" | "=" | ">=" | "<=" | "BETWEEN" | "IN" | "CONTAINS" | "NOT" | "!=";
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
  ruleInfo?: string;
}

// Rule templates grouped by source
export const ruleTemplatesBySource: Record<RuleSource, RuleTemplate[]> = {
  "УБКІ": [
    { 
      description: "Прострочений борг", 
      condition: "UBKI score", 
      valueType: "NUMBER",
      format: "Number with operator (>100000, <5000)",
      ruleInfo: "Правило для перевірки простроченого боргу клієнта"
    },
    { 
      description: "КиївУКР, прострочка", 
      condition: "Область: UBKI score, UBKI debt", 
      valueType: "COMBINED",
      format: "Text, number range, number with operator (Київ, 170-180, >90000)",
      ruleInfo: "Складне правило для перевірки клієнтів з області Київ"
    },
    { 
      description: "Високий скоринг", 
      condition: "UBKI score, UBKI debt", 
      valueType: "COMBINED",
      format: "Numbers with operators (>200, >90000)",
      ruleInfo: "Правило для клієнтів з високим скорингом"
    },
    { 
      description: "МФО скор", 
      condition: "UBKI score", 
      valueType: "NUMBER",
      format: "Number with operator",
      ruleInfo: "Правило для перевірки скорингу МФО"
    }
  ],
  "Вертекс": [
    { 
      description: "Раніше закриті кредити", 
      condition: "dbaCloseIsBad", 
      valueType: "BOOLEAN",
      possibleValues: ["true", "false"],
      ruleInfo: "Правило для перевірки закритих кредитів"
    },
    { 
      description: "Кількість МФО", 
      condition: "donorTypeDealCountCountMFO", 
      valueType: "NUMBER",
      format: "Number with operator (>200, =0)",
      ruleInfo: "Правило для перевірки кількості МФО"
    },
    { 
      description: "Кредит від своєї компанії", 
      condition: "donorTypeDealCountCountOWN", 
      valueType: "NUMBER",
      format: "Number with operator (>1, =0)",
      ruleInfo: "Правило для перевірки кредитів від своєї компанії"
    },
  ],
  "Скаріста": [
    { 
      description: "Заборонені біни карт", 
      condition: "Біни карт", 
      valueType: "TEXT_LIST",
      format: "Comma separated values (516780xx, 414849xx)",
      ruleInfo: "Правило для перевірки заборонених бінів карт"
    },
    { 
      description: "Анкета з простроченням", 
      condition: "high debt", 
      valueType: "NUMBER",
      format: "Number with operator (<20000)",
      ruleInfo: "Правило для перевірки анкет з простроченням"
    },
    { 
      description: "Військова анкета", 
      condition: "Військова анкета галузь", 
      valueType: "TEXT",
      format: "Text value",
      ruleInfo: "Правило для перевірки військових анкет"
    },
    { 
      description: "Термін кредиту", 
      condition: "Дата видачі", 
      valueType: "DATE_RANGE",
      format: "Date range (01.01.2023 - 31.12.2023)",
      ruleInfo: "Правило для перевірки терміну кредиту"
    },
    { 
      description: "Статус клієнта", 
      condition: "status", 
      valueType: "ENUM",
      possibleValues: ["active", "blocked", "new"],
      ruleInfo: "Правило для перевірки статусу клієнта"
    },
  ]
};

// Flatten templates for backward compatibility
export const ruleTemplates: RuleTemplate[] = [
  ...ruleTemplatesBySource["УБКІ"],
  ...ruleTemplatesBySource["Вертекс"],
  ...ruleTemplatesBySource["Скаріста"]
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

export const getOperatorOptions = (valueType: ConditionValueType): ConditionOperator[] => {
  switch (valueType) {
    case "NUMBER":
      return [">", "<", "=", ">=", "<=", "!="];
    case "TEXT":
      return ["=", "CONTAINS", "NOT"];
    case "TEXT_LIST":
      return ["IN", "NOT"];
    case "BOOLEAN":
      return ["="];
    case "ENUM":
      return ["=", "!="];
    case "DATE":
      return ["=", ">", "<", ">=", "<="];
    case "DATE_RANGE":
      return ["BETWEEN"];
    default:
      return ["="];
  }
};

// Helper function to get a human-readable name for condition type
export const getValueTypeName = (valueType: ConditionValueType): string => {
  switch (valueType) {
    case "NUMBER":
      return "Число";
    case "BOOLEAN":
      return "Логічне";
    case "TEXT":
      return "Текст";
    case "TEXT_LIST":
      return "Список";
    case "DATE":
      return "Дата";
    case "DATE_RANGE":
      return "Діапазон дат";
    case "ENUM":
      return "Перелік";
    case "COMBINED":
      return "Комбіноване";
    default:
      return valueType;
  }
};
