
import { useState } from 'react';
import { ChecklistItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  X, 
  CheckSquare, 
  ListTodo 
} from 'lucide-react';
import { toast } from 'sonner';

// Default checklist categories and items
const defaultChecklistItems: ChecklistItem[] = [
  // Essentials
  { id: uuidv4(), name: 'Passport', category: 'Essentials', checked: false },
  { id: uuidv4(), name: 'Travel Insurance', category: 'Essentials', checked: false },
  { id: uuidv4(), name: 'Credit/Debit Cards', category: 'Essentials', checked: false },
  { id: uuidv4(), name: 'Cash (Japanese Yen)', category: 'Essentials', checked: false },
  { id: uuidv4(), name: 'International Driving Permit', category: 'Essentials', checked: false },
  { id: uuidv4(), name: 'Travel Adapter', category: 'Essentials', checked: false },
  
  // Clothing
  { id: uuidv4(), name: 'Light Jacket/Sweater', category: 'Clothing', checked: false },
  { id: uuidv4(), name: 'Comfortable Walking Shoes', category: 'Clothing', checked: false },
  { id: uuidv4(), name: 'Socks & Underwear', category: 'Clothing', checked: false },
  { id: uuidv4(), name: 'Rain Jacket/Umbrella', category: 'Clothing', checked: false },
  { id: uuidv4(), name: 'Sleepwear', category: 'Clothing', checked: false },
  
  // Technology
  { id: uuidv4(), name: 'Smartphone & Charger', category: 'Technology', checked: false },
  { id: uuidv4(), name: 'Camera & Charger', category: 'Technology', checked: false },
  { id: uuidv4(), name: 'Power Bank', category: 'Technology', checked: false },
  { id: uuidv4(), name: 'Headphones', category: 'Technology', checked: false },
  
  // Toiletries
  { id: uuidv4(), name: 'Toothbrush & Toothpaste', category: 'Toiletries', checked: false },
  { id: uuidv4(), name: 'Shampoo & Conditioner', category: 'Toiletries', checked: false },
  { id: uuidv4(), name: 'Sunscreen', category: 'Toiletries', checked: false },
  { id: uuidv4(), name: 'Medications', category: 'Toiletries', checked: false },
  
  // Kyoto Specific
  { id: uuidv4(), name: 'Portable Wifi/SIM Card', category: 'Kyoto Specific', checked: false },
  { id: uuidv4(), name: 'Japan Rail Pass', category: 'Kyoto Specific', checked: false },
  { id: uuidv4(), name: 'Temple Etiquette Guide', category: 'Kyoto Specific', checked: false },
  { id: uuidv4(), name: 'Japanese Phrase Book/App', category: 'Kyoto Specific', checked: false },
];

interface PackingChecklistProps {
  checklist: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

const PackingChecklist = ({ checklist, onChange }: PackingChecklistProps) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Essentials');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'Essentials', 'Clothing', 'Technology', 'Toiletries', 'Kyoto Specific'
  ]);

  // Get unique categories
  const categories = Array.from(new Set(checklist.map(item => item.category)));

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleChecklistItem = (id: string) => {
    const updatedItems = checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onChange(updatedItems);
  };

  const addChecklistItem = () => {
    if (!newItemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    const newItem: ChecklistItem = {
      id: uuidv4(),
      name: newItemName.trim(),
      category: newItemCategory,
      checked: false,
    };

    onChange([...checklist, newItem]);
    setNewItemName('');
    toast.success(`Added ${newItemName} to your packing list`);
  };

  const removeChecklistItem = (id: string) => {
    const itemToRemove = checklist.find(item => item.id === id);
    onChange(checklist.filter(item => item.id !== id));
    
    if (itemToRemove) {
      toast.success(`Removed ${itemToRemove.name} from your packing list`);
    }
  };

  const resetChecklist = () => {
    onChange(defaultChecklistItems);
    toast.success("Packing checklist has been reset to default items");
  };

  const getCategoryProgress = (category: string) => {
    const categoryItems = checklist.filter(item => item.category === category);
    const checkedItems = categoryItems.filter(item => item.checked);
    return {
      total: categoryItems.length,
      checked: checkedItems.length,
      percent: categoryItems.length > 0 
        ? Math.round((checkedItems.length / categoryItems.length) * 100)
        : 0
    };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            <span>Packing Checklist</span>
          </CardTitle>
          <CardDescription>
            {checklist.filter(item => item.checked).length} of {checklist.length} items packed
          </CardDescription>
        </div>
        <Button onClick={resetChecklist} variant="outline" size="sm">Reset</Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Add new item */}
          <div className="flex gap-2">
            <Input 
              placeholder="Add new item..." 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addChecklistItem();
                }
              }}
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="p-2 border rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            <Button onClick={addChecklistItem} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Checklist by categories */}
          <div className="space-y-2">
            {categories.map(category => {
              const { total, checked, percent } = getCategoryProgress(category);
              const isExpanded = expandedCategories.includes(category);
              
              return (
                <Collapsible 
                  key={category} 
                  open={isExpanded}
                  className="border rounded-md overflow-hidden"
                >
                  <CollapsibleTrigger asChild>
                    <div 
                      className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant={percent === 100 ? "default" : "secondary"}>
                          {checked}/{total}
                        </Badge>
                        <span className="font-medium">{category}</span>
                      </div>
                      {isExpanded ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-3 pt-0 space-y-1">
                      {checklist
                        .filter(item => item.category === category)
                        .map(item => (
                          <div 
                            key={item.id}
                            className="flex items-center justify-between py-1"
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={item.checked}
                                onCheckedChange={() => toggleChecklistItem(item.id)}
                                id={item.id}
                              />
                              <label 
                                htmlFor={item.id} 
                                className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {item.name}
                              </label>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full opacity-60 hover:opacity-100"
                              onClick={() => removeChecklistItem(item.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingChecklist;
