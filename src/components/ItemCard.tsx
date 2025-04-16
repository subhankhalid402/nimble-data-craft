
import { Item } from "@/types/item";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  // Format the date
  const formattedDate = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
  });

  // Get status badge color
  const getStatusColor = () => {
    switch (item.status) {
      case "active":
        return "bg-green-500 hover:bg-green-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "archived":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-bold">{item.name}</span>
          <Badge className={`${getStatusColor()} text-white`}>{item.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{item.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2 border-t">
        <span className="text-sm text-gray-500">Created {formattedDate}</span>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(item)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(item)}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
