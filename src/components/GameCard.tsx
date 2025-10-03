import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  content: string;
  content2?: string;
  hint?: string;
  isImposter: boolean;
  isJester?: boolean;
  isDetective?: boolean;
  isHealer?: boolean;
  showHintToInnocents?: boolean;
  onFlipComplete: () => void;
  playerName: string;
}

export const GameCard = ({ content, content2, hint, isImposter, isJester, isDetective, isHealer, showHintToInnocents, onFlipComplete, playerName }: GameCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [wasFlipped, setWasFlipped] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    if (isFlipped && !isHolding) {
      setWasFlipped(true);
      onFlipComplete();
    }
  }, [isFlipped, isHolding, onFlipComplete]);

  const handleStart = () => {
    setIsHolding(true);
    setIsFlipped(true);
  };

  const handleEnd = () => {
    setIsHolding(false);
    setTimeout(() => setIsFlipped(false), 100);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground">{playerName}</h2>
        <p className="text-muted-foreground">Houd de kaart ingedrukt om te bekijken</p>
      </div>

      <div
        className={cn(
          "relative w-80 h-96 cursor-pointer select-none transition-transform duration-200 active:scale-95",
          "preserve-3d"
        )}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        style={{ perspective: "1000px" }}
      >
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-600 preserve-3d",
            isFlipped && "rotate-y-180"
          )}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Card Back */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden rounded-2xl",
              "bg-gradient-card shadow-card border-2 border-primary/20",
              "flex items-center justify-center"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center space-y-4">
              <div className="text-6xl">🎴</div>
              <div className="text-xl font-bold text-white">Who?</div>
            </div>
          </div>

          {/* Card Front */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden rounded-2xl",
              "bg-card shadow-card border-2 border-primary/20",
              "flex items-center justify-center p-8"
            )}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center space-y-6">
              {isJester ? (
                <>
                  <div className="text-6xl animate-pulse-glow">🃏</div>
                  <div className="space-y-3">
                    <h3 className="text-4xl font-bold text-warning">JESTER</h3>
                    <p className="text-lg text-muted-foreground">Zorg dat je wordt uitgestemd!</p>
                    {hint && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Hint:</p>
                        <p className="text-2xl font-semibold text-foreground">{hint}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : isImposter ? (
                <>
                  <div className="text-6xl animate-pulse-glow">👻</div>
                  <div className="space-y-3">
                    <h3 className="text-4xl font-bold text-destructive">IMPOSTER</h3>
                    {hint && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Hint:</p>
                        <p className="text-2xl font-semibold text-foreground">{hint}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl">{isDetective ? '🔍' : isHealer ? '💚' : '✨'}</div>
                  <div className="space-y-3">
                    {isDetective && (
                      <div className="bg-blue-500/20 rounded-lg p-3 mb-2">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">🔍 DETECTIVE</p>
                        <p className="text-sm text-muted-foreground">Je stem telt 2x</p>
                      </div>
                    )}
                    {isHealer && (
                      <div className="bg-green-500/20 rounded-lg p-3 mb-2">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">💚 HEALER</p>
                        <p className="text-sm text-muted-foreground">Je kunt 1x iemand reviven</p>
                      </div>
                    )}
                    <div className="bg-primary/10 rounded-lg p-6">
                      <p className="text-3xl font-bold text-foreground">{content}</p>
                      {content2 && (
                        <p className="text-2xl font-bold text-foreground mt-2">{content2}</p>
                      )}
                    </div>
                    {hint && showHintToInnocents && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Hint:</p>
                        <p className="text-xl font-semibold text-foreground">{hint}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {wasFlipped && !isFlipped && (
        <div className="text-center text-success font-medium animate-fade-in">
          ✓ Kaart bekeken
        </div>
      )}
    </div>
  );
};
