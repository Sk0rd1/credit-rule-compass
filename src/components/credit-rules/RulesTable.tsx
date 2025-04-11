
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
import { CreditRule } from "@/types/creditRules";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import RuleDialog from "./RuleDialog";

export const RulesTable: React.FC = () => {
  const { filteredRules, toggleRuleActive, deleteRule } = useCreditRules();
  const [editingRule, setEditingRule] = useState<CreditRule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Необмежено";
    return format(new Date(dateString), "dd.MM.yyyy", { locale: uk });
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
              <TableCell colSpan={12} className="h-24 text-center">
                Правила не знайдено.
              </TableCell>
            </TableRow>
          ) : (
            filteredRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="text-center font-medium">{rule.id}</TableCell>
                <TableCell>{rule.description}</TableCell>
                <TableCell>{rule.condition}</TableCell>
                <TableCell>{rule.conditionValue}</TableCell>
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
