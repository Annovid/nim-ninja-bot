import { useEffect, useState } from "react";
import {
  applyMove,
  computeBotMove,
  isTerminal,
  validateMove,
  type Move,
  type Position,
} from "../lib/nim";
import { haptic } from "../lib/telegram";
import { loadProgress, recordWin, saveProgress, type Progress } from "../lib/storage";
import { Button, Screen } from "./Layout";

type Outcome = "win" | "loss" | null;

type Problem = { id: string; label: string; position: number[] };

const BOT_DELAY_MS = 700;

export const Game = ({
  problem,
  onWin,
  onLeave,
}: {
  problem: Problem;
  onWin: (p: Progress) => void;
  onLeave: () => void;
}) => {
  const [position, setPosition] = useState<Position>(() => problem.position.slice());
  const [pending, setPending] = useState<Move | null>(null);
  const [lastBotMove, setLastBotMove] = useState<Move | null>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [botThinking, setBotThinking] = useState(false);

  const turnLocked = botThinking || outcome !== null;

  const reset = () => {
    setPosition(problem.position.slice());
    setPending(null);
    setLastBotMove(null);
    setOutcome(null);
    setBotThinking(false);
  };

  useEffect(() => { reset(); }, [problem.id]);

  const onClipTap = (row: number, clipIndex: number) => {
    if (turnLocked) return;
    const total = position[row];
    const count = total - clipIndex;
    if (count < 1) return;
    haptic("select");
    if (pending && pending.row === row && pending.count === count) {
      submit({ row, count });
    } else {
      setPending({ row, count });
    }
  };

  const submit = (move: Move) => {
    if (turnLocked) return;
    if (!validateMove(position, move)) {
      haptic("error");
      return;
    }
    haptic("tap");
    const afterUser = applyMove(position, move);
    setPosition(afterUser);
    setPending(null);
    setLastBotMove(null);

    if (isTerminal(afterUser)) {
      finish("win");
      return;
    }

    setBotThinking(true);
    setTimeout(() => {
      const botMove = computeBotMove(afterUser);
      const afterBot = applyMove(afterUser, botMove);
      setPosition(afterBot);
      setLastBotMove(botMove);
      setBotThinking(false);
      if (isTerminal(afterBot)) finish("loss");
    }, BOT_DELAY_MS);
  };

  const finish = (result: Outcome) => {
    setOutcome(result);
    if (result === "win") {
      haptic("success");
      loadProgress().then((p) => {
        const updated = recordWin(p, problem.id);
        saveProgress(updated);
        onWin(updated);
      });
    } else {
      haptic("error");
    }
  };

  const turnPill = botThinking
    ? { text: "Ход бота…", className: "pill pill-bot" }
    : outcome === "win"
    ? { text: "Победа!", className: "pill pill-win" }
    : outcome === "loss"
    ? { text: "Поражение", className: "pill pill-loss" }
    : { text: "Ваш ход", className: "pill pill-user" };

  return (
    <Screen>
      <div className="game-header">
        <div className="game-title">{problem.label}</div>
        <div className={turnPill.className}>{turnPill.text}</div>
      </div>

      {lastBotMove && !outcome && !botThinking && (
        <div className="bot-msg">
          Бот взял <b>{lastBotMove.count}</b> из кучки <b>{lastBotMove.row + 1}</b>
        </div>
      )}

      <div className="board">
        {position.map((n, row) => {
          const isHighlighted = pending?.row === row;
          const pendingCount = isHighlighted ? pending.count : 0;
          return (
            <div key={row} className={`row ${n === 0 ? "row-empty" : ""}`}>
              <div className="row-num">{row + 1}</div>
              <div className="row-objects">
                {Array.from({ length: n }, (_, i) => {
                  const willRemove = isHighlighted && i >= n - pendingCount;
                  return (
                    <button
                      key={i}
                      className={`clip ${willRemove ? "clip-pending" : ""}`}
                      disabled={turnLocked || n === 0}
                      onClick={() => onClipTap(row, i)}
                      aria-label={`Кучка ${row + 1}, предмет ${i + 1}`}
                    >
                      📎
                    </button>
                  );
                })}
                {n === 0 && <span className="empty-mark">пусто</span>}
              </div>
            </div>
          );
        })}
      </div>

      {pending && !outcome && (
        <div className="pending-bar">
          <div className="pending-text">
            Взять <b>{pending.count}</b> из кучки <b>{pending.row + 1}</b>?
          </div>
          <div className="pending-actions">
            <Button variant="ghost" onClick={() => { haptic("tap"); setPending(null); }}>
              Отмена
            </Button>
            <Button onClick={() => submit(pending)}>Сделать ход</Button>
          </div>
        </div>
      )}

      {!pending && !outcome && !botThinking && (
        <p className="hint">Нажмите на скрепку — все скрепки справа от неё будут взяты.</p>
      )}

      {outcome === "win" && (
        <div className="banner banner-win">
          <div className="banner-emoji">🎉</div>
          <div className="banner-title">Поздравляю, вы победили!</div>
          <div className="banner-actions">
            <Button onClick={reset}>Сыграть ещё раз</Button>
            <Button variant="ghost" onClick={onLeave}>К списку задач</Button>
          </div>
        </div>
      )}

      {outcome === "loss" && (
        <div className="banner banner-loss">
          <div className="banner-emoji">🤖</div>
          <div className="banner-title">Я победил. Попробуйте ещё.</div>
          <div className="banner-actions">
            <Button onClick={reset}>Попробовать снова</Button>
            <Button variant="ghost" onClick={onLeave}>К списку задач</Button>
          </div>
        </div>
      )}
    </Screen>
  );
};
