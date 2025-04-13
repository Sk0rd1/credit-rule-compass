
import React, { createContext, useState, useContext, ReactNode } from "react";
import { CreditRule, RuleSource, ClientType, CreditRuleAction } from "@/types/creditRules";
import { sampleRules } from "@/data/sampleRules";
import { toast } from "@/lib/toast";

interface CreditRulesContextType {
  rules: CreditRule[];
  filteredRules: CreditRule[];
  filterText: string;
  filterSource: RuleSource | "Всі";
  filterClientType: ClientType | "Всі";
  filterAction: CreditRuleAction | "Всі";
  
  addRule: (rule: Omit<CreditRule, "id">) => void;
  updateRule: (id: number, rule: Partial<CreditRule>) => void;
  deleteRule: (id: number) => void;
  toggleRuleActive: (id: number) => void;
  
  setFilterText: (text: string) => void;
  setFilterSource: (source: RuleSource | "Всі") => void;
  setFilterClientType: (clientType: ClientType | "Всі") => void;
  setFilterAction: (action: CreditRuleAction | "Всі") => void;
  resetFilters: () => void;
}

const CreditRulesContext = createContext<CreditRulesContextType | undefined>(undefined);

export const CreditRulesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rules, setRules] = useState<CreditRule[]>(sampleRules);
  const [filterText, setFilterText] = useState("");
  const [filterSource, setFilterSource] = useState<RuleSource | "Всі">("Всі");
  const [filterClientType, setFilterClientType] = useState<ClientType | "Всі">("Всі");
  const [filterAction, setFilterAction] = useState<CreditRuleAction | "Всі">("Всі");

  const filteredRules = rules.filter(rule => {
    // Get condition text for search
    const conditionText = rule.conditions?.map(c => c.condition).join(" ") || "";
    const valueText = rule.conditions?.map(c => c.value).join(" ") || "";
    
    const matchesText =
      filterText === "" ||
      rule.description.toLowerCase().includes(filterText.toLowerCase()) ||
      conditionText.toLowerCase().includes(filterText.toLowerCase()) ||
      valueText.toLowerCase().includes(filterText.toLowerCase());
    
    const matchesSource = filterSource === "Всі" || rule.source === filterSource;
    const matchesClientType = filterClientType === "Всі" || rule.clientType === filterClientType || rule.clientType === "Всі";
    const matchesAction = filterAction === "Всі" || rule.action === filterAction;
    
    return matchesText && matchesSource && matchesClientType && matchesAction;
  });

  const addRule = (rule: Omit<CreditRule, "id">) => {
    const newRule = {
      ...rule,
      id: Math.max(...rules.map(r => r.id), 0) + 1,
    };
    setRules([...rules, newRule]);
    toast.success("Правило успішно додано");
  };

  const updateRule = (id: number, updatedFields: Partial<CreditRule>) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, ...updatedFields } : rule
    ));
    toast.success("Правило успішно оновлено");
  };

  const deleteRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast.success("Правило успішно видалено");
  };

  const toggleRuleActive = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const resetFilters = () => {
    setFilterText("");
    setFilterSource("Всі");
    setFilterClientType("Всі");
    setFilterAction("Всі");
  };

  return (
    <CreditRulesContext.Provider
      value={{
        rules,
        filteredRules,
        filterText,
        filterSource,
        filterClientType,
        filterAction,
        addRule,
        updateRule,
        deleteRule,
        toggleRuleActive,
        setFilterText,
        setFilterSource,
        setFilterClientType,
        setFilterAction,
        resetFilters,
      }}
    >
      {children}
    </CreditRulesContext.Provider>
  );
};

export const useCreditRules = (): CreditRulesContextType => {
  const context = useContext(CreditRulesContext);
  if (context === undefined) {
    throw new Error("useCreditRules must be used within a CreditRulesProvider");
  }
  return context;
};
