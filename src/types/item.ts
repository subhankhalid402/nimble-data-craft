
export interface Item {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived" | "pending";
  createdAt: string;
}

export type CreateItemInput = Omit<Item, "id" | "createdAt">;
export type UpdateItemInput = Partial<CreateItemInput>;
