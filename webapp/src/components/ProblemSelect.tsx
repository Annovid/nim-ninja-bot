import { problems } from "../content";
import type { Progress } from "../lib/storage";
import { Button, Screen } from "./Layout";

export const ProblemSelect = ({
  progress,
  onPick,
  onRules,
  onSolution,
  onBack,
}: {
  progress: Progress;
  onPick: (id: string) => void;
  onRules: () => void;
  onSolution: () => void;
  onBack: () => void;
}) => (
  <Screen title="Ним">
    <p className="hint">В скобках указаны начальные позиции</p>
    <div className="stack">
      {problems.map((p) => {
        const wins = progress[p.id]?.wins ?? 0;
        return (
          <Button key={p.id} onClick={() => onPick(p.id)}>
            <span>{p.label}</span>
            {wins > 0 && <span className="badge">✓ {wins}</span>}
          </Button>
        );
      })}
      <Button variant="ghost" onClick={onRules}>Правила</Button>
      <Button variant="ghost" onClick={onSolution}>Общее решение</Button>
      <Button variant="ghost" onClick={onBack}>Вернуться</Button>
    </div>
  </Screen>
);
