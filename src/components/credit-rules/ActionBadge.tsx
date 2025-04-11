
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CreditRuleAction } from "@/types/creditRules";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, CircleMinus } from "lucide-react";

interface ActionBadgeProps {
  action: CreditRuleAction;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({ 
  action, 
  size = "md",
  showIcon = true 
}) => {
  let bgColor = "";
  let textColor = "";
  let Icon = CheckCircle;

  switch (action) {
    case "Відмова":
      bgColor = "bg-action-refusal-bg";
      textColor = "text-action-refusal";
      Icon = AlertCircle;
      break;
    case "Видача":
      bgColor = "bg-action-issuance-bg";
      textColor = "text-action-issuance";
      Icon = CheckCircle;
      break;
    case "Андеррайтинг":
      bgColor = "bg-action-underwriting-bg";
      textColor = "text-action-underwriting";
      Icon = CircleMinus;
      break;
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <Badge className={cn(bgColor, textColor, sizeClasses[size], "font-medium flex gap-1 items-center")}>
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {action}
    </Badge>
  );
};
