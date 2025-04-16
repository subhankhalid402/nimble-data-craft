import { useState, useEffect } from "react";
import { Item, CreateItemInput } from "@/types/item";
import { ItemsList } from "@/components/ItemsList";
import { ItemForm } from "@/components/ItemForm";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { itemsService } from "@/lib/items-service";
import { useToast } from "@/hooks/use-toast";
export function ItemsDashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const {
    toast
  } = useToast();

  // Load items on component mount
  useEffect(() => {
    try {
      const data = itemsService.getItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to load items:", error);
      toast({
        variant: "destructive",
        title: "Error loading items",
        description: "Please refresh the page and try again."
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create item handler
  const handleCreateItem = (data: CreateItemInput) => {
    try {
      const newItem = itemsService.createItem(data);
      setItems(prev => [newItem, ...prev]);
    } catch (error) {
      console.error("Failed to create item:", error);
      toast({
        variant: "destructive",
        title: "Error creating item",
        description: "Please try again."
      });
    }
  };

  // Update item handler
  const handleUpdateItem = (data: CreateItemInput) => {
    if (!selectedItem) return;
    try {
      const updatedItem = itemsService.updateItem(selectedItem.id, data);
      if (updatedItem) {
        setItems(prev => prev.map(item => item.id === selectedItem.id ? updatedItem : item));
      }
    } catch (error) {
      console.error("Failed to update item:", error);
      toast({
        variant: "destructive",
        title: "Error updating item",
        description: "Please try again."
      });
    }
  };

  // Delete item handler
  const handleConfirmDelete = () => {
    if (!selectedItem) return;
    try {
      const success = itemsService.deleteItem(selectedItem.id);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== selectedItem.id));
        toast({
          title: "Item Deleted",
          description: "The item has been removed successfully."
        });
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast({
        variant: "destructive",
        title: "Error deleting item",
        description: "Please try again."
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedItem(undefined);
    }
  };

  // Open form for creating new item
  const openCreateForm = () => {
    setSelectedItem(undefined);
    setIsFormOpen(true);
  };

  // Open form for editing existing item
  const openEditForm = (item: Item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = (data: CreateItemInput) => {
    if (selectedItem) {
      handleUpdateItem(data);
    } else {
      handleCreateItem(data);
    }
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
        <p>Loading items...</p>
      </div>;
  }
  return <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Items Manager</h1>
          <p className="text-gray-500 font-extralight mx-[4px] my-[16px] py-[6px]">Create, view, edit and delete your items</p>
        </div>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> 
          Add New Item
        </Button>
      </div>

      <ItemsList items={items} onEdit={openEditForm} onDelete={openDeleteDialog} />

      <ItemForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedItem} />

      <DeleteConfirmation isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={handleConfirmDelete} item={selectedItem} />
    </div>;
}