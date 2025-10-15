import { useState, useEffect } from "react";
import { Settings } from "./Settings";
import { defaultCategories } from "@/data/categories";
import { Category, GameSettings } from "@/types/game";
import { ThemeName } from "@/types/theme";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

export const SettingsWrapper = () => {
  // Load theme preference from localStorage first
  const savedData = localStorage.getItem('whoGameData');
  let initialTheme: 'light' | 'dark' = 'light';
  let initialThemeName: ThemeName = 'default';
  
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (parsed.settings?.theme) initialTheme = parsed.settings.theme;
      if (parsed.settings?.themeName) {
        // Validate theme name exists in themePresets
        const validThemes: ThemeName[] = ['default', 'classic', 'grape', 'spiderman', 'ember', 'wolverine', 'acid', 'spark', 'hulk', 'popsicle', 'noir'];
        initialThemeName = validThemes.includes(parsed.settings.themeName) ? parsed.settings.themeName : 'default';
      }
    } catch (e) {
      console.error("Failed to load theme", e);
    }
  }

  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [themeName, setThemeName] = useState<ThemeName>(initialThemeName);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [settings, setSettings] = useState<GameSettings>({
    theme: initialTheme,
    themeName: initialThemeName,
    language: 'nl',
    gameModes: ['normal'],
    randomizeGameModes: false,
    timerEnabled: false,
    timerLength: 300,
    numberOfImposters: 1,
    hintEnabled: true,
  });

  // Apply theme
  useTheme(themeName, theme);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('whoGameData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.settings) {
          setSettings(parsed.settings);
          if (parsed.settings.theme) setTheme(parsed.settings.theme);
          if (parsed.settings.themeName) setThemeName(parsed.settings.themeName);
        }
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  const saveData = () => {
    const savedData = localStorage.getItem('whoGameData');
    let existingData = {};
    if (savedData) {
      try {
        existingData = JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse existing data", e);
      }
    }
    
    const dataToSave = {
      ...existingData,
      categories,
      settings: { ...settings, theme, themeName },
    };
    localStorage.setItem('whoGameData', JSON.stringify(dataToSave));
    toast.success("Gegevens opgeslagen!");
  };

  const resetData = () => {
    const savedData = localStorage.getItem('whoGameData');
    let existingData = {};
    if (savedData) {
      try {
        existingData = JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse existing data", e);
      }
    }

    setCategories(defaultCategories);
    const resetSettings = {
      theme: 'light' as const,
      themeName: 'default',
      language: 'nl' as const,
      gameModes: ['normal' as const],
      randomizeGameModes: false,
      timerEnabled: false,
      timerLength: 300,
      numberOfImposters: 1,
      hintEnabled: true,
    };
    setSettings(resetSettings);
    setThemeName('default');
    setTheme('light');

    const dataToSave = {
      ...existingData,
      categories: defaultCategories,
      settings: resetSettings,
    };
    localStorage.setItem('whoGameData', JSON.stringify(dataToSave));
    toast.success("Instellingen gereset!");
  };

  const handleThemeChange = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    setSettings(prev => ({ ...prev, themeName: newThemeName }));
  };

  const handleModeToggle = () => {
    const newMode = theme === 'light' ? 'dark' : 'light';
    setTheme(newMode);
    setSettings(prev => ({ ...prev, theme: newMode }));
  };

  return (
    <Settings
      settings={settings}
      onSettingsChange={setSettings}
      categories={categories}
      onCategoriesChange={setCategories}
      onSave={saveData}
      onReset={resetData}
      currentTheme={themeName}
      onThemeChange={handleThemeChange}
      currentMode={theme}
      onModeToggle={handleModeToggle}
    />
  );
};
