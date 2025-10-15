import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Save, RotateCcw, Plus, X, Eye, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { Category, GameSettings } from "@/types/game";
import { ThemeName } from "@/types/theme";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  onSave: () => void;
  onReset: () => void;
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  currentMode: 'light' | 'dark';
  onModeToggle: () => void;
  themeAdaptation: boolean;
  onThemeAdaptationChange: (enabled: boolean) => void;
}

const themeNames: { name: ThemeName; label: string; colors: string[] }[] = [
  { name: 'default', label: 'Default', colors: ['#14B8A6', '#06B6D4', '#22D3EE'] },
  { name: 'classic', label: 'Classic', colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'] },
  { name: 'grape', label: 'Grape', colors: ['#A855F7', '#C084FC', '#D8B4FE'] },
  { name: 'spiderman', label: 'Spiderman', colors: ['#3B82F6', '#EF4444', '#DC2626'] },
  { name: 'ember', label: 'Ember', colors: ['#EF4444', '#DC2626', '#B91C1C'] },
  { name: 'wolverine', label: 'Wolverine', colors: ['#F59E0B', '#3B82F6', '#1D4ED8'] },
  { name: 'acid', label: 'Acid', colors: ['#22C55E', '#16A34A', '#15803D'] },
  { name: 'spark', label: 'Spark', colors: ['#F59E0B', '#FBBF24', '#FCD34D'] },
  { name: 'hulk', label: 'Hulk', colors: ['#A855F7', '#22C55E', '#16A34A'] },
  { name: 'popsicle', label: 'Popsicle', colors: ['#06B6D4', '#F59E0B', '#FBBF24'] },
  { name: 'noir', label: 'Noir', colors: ['#1F2937', '#374151', '#4B5563'] },
  { name: 'blue', label: 'Blue', colors: ['#3B82F6', '#60A5FA', '#93C5FD'] },
  { name: 'teal', label: 'Teal', colors: ['#14B8A6', '#2DD4BF', '#5EEAD4'] },
  { name: 'red', label: 'Red', colors: ['#EF4444', '#F87171', '#FCA5A5'] },
  { name: 'gray', label: 'Gray', colors: ['#6B7280', '#9CA3AF', '#D1D5DB'] },
  { name: 'green', label: 'Green', colors: ['#22C55E', '#4ADE80', '#86EFAC'] },
  { name: 'forest', label: 'Forest', colors: ['#059669', '#10B981', '#34D399'] },
  { name: 'autumn', label: 'Autumn', colors: ['#F97316', '#FB923C', '#FDBA74'] },
  { name: 'mocha', label: 'Mocha', colors: ['#92400E', '#B45309', '#D97706'] },
  { name: 'pink', label: 'Pink', colors: ['#EC4899', '#F472B6', '#F9A8D4'] },
];

export const Settings = ({ 
  settings, 
  onSettingsChange, 
  categories, 
  onCategoriesChange,
  onSave, 
  onReset,
  currentTheme,
  onThemeChange,
  currentMode,
  onModeToggle,
  themeAdaptation,
  onThemeAdaptationChange
}: SettingsProps) => {
  const navigate = useNavigate();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  const updateCategoryWords = (categoryName: string, newWords: { word: string; hint: string }[]) => {
    const updated = categories.map(cat => 
      cat.name === categoryName 
        ? { ...cat, words: newWords }
        : cat
    );
    onCategoriesChange(updated);
    toast.success("Woorden bijgewerkt!");
  };

  return (
    <div className="min-h-screen bg-gradient-bg relative overflow-hidden">
      {/* Ambient glow for dark mode */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'var(--ambient-glow, none)' }} />
      
      <div className="relative z-10 container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="animate-fade-in"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
              Instellingen
            </h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onModeToggle}
            className="rounded-full animate-fade-in"
          >
            {currentMode === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>

        <div className="space-y-6 animate-fade-in">
          {/* Theme Selection */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-primary/20 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Thema's</h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="theme-adaptation" className="text-sm">Thema-adaptieve knoppen</Label>
                <Switch
                  id="theme-adaptation"
                  checked={themeAdaptation}
                  onCheckedChange={onThemeAdaptationChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {themeNames.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => onThemeChange(theme.name)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-300",
                    "hover:scale-105 hover:shadow-lg",
                    currentTheme === theme.name
                      ? "border-primary shadow-lg ring-2 ring-primary/50"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="w-full h-20 rounded-lg mb-3 bg-card relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex gap-1.5">
                        {theme.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">{theme.label}</p>
                  {currentTheme === theme.name && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Category Management */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Categorieën Beheren</h2>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="font-medium text-foreground">{category.name}</span>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingCategory(category)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{category.name} - Woorden</DialogTitle>
                        </DialogHeader>
                        {viewingCategory && (
                          <div className="space-y-2">
                            {viewingCategory.words.map((item, idx) => (
                              <div key={idx} className="p-3 bg-muted rounded-lg">
                                <p className="font-semibold text-foreground">{item.word}</p>
                                <p className="text-sm text-muted-foreground">{item.hint}</p>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingCategory(viewingCategory);
                                setViewingCategory(null);
                              }}
                              className="w-full mt-4"
                            >
                              ✏️ Wijzig
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Category Dialog */}
          {editingCategory && (
            <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Wijzig {editingCategory.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {editingCategory.words.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={item.word}
                          onChange={(e) => {
                            const updated = [...editingCategory.words];
                            updated[idx] = { ...updated[idx], word: e.target.value };
                            setEditingCategory({ ...editingCategory, words: updated });
                          }}
                          placeholder="Woord"
                        />
                        <Input
                          value={item.hint}
                          onChange={(e) => {
                            const updated = [...editingCategory.words];
                            updated[idx] = { ...updated[idx], hint: e.target.value };
                            setEditingCategory({ ...editingCategory, words: updated });
                          }}
                          placeholder="Hint"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = editingCategory.words.filter((_, i) => i !== idx);
                          setEditingCategory({ ...editingCategory, words: updated });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingCategory({
                        ...editingCategory,
                        words: [...editingCategory.words, { word: '', hint: '' }],
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Voeg woord toe
                  </Button>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      updateCategoryWords(editingCategory.name, editingCategory.words);
                      setEditingCategory(null);
                    }}
                  >
                    Opslaan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Save/Reset Actions */}
          <div className="flex gap-4">
            <Button onClick={onSave} className="flex-1" size="lg">
              <Save className="h-5 w-5 mr-2" />
              💾 Opslaan
            </Button>
            <Button onClick={onReset} variant="destructive" className="flex-1" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              🔄 Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
