
import { CreateItemInput, Item, UpdateItemInput } from "@/types/item";

// In a real app, this would connect to a database
// For now, we'll use localStorage for persistence
const STORAGE_KEY = "crud-items";

// Helper to get a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Get initial data from localStorage or use sample data
const getInitialItems = (): Item[] => {
  const storedItems = localStorage.getItem(STORAGE_KEY);
  if (storedItems) {
    return JSON.parse(storedItems);
  }

  // Sample data
  const sampleItems: Item[] = [
    {
      id: generateId(),
      name: "Project Alpha",
      description: "Main product development project",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: "Customer Research",
      description: "Interviews with potential customers",
      status: "pending",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: generateId(),
      name: "Legacy Migration",
      description: "Migrating data from old systems",
      status: "archived",
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleItems));
  return sampleItems;
};

// Initialize our "database" with sample data
let items: Item[] = getInitialItems();

// Save to localStorage
const persistItems = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const itemsService = {
  // Get all items
  getItems: (): Item[] => {
    return items;
  },

  // Get a single item by ID
  getItemById: (id: string): Item | undefined => {
    return items.find(item => item.id === id);
  },

  // Create a new item
  createItem: (input: CreateItemInput): Item => {
    const newItem: Item = {
      id: generateId(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    
    items = [newItem, ...items];
    persistItems();
    return newItem;
  },

  // Update an existing item
  updateItem: (id: string, input: UpdateItemInput): Item | undefined => {
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return undefined;
    }
    
    const updatedItem = {
      ...items[itemIndex],
      ...input,
    };
    
    items[itemIndex] = updatedItem;
    persistItems();
    return updatedItem;
  },

  // Delete an item
  deleteItem: (id: string): boolean => {
    const initialLength = items.length;
    items = items.filter(item => item.id !== id);
    persistItems();
    return items.length < initialLength;
  },
};
