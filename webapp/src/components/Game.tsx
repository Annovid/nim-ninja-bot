import { useEffect, useMemo, useState } from "react";
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

const BOT_DELAY_MS = 600;

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
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [count, setCount] = useState(1);
  const [log, setLog] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [botThinking, setBotThinking] = useState(false);

  const turnLocked = botThinking || outcome !== null;

  const reset = () => {
    setPosition(problem.position.slice());
    setSelectedRow(null);
    setCount(1);
    setLog([]);
    setOutcome(null);
    setBotThinking(false);
  };

  useEffect(() => { reset(); }, [problem.id]);

  const selectRow = (row: number) => {
    if (turnLocked) return;
    if (position[row] === 0) return;
    haptic("select");
    setSelectedRow(row);
    setCount(1);
  };

  const submit = () => {
    if (selectedRow === null || turnLocked) return;
    const move: Move = { row: selectedRow, count };
    if (!validateMove(position, move)) {
      haptic("error");
      return;
    }
    haptic("tap");
    const afterUser = applyMove(position, move);
    setPosition(afterUser);
    setLog((l) => [...l, `Вы: кучка ${move.row + 1}, взяли ${move.count}`]);
    setSelectedRow(null);
    setCount(1);

    if (isTerminal(afterUser)) {
      finish("win", afterUser);
      return;
    }

    setBotThinking(true);
    setTimeout(() => {
      const botMove = computeBotMove(afterUser);
      const afterBot = applyMove(afterUser, botMove);
      setPosition(afterBot);
      setLog((l) => [...l, `Бот: кучка ${botMove.row + 1}, взял ${botMove.count}`]);
      setBotThinking(false);
      if (isTerminal(afterBot)) finish("loss", afterBot);
    }, BOT_DELAY_MS);
  };

  const finish = (result: Outcome, _final: Position) => {
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

  const maxCount = selectedRow !== null ? position[selectedRow] : 0;
  const counts = useMemo(
    () => Array.from({ length: maxCount }, (_, i) => i + 1),
    [maxCount],
  );

  return (
    <Screen title={problem.label}>
      <div className="board">
        {position.map((n, row) => (
          <button
            key={row}
            className={`row ${selectedRow === row ? "row-selected" : ""} ${n === 0 ? "row-empty" : ""}`}
            onClick={() => selectRow(row)}
            disabled={turnLocked || n === 0}
          >
            <span className="row-num">{row + 1})</span>
            <span className="row-objects">
              {Array.from({ length: n }, (_, i) => (
                <span key={i} className="clip">📎</span>
              ))}
              {n === 0 && <span className="empty-mark">—</span>}
            </span>
          </button>
        ))}
      </div>

      {selectedRow !== null && outcome === null && (
        <div className="counts">
          <div className="counts-label">Сколько взять из кучки {selectedRow + 1}?</div>
          <div className="counts-row">
            {counts.map((c) => (
              <button
                key={c}
                className={`count ${count === c ? "count-selected" : ""}`}
                onClick={() => { haptic("select"); setCount(c); }}
                disabled={turnLocked}
              >
                {c}
              </button>
            ))}
          </div>
          <Button onClick={submit} disabled={turnLocked}>Сделать ход</Button>
        </div>
      )}

      {botThinking && <div className="status">Бот думает…</div>}

      {outcome === "win" && (
        <div className="banner banner-win">
          <div>Поздравляю, вы победили!</div>
          <div className="row-actions">
            <Button onClick={reset}>Ещё раз</Button>
            <Button variant="ghost" onClick={onLeave}>Вернуться</Button>
          </div>
        </div>
      )}
      {outcome === "loss" && (
        <div className="banner banner-loss">
          <div>Я победил.</div>
          <div className="row-actions">
            <Button onClick={reset}>Ещё раз</Button>
            <Button variant="ghost" onClick={onLeave}>Вернуться</Button>
          </div>
        </div>
      )}

      {log.length > 0 && (
        <details className="log">
          <summary>История ходов</summary>
          <ol>
            {log.map((entry, i) => <li key={i}>{entry}</li>)}
          </ol>
        </details>
      )}
    </Screen>
  );
};
