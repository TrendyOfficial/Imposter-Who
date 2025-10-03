import { useState, useEffect } from "react";
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

const HINT_PASSWORD = "8813";

const gameModeLabels: Record<GameMode, string> = {
  'normal': '🎯 Normal',
  'detective': '🔍 Detective',
  'everyone-imposter': '👻 Everyone Imposter',
  'innocents-see-hint': '👁️ Innocents See Hint',
  'roles-switched': '🔄 Roles Switched',
  'two-words': '✌️ Two Words',
  'jester': '🃏 Jester Mode (4+ spelers)',
  'breaking-point': '💥 Breaking Point',
  'healer': '💚 Healer',
};

const normalGameModes: GameMode[] = ['normal', 'detective'];
const specialGameModes: GameMode[] = ['everyone-imposter', 'innocents-see-hint', 'roles-switched', 'two-words', 'jester', 'breaking-point', 'healer'];

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Speler 1', color: '#8B5CF6' },
    { id: '2', name: 'Speler 2', color: '#06B6D4' },
    { id: '3', name: 'Speler 3', color: '#F59E0B' },
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    defaultCategories.filter(c => c.isDefault).map(c => c.name)
  );
  const [settings, setSettings] = useState<GameSettings>({
    theme: 'light',
    language: 'nl',
    gameModes: ['normal'],
    randomizeGameModes: false,
    timerEnabled: false,
    timerLength: 300,
    numberOfImposters: 1,
    hintEnabled: true,
  });
  const [gameState, setGameState] = useState<GameState>({
    phase: 'lobby',
    currentPlayerIndex: 0,
    selectedWord: '',
    selectedHint: '',
    imposters: [],
    activeGameMode: 'normal',
    votes: {},
  });
  const [cardFlipped, setCardFlipped] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [hintPassword, setHintPassword] = useState("");
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [gameModeTab, setGameModeTab] = useState<'normal' | 'special'>('normal');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addPlayer = () => {
    const newId = (players.length + 1).toString();
    setPlayers([...players, {
      id: newId,
      name: `Speler ${newId}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    }]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) {
      toast.error("Je hebt minimaal 2 spelers nodig!");
      return;
    }
    setPlayers(players.filter(p => p.id !== id));
    setEditingPlayer(null);
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(players.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleGameMode = (mode: GameMode) => {
    setSettings(prev => ({
      ...prev,
      gameModes: prev.gameModes.includes(mode)
        ? prev.gameModes.filter(m => m !== mode)
        : [...prev.gameModes, mode]
    }));
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

    // Select active game mode
    const activeMode = settings.randomizeGameModes
      ? settings.gameModes[Math.floor(Math.random() * settings.gameModes.length)]
      : settings.gameModes[0];

    // Check jester mode player requirement
    if (activeMode === 'jester' && players.length < 4) {
      toast.error("Jester mode vereist minimaal 4 spelers!");
      return;
    }

    // Check breaking-point/healer player requirement
    if ((activeMode === 'breaking-point' || activeMode === 'healer') && players.length < 3) {
      toast.error("Breaking Point/Healer vereist minimaal 3 spelers!");
      return;
    }

    // Gather all words from selected categories
    const allWords = defaultCategories
      .filter(cat => selectedCategories.includes(cat.name))
      .flatMap(cat => cat.words);

    // Pick random word(s)
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
    let randomWord2;
    if (activeMode === 'two-words') {
      randomWord2 = allWords[Math.floor(Math.random() * allWords.length)];
    }

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    let imposterIds: string[] = [];
    let jesterId: string | undefined;
    let detectiveId: string | undefined;
    let healerId: string | undefined;

    // Handle different game modes
    switch (activeMode) {
      case 'everyone-imposter':
        imposterIds = players.map(p => p.id);
        break;
      case 'jester':
        jesterId = shuffledPlayers[0].id;
        imposterIds = shuffledPlayers.slice(1, 1 + settings.numberOfImposters).map(p => p.id);
        break;
      case 'detective':
        detectiveId = shuffledPlayers[0].id;
        imposterIds = shuffledPlayers.slice(1, 1 + settings.numberOfImposters).map(p => p.id);
        break;
      case 'breaking-point':
        imposterIds = shuffledPlayers.slice(0, 1).map(p => p.id); // Only 1 imposter for breaking point
        break;
      case 'healer':
        healerId = shuffledPlayers[0].id;
        imposterIds = shuffledPlayers.slice(1, 2).map(p => p.id); // 1 healer + 1 imposter
        break;
      default:
        imposterIds = shuffledPlayers.slice(0, settings.numberOfImposters).map(p => p.id);
    }

    // Update players with roles
    const updatedPlayers = players.map(p => ({
      ...p,
      isImposter: activeMode === 'roles-switched' 
        ? !imposterIds.includes(p.id) && p.id !== jesterId && p.id !== detectiveId && p.id !== healerId
        : imposterIds.includes(p.id),
    }));
    setPlayers(updatedPlayers);

    setGameState({
      phase: 'viewing-cards',
      currentPlayerIndex: 0,
      selectedWord: activeMode === 'roles-switched' ? randomWord.hint : randomWord.word,
      selectedWord2: randomWord2?.word,
      selectedHint: settings.hintEnabled ? (activeMode === 'roles-switched' ? randomWord.word : randomWord.hint) : '',
      selectedHint2: randomWord2?.hint,
      imposters: imposterIds,
      jesterId,
      detectiveId,
      healerId,
      activeGameMode: activeMode,
      votes: {},
    });

    setCardFlipped(false);
    toast.success(`Spel gestart! Mode: ${gameModeLabels[activeMode]}`);
  };

  const nextPlayer = () => {
    if (!cardFlipped) {
      toast.error("Laat de huidige speler eerst hun kaart bekijken!");
      return;
    }

    if (gameState.currentPlayerIndex < players.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentPlayerIndex: prev.currentPlayerIndex + 1,
      }));
      setCardFlipped(false);
    } else {
      setGameState(prev => ({ ...prev, phase: 'discussion' }));
      toast.success("Alle spelers hebben hun kaart gezien! Start de discussie.");
    }
  };

  const handleVote = (votedPlayerId: string) => {
    setGameState(prev => ({
      ...prev,
      votes: {
        ...prev.votes,
        [players[gameState.currentPlayerIndex].id]: votedPlayerId,
      },
    }));
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, phase: 'results' }));
  };

  const resetGame = () => {
    setGameState({
      phase: 'lobby',
      currentPlayerIndex: 0,
      selectedWord: '',
      selectedHint: '',
      imposters: [],
      activeGameMode: 'normal',
      votes: {},
      detectiveId: undefined,
      healerId: undefined,
      killedPlayerId: undefined,
    });
    setCardFlipped(false);
    setPlayers(players.map(p => ({ ...p, isImposter: undefined })));
  };

  const currentPlayer = players[gameState.currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-bg transition-colors duration-300">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Who? 🎭
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            {gameState.phase !== 'lobby' && (
              <Dialog>
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
              </Dialog>
            )}
          </div>
        </div>

        {/* Lobby Phase */}
        {gameState.phase === 'lobby' && (
          <div className="space-y-8 animate-fade-in">
            {/* Settings */}
            <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <SettingsIcon className="h-6 w-6" />
                Instellingen
              </h2>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="timer">Timer</Label>
                    <Switch
                      id="timer"
                      checked={settings.timerEnabled}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, timerEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hints">Hints</Label>
                    <Switch
                      id="hints"
                      checked={settings.hintEnabled}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, hintEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imposters">Aantal Imposters: {settings.numberOfImposters}</Label>
                    <Input
                      id="imposters"
                      type="number"
                      min="1"
                      max={Math.max(1, players.length - 1)}
                      value={settings.numberOfImposters}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          numberOfImposters: parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>
                  {settings.timerEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="timer-length">Timer Lengte (seconden): {settings.timerLength}</Label>
                      <Input
                        id="timer-length"
                        type="number"
                        min="30"
                        max="900"
                        step="30"
                        value={settings.timerLength}
                        onChange={(e) =>
                          setSettings(prev => ({
                            ...prev,
                            timerLength: parseInt(e.target.value) || 300,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Game Modes */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">🎮 Game Modes</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="randomize" className="text-sm">Randomize</Label>
                      <Switch
                        id="randomize"
                        checked={settings.randomizeGameModes}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, randomizeGameModes: checked }))
                        }
                      />
                    </div>
                  </div>

                  {/* Normal/Special Tabs */}
                  <div className="flex gap-2 p-1 bg-muted rounded-lg">
                    <Button
                      variant={gameModeTab === 'normal' ? 'default' : 'ghost'}
                      className="flex-1"
                      onClick={() => setGameModeTab('normal')}
                    >
                      Normal
                    </Button>
                    <Button
                      variant={gameModeTab === 'special' ? 'default' : 'ghost'}
                      className="flex-1"
                      onClick={() => setGameModeTab('special')}
                    >
                      Special
                    </Button>
                  </div>

                  <div className="grid gap-3 animate-fade-in">
                    {(gameModeTab === 'normal' ? normalGameModes : specialGameModes).map((mode) => (
                      <div
                        key={mode}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                          settings.gameModes.includes(mode)
                            ? "border-primary bg-primary/5"
                            : "border-border bg-muted/30 hover:bg-muted/50"
                        )}
                        onClick={() => toggleGameMode(mode)}
                      >
                        <Checkbox
                          checked={settings.gameModes.includes(mode)}
                          onCheckedChange={() => toggleGameMode(mode)}
                        />
                        <span className="font-medium flex-1">{gameModeLabels[mode]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Players */}
            <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">👥 Spelers ({players.length})</h2>
                <Button onClick={addPlayer} size="sm" className="rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Speler Toevoegen
                </Button>
              </div>
              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPlayer(player)}
                        >
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
                            <Input
                              id="player-name"
                              value={editingPlayer?.name || ''}
                              onChange={(e) =>
                                setEditingPlayer(prev =>
                                  prev ? { ...prev, name: e.target.value } : null
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="player-color">Kleur</Label>
                            <Input
                              id="player-color"
                              type="color"
                              value={editingPlayer?.color || '#8B5CF6'}
                              onChange={(e) =>
                                setEditingPlayer(prev =>
                                  prev ? { ...prev, color: e.target.value } : null
                                )
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => removePlayer(player.id)}
                          >
                            Verwijderen
                          </Button>
                          <Button
                            onClick={() => {
                              if (editingPlayer) {
                                updatePlayer(editingPlayer.id, {
                                  name: editingPlayer.name,
                                  color: editingPlayer.color,
                                });
                                setEditingPlayer(null);
                              }
                            }}
                          >
                            Opslaan
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-card rounded-2xl shadow-card p-6 border border-border max-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="text-2xl font-bold">📂 Categorieën</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Woorden Bekijken
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Woorden per Categorie</DialogTitle>
                    </DialogHeader>
                    {!hintUnlocked ? (
                      <div className="space-y-4 p-6">
                        <p className="text-muted-foreground">Voer de code in om hints te bekijken:</p>
                        <Input
                          type="password"
                          placeholder="Code"
                          value={hintPassword}
                          onChange={(e) => setHintPassword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && hintPassword === HINT_PASSWORD) {
                              setHintUnlocked(true);
                              toast.success("Hints ontgrendeld!");
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            if (hintPassword === HINT_PASSWORD) {
                              setHintUnlocked(true);
                              toast.success("Hints ontgrendeld!");
                            } else {
                              toast.error("Onjuiste code!");
                            }
                          }}
                          className="w-full"
                        >
                          Ontgrendelen
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                        {defaultCategories.map((category) => (
                          <div key={category.name} className="space-y-2">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                              onClick={() => setViewingCategory(
                                viewingCategory?.name === category.name ? null : category
                              )}
                            >
                              <span className="mr-2">{category.emoji}</span>
                              {category.name}
                            </Button>
                            {viewingCategory?.name === category.name && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-4 animate-accordion-down">
                                {category.words.map((word, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-muted rounded-lg text-sm"
                                  >
                                    <div className="font-medium">{word.word}</div>
                                    <div className="text-xs text-muted-foreground">
                                      Hint: {word.hint}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid gap-3 md:grid-cols-2 overflow-y-auto flex-1">
                {defaultCategories.map((category) => (
                  <div
                    key={category.name}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                      selectedCategories.includes(category.name)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/30 hover:bg-muted/50"
                    )}
                    onClick={() => toggleCategory(category.name)}
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => toggleCategory(category.name)}
                    />
                    <span className="text-2xl">{category.emoji}</span>
                    <span className="font-medium flex-1">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 pt-4 bg-gradient-bg">
              <Button
                onClick={startGame}
                size="lg"
                className="w-full text-lg h-14 rounded-2xl shadow-lg"
              >
                🎮 Start Spel
              </Button>
            </div>
          </div>
        )}

        {/* Viewing Cards Phase */}
        {gameState.phase === 'viewing-cards' && currentPlayer && (
          <div className="space-y-6 animate-scale-in">
            {/* Special Gamemode Warning */}
            {specialGameModes.includes(gameState.activeGameMode) && (
              <div className="bg-destructive/10 border-2 border-destructive rounded-2xl p-6 text-center animate-pulse">
                <p className="text-xl font-bold text-destructive mb-2">⚠️ SPECIAL GAMEMODE ACTIVE ⚠️</p>
                <p className="text-lg font-semibold">{gameModeLabels[gameState.activeGameMode]}</p>
              </div>
            )}

            <GameCard
              content={gameState.selectedWord}
              content2={gameState.selectedWord2}
              hint={gameState.selectedHint}
              isImposter={currentPlayer.isImposter || false}
              isJester={currentPlayer.id === gameState.jesterId}
              showHintToInnocents={gameState.activeGameMode === 'innocents-see-hint'}
              onFlipComplete={() => setCardFlipped(true)}
              playerName={currentPlayer.name}
            />

            <Button
              onClick={nextPlayer}
              disabled={!cardFlipped}
              size="lg"
              className="w-full text-lg h-14 rounded-2xl"
            >
              {gameState.currentPlayerIndex < players.length - 1
                ? `➡️ Volgende Speler`
                : `🎯 Start Discussie`}
            </Button>

            <div className="flex justify-center gap-2">
              {players.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    idx === gameState.currentPlayerIndex
                      ? "bg-primary scale-125"
                      : idx < gameState.currentPlayerIndex
                      ? "bg-success"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Discussion Phase */}
        {gameState.phase === 'discussion' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-2xl shadow-card p-8 text-center border border-border">
              <h2 className="text-3xl font-bold mb-4">💬 Discussie Tijd!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Bespreek wie jullie denken dat de imposter(s) {settings.numberOfImposters > 1 ? 'zijn' : 'is'}
              </p>
              {settings.timerEnabled && (
                <div className="text-4xl font-bold text-primary mb-4">
                  {Math.floor(settings.timerLength / 60)}:{(settings.timerLength % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>

            <Button
              onClick={endGame}
              size="lg"
              className="w-full text-lg h-14 rounded-2xl"
            >
              🗳️ Naar Stemmen
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
                    {players
                      .filter(p => gameState.imposters.includes(p.id))
                      .map(imposter => (
                        <div key={imposter.id} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: imposter.color }}
                          />
                          <span className="text-xl font-bold">{imposter.name}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {gameState.jesterId && (
                  <div className="p-4 bg-warning/10 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">De Jester was:</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: players.find(p => p.id === gameState.jesterId)?.color }}
                      />
                      <span className="text-xl font-bold">
                        {players.find(p => p.id === gameState.jesterId)?.name}
                      </span>
                    </div>
                  </div>
                )}

                {gameState.detectiveId && (
                  <div className="p-4 bg-blue-500/10 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">De Detective was:</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: players.find(p => p.id === gameState.detectiveId)?.color }}
                      />
                      <span className="text-xl font-bold">
                        {players.find(p => p.id === gameState.detectiveId)?.name}
                      </span>
                    </div>
                  </div>
                )}

                {gameState.healerId && (
                  <div className="p-4 bg-green-500/10 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">De Healer was:</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: players.find(p => p.id === gameState.healerId)?.color }}
                      />
                      <span className="text-xl font-bold">
                        {players.find(p => p.id === gameState.healerId)?.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Game Mode:</p>
                  <p className="text-lg font-bold">{gameModeLabels[gameState.activeGameMode]}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={resetGame}
                  variant="outline"
                  size="lg"
                  className="flex-1 text-lg h-14 rounded-2xl"
                >
                  🏠 Terug naar Lobby
                </Button>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="flex-1 text-lg h-14 rounded-2xl"
                >
                  🔄 Nieuwe Ronde
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
