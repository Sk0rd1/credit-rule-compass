
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreditRules } from "@/contexts/CreditRulesContext";
import { 
  CreditRule, 
  RuleSource, 
  ClientType, 
  CreditRuleAction, 
  ruleTemplates,
  ruleTemplatesBySource,
  getConditionTemplate,
  RuleCondition,
  ConditionValueType,
  createEmptyCondition,
  LogicalOperator,
  ConditionOperator,
  getOperatorOptions,
  getValueTypeName
} from "@/types/creditRules";
import { ActionBadge } from "./ActionBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RuleDialogProps {
  mode: "add" | "edit";
  initialData?: CreditRule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OperatorSelect = ({
  valueType,
  operator,
  onChange
}: {
  valueType: ConditionValueType,
  operator: ConditionOperator | undefined,
  onChange: (value: ConditionOperator) => void
}) => {
  const operators = getOperatorOptions(valueType);

  return (
    <Select
      value={operator || operators[0]}
      onValueChange={(value) => onChange(value as ConditionOperator)}
    >
      <SelectTrigger className="w-24">
        <SelectValue placeholder="Оператор" />
      </SelectTrigger>
      <SelectContent>
        {operators.map((op) => (
          <SelectItem key={op} value={op}>
            {op}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const ConditionValueInput = ({ 
  condition, 
  value, 
  onChange,
  onOperatorChange
}: { 
  condition: RuleCondition, 
  value: string, 
  onChange: (value: string) => void,
  onOperatorChange: (operator: ConditionOperator) => void
}) => {
  const template = getConditionTemplate(condition.condition);
  
  if (!template) {
    return (
      <div className="space-y-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Введіть значення умови"
        />
      </div>
    );
  }

  const renderInput = () => {
    switch (template.valueType) {
      case "BOOLEAN":
        return (
          <div className="flex gap-2 items-center">
            <OperatorSelect 
              valueType={template.valueType}
              operator={condition.operator}
              onChange={onOperatorChange}
            />
            <Select
              value={value}
              onValueChange={onChange}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Виберіть значення" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Так</SelectItem>
                <SelectItem value="false">Ні</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      
      case "DATE":
        return (
          <div className="flex gap-2 items-center">
            <OperatorSelect 
              valueType={template.valueType}
              operator={condition.operator}
              onChange={onOperatorChange}
            />
            <Input
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1"
            />
          </div>
        );
      
      case "DATE_RANGE":
        return (
          <div className="flex gap-2 items-center">
            <OperatorSelect 
              valueType={template.valueType}
              operator={condition.operator}
              onChange={onOperatorChange}
            />
            <div className="flex flex-1 gap-2 items-center">
              <Input
                type="date"
                value={value.split(" - ")[0] || ""}
                onChange={(e) => {
                  const endDate = value.split(" - ")[1] || "";
                  onChange(`${e.target.value}${endDate ? " - " + endDate : ""}`);
                }}
                className="flex-1"
              />
              <span>-</span>
              <Input
                type="date"
                value={value.split(" - ")[1] || ""}
                onChange={(e) => {
                  const startDate = value.split(" - ")[0] || "";
                  onChange(`${startDate}${startDate ? " - " : ""}${e.target.value}`);
                }}
                className="flex-1"
              />
            </div>
          </div>
        );
      
      case "ENUM":
        return (
          <div className="flex gap-2 items-center">
            <OperatorSelect 
              valueType={template.valueType}
              operator={condition.operator}
              onChange={onOperatorChange}
            />
            <Select
              value={value}
              onValueChange={onChange}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Виберіть значення" />
              </SelectTrigger>
              <SelectContent>
                {template.possibleValues?.map((val) => (
                  <SelectItem key={val} value={val}>{val}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case "TEXT_LIST":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <OperatorSelect 
                valueType={template.valueType}
                operator={condition.operator}
                onChange={onOperatorChange}
              />
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={template.format || "Введіть список значень, розділених комами"}
                className="flex-1"
              />
            </div>
          </div>
        );
      
      case "NUMBER":
        return (
          <div className="flex gap-2 items-center">
            <OperatorSelect 
              valueType={template.valueType}
              operator={condition.operator}
              onChange={onOperatorChange}
            />
            <Input
              type="number"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={template.format || "Введіть число"}
              className="flex-1"
            />
          </div>
        );
      
      case "COMBINED":
        return (
          <div className="flex flex-col gap-2">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={template.format || "Введіть комбіноване значення"}
            />
          </div>
        );
      
      default:
        return (
          <div className="flex gap-2 items-center">
            <OperatorSelect 
              valueType={template.valueType}
              operator={condition.operator}
              onChange={onOperatorChange}
            />
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={template.format || "Введіть значення"}
              className="flex-1"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {template.ruleInfo && (
        <div className="bg-muted/30 p-2 rounded-md text-sm text-muted-foreground flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{template.ruleInfo}</span>
        </div>
      )}
      {renderInput()}
    </div>
  );
};

const RuleDialog: React.FC<RuleDialogProps> = ({
  mode,
  initialData,
  open,
  onOpenChange,
}) => {
  const { addRule, updateRule } = useCreditRules();
  const [currentStep, setCurrentStep] = useState(1);
  
  const emptyRuleData: Omit<CreditRule, "id"> = {
    description: "",
    conditions: [createEmptyCondition()],
    logicalOperator: "AND",
    action: "Відмова",
    priority: 1,
    isActive: true,
    clientType: "Всі",
    creditProduct: "Всі",
    startDate: new Date().toISOString().split("T")[0],
    endDate: null,
    source: "УБКІ",
  };
  
  const [ruleData, setRuleData] = useState<Partial<CreditRule>>(
    mode === "edit" && initialData
      ? { 
          ...initialData,
          conditions: initialData.conditions || [createEmptyCondition()]
        }
      : emptyRuleData
  );
  
  // State for available rule templates based on selected source
  const [availableTemplates, setAvailableTemplates] = useState(
    ruleTemplatesBySource[ruleData.source as RuleSource] || []
  );

  // Update templates when source changes
  useEffect(() => {
    if (ruleData.source) {
      setAvailableTemplates(ruleTemplatesBySource[ruleData.source as RuleSource] || []);
      
      // If we're not in edit mode, reset description and condition when source changes
      if (mode === "add") {
        setRuleData(prev => ({
          ...prev,
          description: "",
          conditions: [createEmptyCondition()]
        }));
      }
    }
  }, [ruleData.source, mode]);

  const updateField = <K extends keyof CreditRule>(field: K, value: CreditRule[K]) => {
    setRuleData({ ...ruleData, [field]: value });
  };

  const updateCondition = (index: number, updatedCondition: Partial<RuleCondition>) => {
    if (!ruleData.conditions) return;
    
    const updatedConditions = [...ruleData.conditions];
    updatedConditions[index] = { ...updatedConditions[index], ...updatedCondition };
    
    updateField('conditions', updatedConditions);
  };

  const addCondition = () => {
    if (!ruleData.conditions) return;
    
    const updatedConditions = [...ruleData.conditions, createEmptyCondition()];
    updateField('conditions', updatedConditions);
  };

  const removeCondition = (index: number) => {
    if (!ruleData.conditions || ruleData.conditions.length <= 1) return;
    
    const updatedConditions = ruleData.conditions.filter((_, i) => i !== index);
    updateField('conditions', updatedConditions);
  };

  const handleDescriptionChange = (description: string) => {
    const template = availableTemplates.find(t => t.description === description);
    if (template && ruleData.conditions && ruleData.conditions.length > 0) {
      updateField("description", description);
      
      const updatedCondition: RuleCondition = {
        ...ruleData.conditions[0],
        condition: template.condition,
        value: "",
        valueType: template.valueType,
        operator: getOperatorOptions(template.valueType)[0]
      };
      
      const updatedConditions = [updatedCondition];
      
      if (ruleData.conditions.length > 1) {
        updatedConditions.push(...ruleData.conditions.slice(1));
      }
      
      updateField("conditions", updatedConditions);
    }
  };

  const handleSubmit = () => {
    if (!ruleData.description || !ruleData.conditions || ruleData.conditions.length === 0) {
      return;
    }
    
    if (mode === "add") {
      addRule(ruleData as Omit<CreditRule, "id">);
    } else if (mode === "edit" && initialData) {
      updateRule(initialData.id, ruleData);
    }
    onOpenChange(false);
  };

  const nextStep = () => {
    setCurrentStep(Math.min(currentStep + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Додати нове правило" : "Редагувати правило"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Створіть нове правило кредитування крок за кроком."
              : "Внесіть зміни до існуючого правила кредитування."}
          </DialogDescription>
        </DialogHeader>

        {mode === "add" ? (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Крок {currentStep} з 3</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-2 w-8 rounded-full ${
                        step <= currentStep ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Джерело правила</Label>
                  <Select
                    value={ruleData.source}
                    onValueChange={(value) => updateField("source", value as RuleSource)}
                  >
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Виберіть джерело" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="УБКІ">УБКІ</SelectItem>
                      <SelectItem value="Вертекс">Вертекс</SelectItem>
                      <SelectItem value="Скаріста">Скаріста</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Правило</Label>
                  <Select
                    value={ruleData.description}
                    onValueChange={handleDescriptionChange}
                  >
                    <SelectTrigger id="description">
                      <SelectValue placeholder="Виберіть правило" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTemplates.map((template) => (
                        <SelectItem key={template.description} value={template.description}>
                          {template.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {ruleData.conditions && ruleData.conditions.map((condition, index) => (
                  <div 
                    key={index} 
                    className={`border p-4 rounded-md ${index > 0 ? 'mt-6' : ''}`}
                  >
                    {index > 0 && (
                      <div className="flex items-center justify-between mb-4">
                        <Label>Логічний оператор</Label>
                        <Select
                          value={ruleData.logicalOperator}
                          onValueChange={(value) => updateField("logicalOperator", value as LogicalOperator)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">І</SelectItem>
                            <SelectItem value="OR">АБО</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`condition-${index}`}>Умова правила {index + 1}</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex">
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="max-w-xs">
                                <p>Тип значення: {getValueTypeName(condition.valueType)}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCondition(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {index === 0 && ruleData.description ? (
                      <div className="mb-4">
                        <Input
                          id={`condition-${index}`}
                          value={condition.condition}
                          onChange={(e) => updateCondition(index, { condition: e.target.value })}
                          readOnly
                          className="bg-muted/30"
                        />
                      </div>
                    ) : (
                      <div className="mb-4">
                        <Select
                          value={condition.condition}
                          onValueChange={(value) => {
                            const template = getConditionTemplate(value);
                            if (template) {
                              updateCondition(index, { 
                                condition: value,
                                valueType: template.valueType,
                                operator: getOperatorOptions(template.valueType)[0]
                              });
                            }
                          }}
                        >
                          <SelectTrigger id={`condition-${index}`}>
                            <SelectValue placeholder="Виберіть умову" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTemplates.map((template) => (
                              <SelectItem key={template.condition} value={template.condition}>
                                {template.condition}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor={`conditionValue-${index}`}>Значення умови</Label>
                      <ConditionValueInput
                        condition={condition}
                        value={condition.value}
                        onChange={(value) => updateCondition(index, { value })}
                        onOperatorChange={(operator) => updateCondition(index, { operator })}
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={addCondition}
                >
                  <Plus className="h-4 w-4 mr-2" /> Додати умову
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Дія</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start ${
                        ruleData.action === "Відмова" ? "bg-action-refusal-bg border-action-refusal" : ""
                      }`}
                      onClick={() => updateField("action", "Відмова")}
                    >
                      <ActionBadge action="Відмова" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start ${
                        ruleData.action === "Видача" ? "bg-action-issuance-bg border-action-issuance" : ""
                      }`}
                      onClick={() => updateField("action", "Видача")}
                    >
                      <ActionBadge action="Видача" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start ${
                        ruleData.action === "Андеррайтинг" ? "bg-action-underwriting-bg border-action-underwriting" : ""
                      }`}
                      onClick={() => updateField("action", "Андеррайтинг")}
                    >
                      <ActionBadge action="Андеррайтинг" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Пріоритет</Label>
                  <Input
                    id="priority"
                    type="number"
                    min={1}
                    value={ruleData.priority}
                    onChange={(e) => updateField("priority", parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={ruleData.isActive}
                    onCheckedChange={(checked) => updateField("isActive", checked)}
                  />
                  <Label htmlFor="isActive">Правило активне</Label>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientType">Тип клієнта</Label>
                  <Select
                    value={ruleData.clientType}
                    onValueChange={(value) => updateField("clientType", value as ClientType)}
                  >
                    <SelectTrigger id="clientType">
                      <SelectValue placeholder="Виберіть тип клієнта" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Всі">Всі</SelectItem>
                      <SelectItem value="Новий">Новий</SelectItem>
                      <SelectItem value="Повторний">Повторний</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditProduct">Кредитний продукт</Label>
                  <Input
                    id="creditProduct"
                    value={ruleData.creditProduct}
                    onChange={(e) => updateField("creditProduct", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Дата початку дії</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={ruleData.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Дата кінця дії (не обов'язково)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={ruleData.endDate || ""}
                      onChange={(e) => updateField("endDate", e.target.value || null)}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Назад
                </Button>
              )}
              {currentStep < 3 ? (
                <Button onClick={nextStep}>Далі</Button>
              ) : (
                <Button onClick={handleSubmit}>Додати правило</Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Умови</TabsTrigger>
                <TabsTrigger value="action">Дія</TabsTrigger>
                <TabsTrigger value="details">Деталі</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-source">Джерело правила</Label>
                  <Select
                    value={ruleData.source}
                    onValueChange={(value) => updateField("source", value as RuleSource)}
                  >
                    <SelectTrigger id="edit-source">
                      <SelectValue placeholder="Виберіть джерело" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="УБКІ">УБКІ</SelectItem>
                      <SelectItem value="Вертекс">Вертекс</SelectItem>
                      <SelectItem value="Скаріста">Скаріста</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Правило</Label>
                  <Select
                    value={ruleData.description}
                    onValueChange={handleDescriptionChange}
                  >
                    <SelectTrigger id="edit-description">
                      <SelectValue placeholder="Виберіть правило" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTemplates.map((template) => (
                        <SelectItem key={template.description} value={template.description}>
                          {template.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {ruleData.conditions && ruleData.conditions.map((condition, index) => (
                  <div 
                    key={index} 
                    className={`border p-4 rounded-md ${index > 0 ? 'mt-6' : ''}`}
                  >
                    {index > 0 && (
                      <div className="flex items-center justify-between mb-4">
                        <Label>Логічний оператор</Label>
                        <Select
                          value={ruleData.logicalOperator}
                          onValueChange={(value) => updateField("logicalOperator", value as LogicalOperator)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">І</SelectItem>
                            <SelectItem value="OR">АБО</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`edit-condition-${index}`}>Умова правила {index + 1}</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex">
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="max-w-xs">
                                <p>Тип значення: {getValueTypeName(condition.valueType)}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCondition(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {index === 0 && ruleData.description ? (
                      <div className="mb-4">
                        <Input
                          id={`edit-condition-${index}`}
                          value={condition.condition}
                          onChange={(e) => updateCondition(index, { condition: e.target.value })}
                          readOnly
                          className="bg-muted/30"
                        />
                      </div>
                    ) : (
                      <div className="mb-4">
                        <Select
                          value={condition.condition}
                          onValueChange={(value) => {
                            const template = getConditionTemplate(value);
                            if (template) {
                              updateCondition(index, { 
                                condition: value,
                                valueType: template.valueType,
                                operator: getOperatorOptions(template.valueType)[0]
                              });
                            }
                          }}
                        >
                          <SelectTrigger id={`edit-condition-${index}`}>
                            <SelectValue placeholder="Виберіть умову" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTemplates.map((template) => (
                              <SelectItem key={template.condition} value={template.condition}>
                                {template.condition}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor={`edit-conditionValue-${index}`}>Значення умови</Label>
                      <ConditionValueInput
                        condition={condition}
                        value={condition.value}
                        onChange={(value) => updateCondition(index, { value })}
                        onOperatorChange={(operator) => updateCondition(index, { operator })}
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={addCondition}
                >
                  <Plus className="h-4 w-4 mr-2" /> Додати умову
                </Button>
              </TabsContent>

              <TabsContent value="action" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Дія</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start ${
                        ruleData.action === "Відмова" ? "bg-action-refusal-bg border-action-refusal" : ""
                      }`}
                      onClick={() => updateField("action", "Відмова")}
                    >
                      <ActionBadge action="Відмова" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start ${
                        ruleData.action === "Видача" ? "bg-action-issuance-bg border-action-issuance" : ""
                      }`}
                      onClick={() => updateField("action", "Видача")}
                    >
                      <ActionBadge action="Видача" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start ${
                        ruleData.action === "Андеррайтинг" ? "bg-action-underwriting-bg border-action-underwriting" : ""
                      }`}
                      onClick={() => updateField("action", "Андеррайтинг")}
                    >
                      <ActionBadge action="Андеррайтинг" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Пріоритет</Label>
                  <Input
                    id="edit-priority"
                    type="number"
                    min={1}
                    value={ruleData.priority}
                    onChange={(e) => updateField("priority", parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isActive"
                    checked={ruleData.isActive}
                    onCheckedChange={(checked) => updateField("isActive", checked)}
                  />
                  <Label htmlFor="edit-isActive">Правило активне</Label>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-clientType">Тип клієнта</Label>
                  <Select
                    value={ruleData.clientType}
                    onValueChange={(value) => updateField("clientType", value as ClientType)}
                  >
                    <SelectTrigger id="edit-clientType">
                      <SelectValue placeholder="Виберіть тип клієнта" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Всі">Всі</SelectItem>
                      <SelectItem value="Новий">Новий</SelectItem>
                      <SelectItem value="Повторний">Повторний</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-creditProduct">Кредитний продукт</Label>
                  <Input
                    id="edit-creditProduct"
                    value={ruleData.creditProduct}
                    onChange={(e) => updateField("creditProduct", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Дата початку дії</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={ruleData.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">Дата кінця дії</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={ruleData.endDate || ""}
                      onChange={(e) => updateField("endDate", e.target.value || null)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Скасувати
              </Button>
              <Button onClick={handleSubmit}>Зберегти зміни</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RuleDialog;
