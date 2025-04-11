
import React, { useState } from "react";
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
import { useCreditRules } from "@/contexts/CreditRulesContext";
import { CreditRule, RuleSource, ClientType, CreditRuleAction } from "@/types/creditRules";
import { ActionBadge } from "./ActionBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RuleDialogProps {
  mode: "add" | "edit";
  initialData?: CreditRule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RuleDialog: React.FC<RuleDialogProps> = ({
  mode,
  initialData,
  open,
  onOpenChange,
}) => {
  const { addRule, updateRule } = useCreditRules();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [ruleData, setRuleData] = useState<Partial<CreditRule>>(
    mode === "edit" && initialData
      ? { ...initialData }
      : {
          description: "",
          condition: "",
          conditionValue: "",
          action: "Відмова" as CreditRuleAction,
          priority: 1,
          isActive: true,
          clientType: "Всі" as ClientType,
          creditProduct: "Всі",
          startDate: new Date().toISOString().split("T")[0],
          endDate: null,
          source: "УБКІ" as RuleSource,
        }
  );

  const updateField = (field: keyof CreditRule, value: any) => {
    setRuleData({ ...ruleData, [field]: value });
  };

  const handleSubmit = () => {
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
          // Multi-step form for adding new rules
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
                    onValueChange={(value) => updateField("source", value)}
                  >
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Виберіть джерело" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="УБКІ">УБКІ</SelectItem>
                      <SelectItem value="Вертекс">Вертекс</SelectItem>
                      <SelectItem value="Скаріста">Скаріста</SelectItem>
                      <SelectItem value="1-хард рул">1-хард рул</SelectItem>
                      <SelectItem value="2-додаткові">2-додаткові</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Опис правила</Label>
                  <Input
                    id="description"
                    value={ruleData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Умова правила</Label>
                  <Input
                    id="condition"
                    value={ruleData.condition}
                    onChange={(e) => updateField("condition", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditionValue">Значення умови</Label>
                  <Input
                    id="conditionValue"
                    value={ruleData.conditionValue}
                    onChange={(e) => updateField("conditionValue", e.target.value)}
                  />
                </div>
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
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientType">Тип клієнта</Label>
                  <Select
                    value={ruleData.clientType}
                    onValueChange={(value) => updateField("clientType", value)}
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
          // Edit form with tabs for editing existing rules
          <>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Основне</TabsTrigger>
                <TabsTrigger value="action">Дія</TabsTrigger>
                <TabsTrigger value="details">Деталі</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-source">Джерело правила</Label>
                  <Select
                    value={ruleData.source}
                    onValueChange={(value) => updateField("source", value)}
                  >
                    <SelectTrigger id="edit-source">
                      <SelectValue placeholder="Виберіть джерело" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="УБКІ">УБКІ</SelectItem>
                      <SelectItem value="Вертекс">Вертекс</SelectItem>
                      <SelectItem value="Скаріста">Скаріста</SelectItem>
                      <SelectItem value="1-хард рул">1-хард рул</SelectItem>
                      <SelectItem value="2-додаткові">2-додаткові</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Опис правила</Label>
                  <Input
                    id="edit-description"
                    value={ruleData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-condition">Умова правила</Label>
                  <Input
                    id="edit-condition"
                    value={ruleData.condition}
                    onChange={(e) => updateField("condition", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-conditionValue">Значення умови</Label>
                  <Input
                    id="edit-conditionValue"
                    value={ruleData.conditionValue}
                    onChange={(e) => updateField("conditionValue", e.target.value)}
                  />
                </div>
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
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-clientType">Тип клієнта</Label>
                  <Select
                    value={ruleData.clientType}
                    onValueChange={(value) => updateField("clientType", value)}
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
