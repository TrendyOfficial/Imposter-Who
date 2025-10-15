import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { GameCard } from "@/components/GameCard";
import { defaultCategories } from "@/data/categories";
import { Player, GameSettings, GameState, Category, GameMode } from "@/types/game";
import { Moon, Sun, Plus, X, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types/theme";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";

const gameModeLabels: Record<GameMode, string> = {
  'normal': '🎯 Normal',
  'detective': '🔍 Detective (4+ spelers)',
  'everyone-imposter': '👻 Everyone Imposter',
  'innocents-see-hint': '👁️ Innocents See Hint',
  'roles-switched': '🔄 Roles Switched',
  'two-words': '✌️ Two Words',
  'jester': '🃏 Jester Mode (4+ spelers)',
  'breaking-point': '💥 Breaking Point (5+ spelers)'
};
const normalGameModes: GameMode[] = ['normal', 'detective', 'everyone-imposter', 'innocents-see-hint', 'roles-switched', 'two-words', 'jester'];
const specialGameModes: GameMode[] = ['breaking-point'];

const Index = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [themeName, setThemeName] = useState<ThemeName>('default');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Speler 1', color: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
    { id: '2', name: 'Speler 2', color: 'linear-gradient(135deg, #06B6D4, #22D3EE)' },
    { id: '3', name: 'Speler 3', color: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(defaultCategories.filter(c => c.isDefault).map(c => c.name));
  const [settings, setSettings] = useState<GameSettings>({
    theme: 'dark',
    themeName: 'default',
    language: 'nl',
    gameModes: ['normal'],
    randomizeGameModes: false,
    timerEnabled: false,
    timerLength: 300,
    numberOfImposters: 1,
    hintEnabled: true
  });

  useTheme(themeName, theme);

  const [gameState, setGameState] = useState<GameState>({
    phase: 'lobby',
    currentPlayerIndex: 0,
    selectedWord: '',
    selectedHint: '',
    imposters: [],
    activeGameMode: 'normal',
    votes: {}
  });
  const [cardFlipped, setCardFlipped] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [gameModeTab, setGameModeTab] = useState<'normal' | 'special'>('normal');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('whoGameData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.selectedCategories) setSelectedCategories(parsed.selectedCategories);
        toast.success("Opgeslagen gegevens geladen!");
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState.phase === 'discussion' && settings.timerEnabled && timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            toast.info("Timer afgelopen!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.phase, settings.timerEnabled, timerSeconds]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 50);
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const saveData = () => {
    const dataToSave = { players, categories, settings, selectedCategories };
    localStorage.setItem('whoGameData', JSON.stringify(dataToSave));
    toast.success("Gegevens opgeslagen!");
  };

  const resetData = () => {
    localStorage.removeItem('whoGameData');
    setPlayers([
      { id: '1', name: 'Speler 1', color: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
      { id: '2', name: 'Speler 2', color: 'linear-gradient(135deg, #06B6D4, #22D3EE)' },
      { id: '3', name: 'Speler 3', color: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }
    ]);
    setCategories(defaultCategories);
    setSelectedCategories(defaultCategories.filter(c => c.isDefault).map(c => c.name));
    setSettings({
      theme: 'dark',
      themeName: 'default',
      language: 'nl',
      gameModes: ['normal'],
      randomizeGameModes: false,
      timerEnabled: false,
      timerLength: 300,
      numberOfImposters: 1,
      hintEnabled: true
    });
    setThemeName('default');
    setTheme('light');
    toast.success("Gegevens gereset!");
  };

  const addPlayer = () => {
    const newId = (Math.max(...players.map(p => parseInt(p.id)), 0) + 1).toString();
    const hue = Math.floor(Math.random() * 360);
    const gradient = `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${hue}, 75%, 65%))`;
    setPlayers([...players, { id: newId, name: `Speler ${newId}`, color: gradient }]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) return toast.error("Minimaal 2 spelers vereist!");
    setPlayers(players.filter(p => p.id !== id));
  };

  const startGame = () => {
    if (selectedCategories.length === 0) return toast.error("Selecteer minimaal 1 categorie!");
    setGameState({ ...gameState, phase: 'viewing-cards', currentPlayerIndex: 0 });
  };

  const resetGame = () => {
    setGameState({
      phase: 'lobby',
      currentPlayerIndex: 0,
      selectedWord: '',
      selectedHint: '',
      imposters: [],
      activeGameMode: 'normal',
      votes: {}
    });
    setCardFlipped(false);
  };

  const currentPlayer = players[gameState.currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-bg transition-colors duration-300 relative overflow-hidden">
      <div ref={containerRef} className="container max-w-6xl mx-auto px-4 py-4 md:py-8 relative z-10 overflow-y-auto h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Who?</span> 🎭
          </h1>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/settings')} className="rounded-full">
              <SettingsIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Lobby Phase */}
        {gameState.phase === 'lobby' && (
          <div className="space-y-8">
            <div className="bg-card rounded-2xl shadow-card p-4 md:p-6 border border-border">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <h2 className="text-xl md:text-2xl font-bold">👥 Spelers ({players.length})</h2>
                <div className="flex gap-2">
                  <Button onClick={addPlayer} size="sm" className="rounded-full text-xs md:text-sm">
                    <Plus className="h-3 w-3 mr-1" /> Toevoegen
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
                    <span className="font-medium">{player.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: player.color }} />
                      <Button onClick={() => removePlayer(player.id)} size="icon" variant="ghost" className="p-0.5">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={startGame} size="lg" className="rounded-2xl h-14 px-6 text-lg">
                ▶️ Start Spel
              </Button>
            </div>
          </div>
        )}

        {/* Viewing Cards Phase */}
        {gameState.phase === 'viewing-cards' && currentPlayer && (
          <div className="flex flex-col items-center space-y-6 animate-scale-in">
            <h2 className="text-2xl md:text-3xl font-bold">Kaart bekijken: {currentPlayer.name}</h2>
            <div className={cn("w-80 md:w-96 h-48 md:h-64 rounded-2xl bg-card shadow-card p-6 flex items-center justify-center text-center transition-transform duration-500", cardFlipped && "rotate-y-180")}>
              {!cardFlipped ? "Tik om te draaien" : gameState.selectedWord}
            </div>
            <Button onClick={() => setCardFlipped(true)} size="lg" className="rounded-2xl h-14 px-6 text-lg">
              🔄 Draai Kaart
            </Button>
          </div>
        )}

        {/* Results Phase */}
        {gameState.phase === 'results' && (
          <div className="space-y-6 animate-scale-in">
            <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
              <h2 className="text-3xl font-bold mb-6 text-center">📊 Resultaten</h2>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Het woord was:</p>
                  <p className="text-3xl font-bold text-foreground">{gameState.selectedWord}</p>
                  {gameState.selectedWord2 && (
                    <p className="text-2xl font-bold text-foreground mt-2">{gameState.selectedWord2}</p>
                  )}
                </div>

                {gameState.selectedHint && (
                  <div className="p-4 bg-secondary/10 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">De hint was:</p>
                    <p className="text-2xl font-bold text-foreground">{gameState.selectedHint}</p>
                    {gameState.selectedHint2 && (
                      <p className="text-xl font-bold text-foreground mt-2">{gameState.selectedHint2}</p>
                    )}
                  </div>
                )}

                <div className="p-4 bg-destructive/10 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">De Imposter(s):</p>
                  <div className="space-y-2">
                    {players.filter(p => gameState.imposters.includes(p.id)).map(imposter => (
                      <div key={imposter.id} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: imposter.color }} />
                        <span className="text-xl font-bold">{imposter.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={resetGame}
                  variant="outline"
                  size="lg"
                  className="flex-1 text-lg h-14 rounded-2xl"
                >
                  🏠 Lobby
                </Button>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="flex-1 text-lg h-14 rounded-2xl"
                >
                  🆕 Ronde
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
