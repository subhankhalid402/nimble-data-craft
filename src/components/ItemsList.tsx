
import { useState } from "react";
import { Item } from "@/types/item";
import { ItemCard } from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ItemsListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemsList({ items, onEdit, onDelete }: ItemsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Filter items based on search term and status filter
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search Items
          </Label>
          <Input
            id="search"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Label htmlFor="status-filter" className="sr-only">
            Filter by Status
          </Label>
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-gray-500">
            {items.length === 0 
              ? "No items found. Create your first item to get started." 
              : "No items match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
