
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreditRules } from "@/contexts/CreditRulesContext";
import { Search, X } from "lucide-react";

export const RulesFilter: React.FC = () => {
  const {
    filterText,
    setFilterText,
    filterSource,
    setFilterSource,
    filterClientType,
    setFilterClientType,
    filterAction,
    setFilterAction,
    resetFilters,
  } = useCreditRules();

  return (
    <div className="bg-white p-4 rounded-lg border mb-4">
      <h2 className="text-lg font-medium mb-4">Фільтри</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Пошук правил..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select 
          value={filterSource} 
          onValueChange={(value) => setFilterSource(value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Джерело даних" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Всі">Всі джерела</SelectItem>
            <SelectItem value="УБКІ">УБКІ</SelectItem>
            <SelectItem value="Вертекс">Вертекс</SelectItem>
            <SelectItem value="Скаріста">Скаріста</SelectItem>
            <SelectItem value="1-хард рул">1-хард рул</SelectItem>
            <SelectItem value="2-додаткові">2-додаткові</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filterClientType} 
          onValueChange={(value) => setFilterClientType(value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Тип клієнта" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Всі">Всі типи</SelectItem>
            <SelectItem value="Новий">Новий</SelectItem>
            <SelectItem value="Повторний">Повторний</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filterAction} 
          onValueChange={(value) => setFilterAction(value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Дія" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Всі">Всі дії</SelectItem>
            <SelectItem value="Відмова">Відмова</SelectItem>
            <SelectItem value="Видача">Видача</SelectItem>
            <SelectItem value="Андеррайтинг">Андеррайтинг</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={resetFilters} className="h-10">
          <X className="h-4 w-4 mr-2" />
          Скинути фільтри
        </Button>
      </div>
    </div>
  );
};
