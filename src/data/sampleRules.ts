
import { CreditRule, RuleCondition } from "@/types/creditRules";

export const sampleRules: CreditRule[] = [
  {
    id: 1,
    description: "Складне правило з двома умовами",
    conditions: [
      {
        condition: "UBKI score",
        operator: ">",
        value: "170",
        valueType: "NUMBER"
      },
      {
        condition: "donorTypeDealCountCountMFO",
        operator: "<",
        value: "3",
        valueType: "NUMBER"
      }
    ],
    logicalOperator: "AND",
    action: "Видача",
    priority: 1,
    isActive: true,
    clientType: "Новий",
    creditProduct: "Онлайн",
    startDate: "2023-01-01",
    endDate: null,
    source: "УБКІ",
  },
  {
    id: 2,
    description: "Прострочений борг",
    conditions: [
      {
        condition: "UBKI score",
        operator: ">",
        value: "100000",
        valueType: "NUMBER"
      }
    ],
    logicalOperator: "AND",
    action: "Відмова",
    priority: 2,
    isActive: true,
    clientType: "Всі",
    creditProduct: "Всі",
    startDate: "2023-01-01",
    endDate: null,
    source: "УБКІ",
  },
  {
    id: 3,
    description: "Раніше закриті кредити",
    conditions: [
      {
        condition: "dbaCloseIsBad",
        operator: "=",
        value: "true",
        valueType: "BOOLEAN"
      }
    ],
    logicalOperator: "AND",
    action: "Відмова",
    priority: 3,
    isActive: true,
    clientType: "Повторний",
    creditProduct: "Всі",
    startDate: "2023-01-01",
    endDate: null,
    source: "Вертекс",
  },
  {
    id: 4,
    description: "Кількість МФО",
    conditions: [
      {
        condition: "donorTypeDealCountCountMFO",
        operator: ">",
        value: "200",
        valueType: "NUMBER"
      }
    ],
    logicalOperator: "AND",
    action: "Видача",
    priority: 4,
    isActive: true,
    clientType: "Всі",
    creditProduct: "Всі",
    startDate: "2023-01-01",
    endDate: null,
    source: "Вертекс",
  },
  {
    id: 5,
    description: "Кредит від своєї компанії",
    conditions: [
      {
        condition: "donorTypeDealCountCountOWN",
        operator: ">",
        value: "1",
        valueType: "NUMBER"
      }
    ],
    logicalOperator: "AND",
    action: "Видача",
    priority: 5,
    isActive: false,
    clientType: "Повторний",
    creditProduct: "Повторний",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    source: "Вертекс",
  },
  {
    id: 6,
    description: "КиївУКР, 170-180, простр >90000",
    conditions: [
      {
        condition: "Область: UBKI score, UBKI debt",
        value: "Київ, 170-180, >90000",
        valueType: "COMBINED"
      }
    ],
    logicalOperator: "AND",
    action: "Видача",
    priority: 6,
    isActive: true,
    clientType: "Новий",
    creditProduct: "Онлайн",
    startDate: "2023-01-01",
    endDate: null,
    source: "УБКІ",
  },
  {
    id: 7,
    description: "200+",
    conditions: [
      {
        condition: "UBKI score, UBKI debt",
        value: ">200, >90000",
        valueType: "COMBINED"
      }
    ],
    logicalOperator: "AND",
    action: "Видача",
    priority: 7,
    isActive: true,
    clientType: "Всі",
    creditProduct: "Всі",
    startDate: "2023-03-01",
    endDate: null,
    source: "УБКІ",
  },
  {
    id: 8,
    description: "Анкета простр",
    conditions: [
      {
        condition: "high debt",
        operator: "<",
        value: "20000",
        valueType: "NUMBER"
      }
    ],
    logicalOperator: "AND",
    action: "Андеррайтинг",
    priority: 8,
    isActive: true,
    clientType: "Новий",
    creditProduct: "Онлайн",
    startDate: "2023-02-01",
    endDate: null,
    source: "Скаріста",
  },
  {
    id: 9,
    description: "Складне правило з двома умовами OR",
    conditions: [
      {
        condition: "UBKI score",
        operator: "<",
        value: "50",
        valueType: "NUMBER"
      },
      {
        condition: "high debt",
        operator: ">",
        value: "100000",
        valueType: "NUMBER"
      }
    ],
    logicalOperator: "OR",
    action: "Відмова",
    priority: 9,
    isActive: true,
    clientType: "Всі",
    creditProduct: "Всі",
    startDate: "2023-01-01",
    endDate: null,
    source: "УБКІ",
  },
  {
    id: 10,
    description: "МФО скор",
    conditions: [
      {
        condition: "UBKI score",
        operator: ">",
        value: "170",
        valueType: "NUMBER"
      }
    ],
    logicalOperator: "AND",
    action: "Відмова",
    priority: 10,
    isActive: true,
    clientType: "Повторний",
    creditProduct: "Повторний",
    startDate: "2023-01-01",
    endDate: null,
    source: "УБКІ",
  }
];
