import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Save, RotateCcw, Plus, X, Eye } from "lucide-react";
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
}

const themeNames: { name: ThemeName; label: string; color: string }[] = [
  { name: 'default', label: 'Default', color: '#8B5CF6' },
  { name: 'classic', label: 'Classic', color: '#10B981' },
  { name: 'blue', label: 'Blue', color: '#3B82F6' },
  { name: 'teal', label: 'Teal', color: '#14B8A6' },
  { name: 'red', label: 'Red', color: '#EF4444' },
  { name: 'gray', label: 'Gray', color: '#6B7280' },
  { name: 'green', label: 'Green', color: '#22C55E' },
  { name: 'forest', label: 'Forest', color: '#059669' },
  { name: 'autumn', label: 'Autumn', color: '#F97316' },
  { name: 'mocha', label: 'Mocha', color: '#92400E' },
  { name: 'pink', label: 'Pink', color: '#EC4899' },
  { name: 'noir', label: 'Noir', color: '#1F2937' },
];

export const Settings = ({ 
  settings, 
  onSettingsChange, 
  categories, 
  onCategoriesChange,
  onSave, 
  onReset,
  currentTheme,
  onThemeChange 
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
        <div className="flex items-center gap-4 mb-8">
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

        <div className="space-y-6 animate-fade-in">
          {/* Theme Selection */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Thema's</h2>
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
                  <div 
                    className="w-full h-16 rounded-lg mb-2"
                    style={{ backgroundColor: theme.color }}
                  />
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

          {/* Timer Settings */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Timer</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="timer-enabled" className="text-base">Timer inschakelen</Label>
                <Switch
                  id="timer-enabled"
                  checked={settings.timerEnabled}
                  onCheckedChange={(checked) => 
                    onSettingsChange({ ...settings, timerEnabled: checked })
                  }
                />
              </div>
              {settings.timerEnabled && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="timer-length">Timer lengte (seconden)</Label>
                  <Input
                    id="timer-length"
                    type="number"
                    min="30"
                    max="600"
                    value={settings.timerLength}
                    onChange={(e) =>
                      onSettingsChange({ ...settings, timerLength: parseInt(e.target.value) || 300 })
                    }
                  />
                </div>
              )}
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
