
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RulesFilter } from "./RulesFilter";
import { RulesTable } from "./RulesTable";
import RuleDialog from "./RuleDialog";
import { useCreditRules } from "@/contexts/CreditRulesContext";

export const RulesDashboard: React.FC = () => {
  const { filteredRules } = useCreditRules();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Правила кредитування</h1>
        <Button onClick={() => setOpenAddDialog(true)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Додати правило
        </Button>
      </div>
      
      <RulesFilter />
      
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        Знайдено {filteredRules.length} правил
      </div>
      
      <RulesTable />
      
      <RuleDialog
        mode="add"
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
      />
    </div>
  );
};
