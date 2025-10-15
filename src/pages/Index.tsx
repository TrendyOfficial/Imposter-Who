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
import { Moon, Sun, Plus, X, Eye, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types/theme";
import { useTheme } from "@/hooks/useTheme";
import { useThemeAdaptation } from "@/hooks/useThemeAdaptation";
import { useNavigate } from "react-router-dom";
const HINT_PASSWORD = "0000"; 
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
  const [players, setPlayers] = useState<Player[]>([{
    id: '1',
    name: 'Speler 1',
    color: 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
  }, {
    id: '2',
    name: 'Speler 2',
    color: 'linear-gradient(135deg, #06B6D4, #22D3EE)'
  }, {
    id: '3',
    name: 'Speler 3',
    color: 'linear-gradient(135deg, #F59E0B, #FBBF24)'
  }]);
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

  // Apply theme
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
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [hintPassword, setHintPassword] = useState("");
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [gameModeTab, setGameModeTab] = useState<'normal' | 'special'>('normal');
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [themeAdaptation, setThemeAdaptation] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('whoGameData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.settings) {
          // Validate theme name exists
          const validThemes: ThemeName[] = ['default', 'classic', 'grape', 'spiderman', 'ember', 'wolverine', 'acid', 'spark', 'hulk', 'popsicle', 'noir', 'blue', 'teal', 'red', 'gray', 'green', 'forest', 'autumn', 'mocha', 'pink'];
          const validThemeName = validThemes.includes(parsed.settings.themeName) ? parsed.settings.themeName : 'default';
          setSettings({...parsed.settings, themeName: validThemeName});
          setThemeName(validThemeName);
          if (parsed.settings.theme) setTheme(parsed.settings.theme);
        }
        if (parsed.selectedCategories) setSelectedCategories(parsed.selectedCategories);
        if (parsed.themeAdaptation !== undefined) setThemeAdaptation(parsed.themeAdaptation);
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

  // Scroll detection for Start button
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isBottom = scrollTop + clientHeight >= scrollHeight - 50;
        setIsAtBottom(isBottom);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [gameState.phase]);
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  const saveData = () => {
    const dataToSave = {
      players,
      categories,
      settings: { ...settings, theme, themeName },
      selectedCategories,
      themeAdaptation
    };
    localStorage.setItem('whoGameData', JSON.stringify(dataToSave));
    toast.success("Gegevens opgeslagen!");
  };
  const resetData = () => {
    localStorage.removeItem('whoGameData');
    setPlayers([{
      id: '1',
      name: 'Speler 1',
      color: 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
    }, {
      id: '2',
      name: 'Speler 2',
      color: 'linear-gradient(135deg, #06B6D4, #22D3EE)'
    }, {
      id: '3',
      name: 'Speler 3',
      color: 'linear-gradient(135deg, #F59E0B, #FBBF24)'
    }]);
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
    setThemeAdaptation(false);
    toast.success("Gegevens gereset!");
  };
  // Track deleted player numbers
  const [deletedPlayerNumbers, setDeletedPlayerNumbers] = useState<number[]>([]);

  const addPlayer = () => {
    let newId: string;
    
    // Reuse deleted player number if available
    if (deletedPlayerNumbers.length > 0) {
      const reusedNumber = Math.min(...deletedPlayerNumbers);
      newId = reusedNumber.toString();
      setDeletedPlayerNumbers(prev => prev.filter(num => num !== reusedNumber));
    } else {
      // Find the highest player number and add 1
      const maxId = Math.max(...players.map(p => parseInt(p.id) || 0), 0);
      newId = (maxId + 1).toString();
    }
    
    const hue = Math.floor(Math.random() * 360);
    const gradient = `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${hue}, 75%, 65%))`;
    
    // Add player and sort by ID
    const newPlayers = [...players, {
      id: newId,
      name: `Speler ${newId}`,
      color: gradient
    }].sort((a, b) => parseInt(a.id) - parseInt(b.id));
    
    setPlayers(newPlayers);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) {
      toast.error("Je hebt minimaal 2 spelers nodig!");
      return;
    }
    
    // Track the deleted player number for reuse
    const deletedNumber = parseInt(id);
    if (!isNaN(deletedNumber)) {
      setDeletedPlayerNumbers(prev => [...prev, deletedNumber].sort((a, b) => a - b));
    }
    
    setPlayers(players.filter(p => p.id !== id));
    setEditingPlayer(null);
  };
  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(players.map(p => p.id === id ? {
      ...p,
      ...updates
    } : p));
  };
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]);
  };
  const toggleGameMode = (mode: GameMode) => {
    setSettings(prev => ({
      ...prev,
      gameModes: prev.gameModes.includes(mode) ? prev.gameModes.filter(m => m !== mode) : [...prev.gameModes, mode]
    }));
  };
  const updateCategoryWords = (categoryName: string, newWords: {
    word: string;
    hint: string;
  }[]) => {
    setCategories(prev => prev.map(cat => cat.name === categoryName ? {
      ...cat,
      words: newWords
    } : cat));
    toast.success("Woorden bijgewerkt!");
  };
  const randomizePlayers = () => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setPlayers(shuffled);
    toast.success("Spelers gerandomiseerd!");
  };
  const randomizeCategories = () => {
    const availableCategories = categories.filter(c => selectedCategories.includes(c.name));
    if (availableCategories.length > 0) {
      const randomCat = availableCategories[Math.floor(Math.random() * availableCategories.length)];
      setSelectedCategories([randomCat.name]);
      toast.success(`Categorie gerandomiseerd: ${randomCat.name}`);
    }
  };
  const startGame = () => {
    if (selectedCategories.length === 0) {
      toast.error("Selecteer minimaal 1 categorie!");
      return;
    }
    if (settings.numberOfImposters >= players.length) {
      toast.error("Aantal imposters moet kleiner zijn dan aantal spelers!");
      return;
    }
    if (settings.gameModes.length === 0) {
      toast.error("Selecteer minimaal 1 game mode!");
      return;
    }

    // Separate selected modes into normal and special
    const selectedNormalModes = settings.gameModes.filter(m => normalGameModes.includes(m));
    const selectedSpecialModes = settings.gameModes.filter(m => specialGameModes.includes(m));

    // Pick modes - ALWAYS randomize when multiple modes are selected
    let normalMode: GameMode = 'normal';
    let specialMode: GameMode | null = null;
    if (selectedSpecialModes.length > 0) {
      // Pick random special mode
      specialMode = selectedSpecialModes[Math.floor(Math.random() * selectedSpecialModes.length)];

      // Also pick random normal mode
      if (selectedNormalModes.length > 0) {
        normalMode = selectedNormalModes[Math.floor(Math.random() * selectedNormalModes.length)];
      }
    } else {
      // Only normal mode - randomize if multiple selected
      normalMode = selectedNormalModes[Math.floor(Math.random() * selectedNormalModes.length)];
    }
    const activeMode = specialMode || normalMode;

    // Check player requirements
    if (activeMode === 'jester' && players.length < 4) {
      toast.error("Jester mode vereist minimaal 4 spelers!");
      return;
    }
    if (activeMode === 'detective' && players.length < 4) {
      toast.error("Detective mode vereist minimaal 4 spelers!");
      return;
    }
    if (activeMode === 'breaking-point' && players.length < 5) {
      toast.error("Breaking Point vereist minimaal 5 spelers!");
      return;
    }

    // Gather all words from selected categories
    const allWords = categories.filter(cat => selectedCategories.includes(cat.name)).flatMap(cat => cat.words);

    // Pick random word(s)
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
    let randomWord2;
    if (normalMode === 'two-words') {
      randomWord2 = allWords[Math.floor(Math.random() * allWords.length)];
    }
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    let imposterIds: string[] = [];
    let jesterId: string | undefined;
    let detectiveId: string | undefined;
    let healerId: string | undefined;

    // Assign imposters first
    switch (normalMode) {
      case 'everyone-imposter':
        imposterIds = players.map(p => p.id);
        break;
      default:
        imposterIds = shuffledPlayers.slice(0, settings.numberOfImposters).map(p => p.id);
    }

    // Get non-imposter players for extra roles
    const nonImposterPlayers = shuffledPlayers.filter(p => !imposterIds.includes(p.id));

    // Assign extra roles to non-imposters only
    switch (normalMode) {
      case 'jester':
        if (nonImposterPlayers.length > 0) {
          jesterId = nonImposterPlayers[0].id;
        }
        break;
      case 'detective':
        if (nonImposterPlayers.length > 0) {
          detectiveId = nonImposterPlayers[0].id;
        }
        break;
    }

    // Handle special game mode (Breaking Point)
    if (specialMode === 'breaking-point') {
      // Breaking Point can have the configured number of imposters
      // Don't override imposter count - use settings.numberOfImposters
      // Just assign healer from non-imposters
      const nonImposterPlayersForSpecial = shuffledPlayers.filter(p => !imposterIds.includes(p.id));
      // Assign healer (cannot be imposter, jester, or detective)
      const availableForHealer = nonImposterPlayersForSpecial.filter(p => p.id !== jesterId && p.id !== detectiveId);
      if (availableForHealer.length > 0) {
        healerId = availableForHealer[0].id;
      }
    }

    // Update players with roles
    const updatedPlayers = players.map(p => ({
      ...p,
      isImposter: normalMode === 'roles-switched' ? !imposterIds.includes(p.id) && p.id !== jesterId && p.id !== detectiveId && p.id !== healerId : imposterIds.includes(p.id)
    }));
    setPlayers(updatedPlayers);
    setGameState({
      phase: 'viewing-cards',
      currentPlayerIndex: 0,
      selectedWord: normalMode === 'roles-switched' ? randomWord.hint : randomWord.word,
      selectedWord2: randomWord2?.word,
      selectedHint: settings.hintEnabled ? normalMode === 'roles-switched' ? randomWord.word : randomWord.hint : '',
      selectedHint2: randomWord2?.hint,
      imposters: imposterIds,
      jesterId,
      detectiveId,
      healerId,
      activeGameMode: activeMode,
      normalGameMode: normalMode,
      votes: {}
    });
    setCardFlipped(false);
    const modeText = specialMode ? `${gameModeLabels[specialMode]} + ${gameModeLabels[normalMode]}` : gameModeLabels[normalMode];
    toast.success(`Spel gestart! Mode: ${modeText}`);
  };
  const nextPlayer = () => {
    if (!cardFlipped) {
      toast.error("Laat de huidige speler eerst hun kaart bekijken!");
      return;
    }
    if (gameState.currentPlayerIndex < players.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentPlayerIndex: prev.currentPlayerIndex + 1
      }));
      setCardFlipped(false);
    } else {
      setGameState(prev => ({
        ...prev,
        phase: 'discussion'
      }));
      setTimerSeconds(settings.timerLength);
      toast.success("Alle spelers hebben hun kaart gezien! Start de discussie.");
    }
  };
  const handleVote = (votedPlayerId: string) => {
    setGameState(prev => ({
      ...prev,
      votes: {
        ...prev.votes,
        [players[gameState.currentPlayerIndex].id]: votedPlayerId
      }
    }));
  };
  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'results'
    }));
  };
  const resetGame = () => {
    setGameState({
      phase: 'lobby',
      currentPlayerIndex: 0,
      selectedWord: '',
      selectedHint: '',
      imposters: [],
      activeGameMode: 'normal',
      normalGameMode: undefined,
      votes: {},
      detectiveId: undefined,
      healerId: undefined,
      killedPlayerId: undefined
    });
    setCardFlipped(false);
    setPlayers(players.map(p => ({
      ...p,
      isImposter: undefined
    })));
  };
  const currentPlayer = players[gameState.currentPlayerIndex];
  return <div className="min-h-screen bg-gradient-bg transition-colors duration-300 relative overflow-hidden">
      {/* Ambient glow for dark mode */}
      <div className="fixed inset-0 pointer-events-none" style={{
      background: 'var(--ambient-glow, none)'
    }} />
      
      <div ref={containerRef} className="container max-w-6xl mx-auto px-4 py-4 md:py-8 relative z-10 overflow-y-auto h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold transition-all duration-300">
            <span style={{ 
              background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Who?</span>{' '}
            <span style={{ 
              background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>🎭</span>
          </h1>
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/settings')} 
              className="rounded-full transition-all duration-300 hover:border-primary hover:bg-primary/10"
              style={{
                '--tw-border-opacity': '1',
              } as React.CSSProperties}
            >
              <SettingsIcon className="h-5 w-5" style={{
                color: 'hsl(var(--primary))'
              }} />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            {gameState.phase !== 'lobby' && <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Spel beëindigen?</DialogTitle>
                  </DialogHeader>
                  <p className="text-muted-foreground">
                    Weet je zeker dat je het spel wilt beëindigen?
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>Annuleren</Button>
                    <Button variant="destructive" onClick={resetGame}>Beëindigen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>}
          </div>
        </div>

        {/* Lobby Phase */}
        {gameState.phase === 'lobby' && <div className="space-y-8 animate-fade-in">
            {/* Settings */}
            <div className="bg-card rounded-2xl shadow-card p-4 md:p-6 border border-border">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5 md:h-6 md:w-6" />
                    Instellingen
                  </h2>
                  <div className="flex gap-2">
                    <Button onClick={saveData} variant="default" size="sm">
                      💾
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          🔄
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Alles resetten?</DialogTitle>
                        </DialogHeader>
                        <p className="text-muted-foreground">
                          Dit zal alle spelers, categorieën en instellingen resetten naar standaard waarden.
                        </p>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>Annuleren</Button>
                          <Button variant="destructive" onClick={resetData}>Reset</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-center justify-between animate-fade-in">
                    <Label htmlFor="timer">Timer</Label>
                    <Switch id="timer" checked={settings.timerEnabled} onCheckedChange={checked => setSettings(prev => ({
                  ...prev,
                  timerEnabled: checked
                }))} />
                  </div>
                  {settings.timerEnabled && <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="timer-length">Timer Lengte (seconden): {settings.timerLength}</Label>
                      <Input id="timer-length" type="number" min="30" max="900" step="30" value={settings.timerLength} onChange={e => setSettings(prev => ({
                  ...prev,
                  timerLength: parseInt(e.target.value) || 300
                }))} />
                    </div>}
                  <div className="flex items-center justify-between animate-fade-in">
                    <Label htmlFor="hints">Hints</Label>
                    <Switch id="hints" checked={settings.hintEnabled} onCheckedChange={checked => setSettings(prev => ({
                  ...prev,
                  hintEnabled: checked
                }))} />
                  </div>
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="imposters">Aantal Imposters: {settings.numberOfImposters}</Label>
                    <Input id="imposters" type="number" min="1" max={Math.max(1, players.length - 1)} value={settings.numberOfImposters} onChange={e => setSettings(prev => ({
                  ...prev,
                  numberOfImposters: parseInt(e.target.value) || 1
                }))} />
                  </div>
                </div>

                {/* Game Modes */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">🎮 Game Modes</Label>
                  </div>

                  {/* Normal/Special Tabs */}
                  <div className="flex gap-2 p-1 bg-muted rounded-lg">
                    <Button variant={gameModeTab === 'normal' ? 'default' : 'ghost'} className="flex-1" onClick={() => setGameModeTab('normal')}>
                      Normal
                    </Button>
                    <Button variant={gameModeTab === 'special' ? 'default' : 'ghost'} className="flex-1" onClick={() => setGameModeTab('special')}>
                      Special
                    </Button>
                  </div>

                  <div className="grid gap-3 animate-fade-in">
                    {(gameModeTab === 'normal' ? normalGameModes : specialGameModes).map(mode => <div key={mode} className={cn("flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer", settings.gameModes.includes(mode) ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50")} onClick={() => toggleGameMode(mode)}>
                        <Checkbox checked={settings.gameModes.includes(mode)} onCheckedChange={() => toggleGameMode(mode)} />
                        <span className="font-medium flex-1">{gameModeLabels[mode]}</span>
                      </div>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Players */}
            <div className="bg-card rounded-2xl shadow-card p-4 md:p-6 border border-border">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <h2 className="text-xl md:text-2xl font-bold">👥 Spelers ({players.length})</h2>
                <div className="flex gap-2">
                  <Button onClick={randomizePlayers} size="sm" variant="outline" className="rounded-full text-xs md:text-sm">
                    🔀 Randomize
                  </Button>
                  <Button onClick={addPlayer} size="sm" className="rounded-full text-xs md:text-sm">
                    <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Toevoegen
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {players.map(player => <div key={player.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full" style={{
                  background: player.color
                }} />
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditingPlayer(player)}>
                          Bewerken
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Speler Bewerken</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="player-name">Naam</Label>
                            <Input id="player-name" value={editingPlayer?.name || ''} onChange={e => setEditingPlayer(prev => prev ? {
                        ...prev,
                        name: e.target.value
                      } : null)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="player-color">Kleur Gradient</Label>
                            <div className="flex gap-2">
                              <Button onClick={() => {
                          const hue = Math.floor(Math.random() * 360);
                          const gradient = `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${hue}, 75%, 65%))`;
                          setEditingPlayer(prev => prev ? {
                            ...prev,
                            color: gradient
                          } : null);
                        }} variant="outline" className="flex-1">
                                🎨 Random Gradient
                              </Button>
                            </div>
                            <div className="w-full h-20 rounded-lg" style={{
                        background: editingPlayer?.color
                      }} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="destructive" onClick={() => removePlayer(player.id)}>
                            Verwijderen
                          </Button>
                          <Button onClick={() => {
                      if (editingPlayer) {
                        updatePlayer(editingPlayer.id, {
                          name: editingPlayer.name,
                          color: editingPlayer.color
                        });
                        setEditingPlayer(null);
                      }
                    }}>
                            Opslaan
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>)}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-card rounded-2xl shadow-card p-4 md:p-6 border border-border max-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6 flex-shrink-0 flex-wrap gap-2">
                <h2 className="text-xl md:text-2xl font-bold">📂 Categorieën</h2>
                <Button onClick={randomizeCategories} variant="outline" size="sm" className="rounded-full text-xs md:text-sm">
                  🔀 Randomize
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2 overflow-y-auto flex-1">
                {categories.map(category => <div key={category.name} className={cn("flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer", selectedCategories.includes(category.name) ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50")} onClick={() => toggleCategory(category.name)}>
                    <Checkbox checked={selectedCategories.includes(category.name)} onCheckedChange={() => toggleCategory(category.name)} />
                    <span className="text-2xl">{category.emoji}</span>
                    <span className="font-medium flex-1">{category.name}</span>
                  </div>)}
              </div>
            </div>

            <div className="sticky bottom-0 pt-4 bg-gradient-bg pb-4">
              <Button 
                onClick={startGame} 
                size="lg" 
                className={cn(
                  "w-full rounded-2xl shadow-lg transition-all duration-300",
                  isAtBottom 
                    ? "text-base md:text-lg h-12 md:h-14" 
                    : "text-sm md:text-base h-10 md:h-12 hover:h-12 hover:text-base md:hover:h-14 md:hover:text-lg"
                )}
              >
                🎮 Start Spel
              </Button>
            </div>
          </div>}

        {/* Viewing Cards Phase */}
        {gameState.phase === 'viewing-cards' && currentPlayer && <div className="space-y-6 animate-scale-in">
            {/* Special Gamemode Warning */}
            {specialGameModes.includes(gameState.activeGameMode) && <div className="bg-destructive/10 border-2 border-destructive rounded-2xl p-6 text-center animate-pulse">
                <p className="text-xl font-bold text-destructive mb-2">⚠️ SPECIAL GAMEMODE ACTIVE ⚠️</p>
                <p className="text-lg font-semibold">{gameModeLabels[gameState.activeGameMode]}</p>
              </div>}

            <GameCard content={gameState.selectedWord} content2={gameState.selectedWord2} hint={gameState.selectedHint} isImposter={currentPlayer.isImposter || false} isJester={currentPlayer.id === gameState.jesterId} isDetective={currentPlayer.id === gameState.detectiveId} isHealer={currentPlayer.id === gameState.healerId} showHintToInnocents={gameState.normalGameMode === 'innocents-see-hint'} onFlipComplete={() => setCardFlipped(true)} playerName={currentPlayer.name} playerColor={currentPlayer.color} />

            <Button onClick={nextPlayer} disabled={!cardFlipped} size="lg" className="w-full text-lg h-14 rounded-2xl">
              {gameState.currentPlayerIndex < players.length - 1 ? `➡️ Volgende Speler` : `🎯 Start Discussie`}
            </Button>

            <div className="flex justify-center gap-2">
              {players.map((_, idx) => <div key={idx} className={cn("w-3 h-3 rounded-full transition-all", idx === gameState.currentPlayerIndex ? "bg-primary scale-125" : idx < gameState.currentPlayerIndex ? "bg-success" : "bg-muted")} />)}
            </div>
          </div>}

        {/* Discussion Phase */}
        {gameState.phase === 'discussion' && <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-2xl shadow-card p-8 text-center border border-border">
              <h2 className="text-3xl font-bold mb-4">💬 Discussie Tijd!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Bespreek wie jullie denken dat de imposter(s) {settings.numberOfImposters > 1 ? 'zijn' : 'is'}
              </p>
              {settings.timerEnabled && <div className="text-4xl font-bold text-primary mb-4">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>}
            </div>

            <Button onClick={endGame} size="lg" className="w-full text-lg h-14 rounded-2xl">
              🗳️ Onthul Imposter & woord
            </Button>
          </div>}

        {/* Results Phase */}
        {gameState.phase === 'results' && <div className="space-y-6 animate-scale-in">
            <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
              <h2 className="text-3xl font-bold mb-6 text-center">📊 Resultaten</h2>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Het woord was:</p>
                  <p className="text-3xl font-bold text-foreground">{gameState.selectedWord}</p>
                  {gameState.selectedWord2 && <p className="text-2xl font-bold text-foreground mt-2">{gameState.selectedWord2}</p>}
                </div>

                {gameState.selectedHint && <div className="p-4 bg-secondary/10 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">De hint was:</p>
                    <p className="text-2xl font-bold text-foreground">{gameState.selectedHint}</p>
                    {gameState.selectedHint2 && <p className="text-xl font-bold text-foreground mt-2">{gameState.selectedHint2}</p>}
                  </div>}

                <div className="p-4 bg-destructive/10 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">De Imposter(s):</p>
                  <div className="space-y-2">
                    {players.filter(p => gameState.imposters.includes(p.id)).map(imposter => <div key={imposter.id} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{
                    backgroundColor: imposter.color
                  }} />
                          <span className="text-xl font-bold">{imposter.name}</span>
                        </div>)}
                  </div>
                </div>

                {gameState.jesterId && <div className="p-4 bg-warning/10 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">De Jester was:</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{
                  backgroundColor: players.find(p => p.id === gameState.jesterId)?.color
                }} />
                      <span className="text-xl font-bold">
                        {players.find(p => p.id === gameState.jesterId)?.name}
                      </span>
                    </div>
                  </div>}

                {gameState.detectiveId && <div className="p-4 bg-blue-500/10 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">De Detective was:</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{
                  backgroundColor: players.find(p => p.id === gameState.detectiveId)?.color
                }} />
                      <span className="text-xl font-bold">
                        {players.find(p => p.id === gameState.detectiveId)?.name}
                      </span>
                    </div>
                  </div>}

                {gameState.healerId && <div className="p-4 bg-green-500/10 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">De Healer was:</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{
                  backgroundColor: players.find(p => p.id === gameState.healerId)?.color
                }} />
                      <span className="text-xl font-bold">
                        {players.find(p => p.id === gameState.healerId)?.name}
                      </span>
                    </div>
                  </div>}

                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Game Mode{specialGameModes.includes(gameState.activeGameMode) ? 's' : ''}:</p>
                  <div className="space-y-1">
                    {specialGameModes.includes(gameState.activeGameMode) && <p className="text-lg font-bold text-destructive">
                        ⚠️ {gameModeLabels[gameState.activeGameMode]}
                      </p>}
                    {gameState.normalGameMode && <p className="text-lg font-bold">
                        {gameModeLabels[gameState.normalGameMode]}
                      </p>}
                    {!gameState.normalGameMode && !specialGameModes.includes(gameState.activeGameMode) && <p className="text-lg font-bold">
                        {gameModeLabels[gameState.activeGameMode]}
                      </p>}
                  </div>
                </div>
              </div>

                <div className="flex gap-4">
                <Button onClick={resetGame} variant="outline" size="lg" className="flex-1 text-lg h-14 rounded-2xl">
                  🏠 Terug naar Lobby
                </Button>
                <Button onClick={startGame} size="lg" className="flex-1 text-lg h-14 rounded-2xl">
                  🔄 Nieuwe Ronde
                </Button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
            </div>
          </div>}
      </div>
    </div>;
};
export default Index;

