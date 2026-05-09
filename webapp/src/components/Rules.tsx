import { Button, Screen } from "./Layout";

const Pile = ({ count, highlight }: { count: number; highlight?: number }) => (
  <div className="rules-pile">
    {Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        className={`rules-clip ${highlight !== undefined && i >= count - highlight ? "rules-clip-take" : ""}`}
      >
        📎
      </span>
    ))}
  </div>
);

const Board = ({ rows }: { rows: { count: number; highlight?: number }[] }) => (
  <div className="rules-board">
    {rows.map((r, i) => (
      <div key={i} className="rules-board-row">
        <span className="rules-board-num">{i + 1}</span>
        <Pile count={r.count} highlight={r.highlight} />
      </div>
    ))}
  </div>
);

export const Rules = ({ onBack }: { onBack: () => void }) => (
  <Screen title="Правила игры">
    <section className="rules-section">
      <h2 className="rules-h">🎯 Цель</h2>
      <p className="rules-p">
        Ним — математическая игра для двух игроков. Перед вами несколько кучек предметов
        (в нашем случае — скрепок 📎). Выигрывает тот, кто заберёт последний предмет.
      </p>
    </section>

    <section className="rules-section">
      <h2 className="rules-h">🃏 Игровое поле</h2>
      <p className="rules-p">
        Поле — это несколько кучек разного размера. Например, начальная позиция (2, 3, 4):
      </p>
      <Board rows={[{ count: 2 }, { count: 3 }, { count: 4 }]} />
    </section>

    <section className="rules-section">
      <h2 className="rules-h">🎮 Как ходить</h2>
      <p className="rules-p">
        За один ход вы выбираете <b>одну</b> кучку и берёте из неё <b>любое количество</b>{" "}
        предметов (хотя бы один — пас невозможен). Игроки ходят по очереди.
      </p>
      <p className="rules-p rules-hint">
        В приложении: коснитесь скрепки в кучке — все скрепки справа от неё (включая её)
        будут отмечены красным. Нажмите «Сделать ход», чтобы подтвердить.
      </p>

      <div className="rules-step">
        <div className="rules-step-label">До хода:</div>
        <Board rows={[{ count: 2 }, { count: 3, highlight: 2 }, { count: 4 }]} />
        <div className="rules-arrow">↓ берём 2 из кучки 2</div>
        <div className="rules-step-label">После:</div>
        <Board rows={[{ count: 2 }, { count: 1 }, { count: 4 }]} />
      </div>
    </section>

    <section className="rules-section">
      <h2 className="rules-h">🏆 Победа</h2>
      <p className="rules-p">
        Если после вашего хода на поле не осталось предметов — поздравляем, вы взяли
        последний и победили!
      </p>
      <Board rows={[{ count: 0 }, { count: 0 }, { count: 0 }]} />
    </section>

    <Button variant="ghost" onClick={onBack}>Вернуться</Button>
  </Screen>
);
