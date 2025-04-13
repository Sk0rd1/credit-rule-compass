
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ActionBadge } from "./ActionBadge";
import { useCreditRules } from "@/contexts/CreditRulesContext";
import { CreditRule, RuleCondition } from "@/types/creditRules";
import { Edit, Trash2, Info } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import RuleDialog from "./RuleDialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export const RulesTable: React.FC = () => {
  const { filteredRules, toggleRuleActive, deleteRule } = useCreditRules();
  const [editingRule, setEditingRule] = useState<CreditRule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Необмежено";
    return format(new Date(dateString), "dd.MM.yyyy", { locale: uk });
  };

  const renderConditions = (rule: CreditRule) => {
    if (!rule.conditions || rule.conditions.length === 0) return "";
    
    return (
      <div className="space-y-2">
        {rule.conditions.map((condition, index) => (
          <div key={index} className="flex flex-col">
            {index > 0 && (
              <Badge className="self-start mb-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
                {rule.logicalOperator === "AND" ? "І" : "АБО"}
              </Badge>
            )}
            <span>{condition.condition}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderValues = (rule: CreditRule) => {
    if (!rule.conditions || rule.conditions.length === 0) return "";
    
    return (
      <div className="space-y-2">
        {rule.conditions.map((condition, index) => (
          <div key={index} className={`flex flex-col ${index > 0 ? 'mt-6' : ''}`}>
            {index > 0 && <div className="h-4"></div>}
            <div className="flex gap-1 items-center">
              {condition.operator && <span>{condition.operator}</span>}
              <span>{condition.value}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderValueTypes = (rule: CreditRule) => {
    if (!rule.conditions || rule.conditions.length === 0) return "";
    
    return (
      <div className="space-y-2">
        {rule.conditions.map((condition, index) => (
          <div key={index} className={`flex flex-col ${index > 0 ? 'mt-6' : ''}`}>
            {index > 0 && <div className="h-4"></div>}
            <Badge variant="outline" className="self-start">
              {condition.valueType}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">№</TableHead>
            <TableHead>Опис правила</TableHead>
            <TableHead>Умова</TableHead>
            <TableHead>Значення</TableHead>
            <TableHead>Тип значення</TableHead>
            <TableHead className="text-center">Дія</TableHead>
            <TableHead className="text-center">Пріоритет</TableHead>
            <TableHead className="text-center">Активно</TableHead>
            <TableHead>Тип клієнта</TableHead>
            <TableHead>Кредитний продукт</TableHead>
            <TableHead>Джерело</TableHead>
            <TableHead>Період дії</TableHead>
            <TableHead className="text-right">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="h-24 text-center">
                Правила не знайдено.
              </TableCell>
            </TableRow>
          ) : (
            filteredRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="text-center font-medium">{rule.id}</TableCell>
                <TableCell>{rule.description}</TableCell>
                <TableCell>{renderConditions(rule)}</TableCell>
                <TableCell>{renderValues(rule)}</TableCell>
                <TableCell>{renderValueTypes(rule)}</TableCell>
                <TableCell className="text-center">
                  <ActionBadge action={rule.action} />
                </TableCell>
                <TableCell className="text-center">{rule.priority}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => toggleRuleActive(rule.id)}
                    aria-label="Активність правила"
                  />
                </TableCell>
                <TableCell>{rule.clientType}</TableCell>
                <TableCell>{rule.creditProduct}</TableCell>
                <TableCell>{rule.source}</TableCell>
                <TableCell>{formatDate(rule.startDate)} - {formatDate(rule.endDate)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setEditingRule(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setShowDeleteConfirm(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editingRule && (
        <RuleDialog 
          mode="edit"
          initialData={editingRule}
          open={!!editingRule}
          onOpenChange={() => setEditingRule(null)}
        />
      )}

      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Підтвердження видалення</h3>
            <p className="mb-4">Ви впевнені, що хочете видалити це правило?</p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(null)}
              >
                Скасувати
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  if (showDeleteConfirm !== null) {
                    deleteRule(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }
                }}
              >
                Видалити
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
