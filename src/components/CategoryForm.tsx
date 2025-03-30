
import React, { useState, useEffect } from "react";
import { useExpense } from "@/context/ExpenseContext";
import { CategoryType } from "@/types/expense";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  category?: CategoryType;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  category,
}) => {
  const { addCategory, updateCategory } = useExpense();
  const isEditing = !!category;

  const [formData, setFormData] = useState({
    name: "",
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
      });
    } else {
      setFormData({
        name: "",
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    }
  }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && category) {
      updateCategory(category.id, formData);
    } else {
      addCategory(formData);
    }
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Category Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Category name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="color" className="text-sm font-medium">
              Color
            </label>
            <div className="flex items-center space-x-2">
              <Input
                id="color"
                name="color"
                type="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: formData.color }}
              ></div>
              <Input
                value={formData.color}
                onChange={handleChange}
                name="color"
                className="flex-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Add"} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
