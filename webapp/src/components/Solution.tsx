import { Button, Screen } from "./Layout";

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="sol-code">{children}</code>
);

const TinyGraph = () => (
  <svg viewBox="0 0 320 100" className="sol-graph" aria-label="Пример графа: одна кучка из двух предметов">
    <defs>
      <marker id="sol-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
      </marker>
    </defs>
    <line x1="73" y1="60" x2="138" y2="60" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow)" />
    <line x1="183" y1="60" x2="248" y2="60" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow)" />
    <path d="M 60 42 Q 160 -5 260 42" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow)" />
    <g className="graph-node"><circle cx="50" cy="60" r="22" /><text x="50" y="65" textAnchor="middle">(2)</text></g>
    <g className="graph-node"><circle cx="160" cy="60" r="22" /><text x="160" y="65" textAnchor="middle">(1)</text></g>
    <g className="graph-node graph-terminal"><circle cx="270" cy="60" r="22" /><text x="270" y="65" textAnchor="middle">(0)</text></g>
  </svg>
);

const Graph21 = () => (
  <svg viewBox="0 0 360 380" className="sol-graph" aria-label="Граф позиций, достижимых из (2, 1), с раскраской L/W">
    <defs>
      <marker id="sol-arrow-21" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
      </marker>
    </defs>
    <line x1="163" y1="59" x2="117" y2="111" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow-21)" />
    <line x1="197" y1="59" x2="243" y2="111" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow-21)" />
    <line x1="170" y1="64" x2="110" y2="216" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow-21)" />
    <line x1="100" y1="156" x2="100" y2="214" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow-21)" />
    <line x1="121" y1="145" x2="239" y2="225" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow-21)" />
    <line x1="260" y1="156" x2="260" y2="214" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow-21)" />
    <line x1="251" y1="154" x2="189" y2="316" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow-21)" />
    <line x1="116" y1="260" x2="164" y2="320" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow-21)" />
    <line x1="244" y1="260" x2="196" y2="320" stroke="currentColor" strokeWidth="2" markerEnd="url(#sol-arrow-21)" />
    <g className="graph-node graph-W"><circle cx="180" cy="40" r="26" /><text x="180" y="38" textAnchor="middle">(2,1)</text><text x="180" y="55" textAnchor="middle" className="tag">W</text></g>
    <g className="graph-node graph-L"><circle cx="100" cy="130" r="26" /><text x="100" y="128" textAnchor="middle">(1,1)</text><text x="100" y="145" textAnchor="middle" className="tag">L</text></g>
    <g className="graph-node graph-W"><circle cx="260" cy="130" r="26" /><text x="260" y="128" textAnchor="middle">(2,0)</text><text x="260" y="145" textAnchor="middle" className="tag">W</text></g>
    <g className="graph-node graph-W"><circle cx="100" cy="240" r="26" /><text x="100" y="238" textAnchor="middle">(0,1)</text><text x="100" y="255" textAnchor="middle" className="tag">W</text></g>
    <g className="graph-node graph-W"><circle cx="260" cy="240" r="26" /><text x="260" y="238" textAnchor="middle">(1,0)</text><text x="260" y="255" textAnchor="middle" className="tag">W</text></g>
    <g className="graph-node graph-L"><circle cx="180" cy="340" r="26" /><text x="180" y="338" textAnchor="middle">(0,0)</text><text x="180" y="355" textAnchor="middle" className="tag">L</text></g>
  </svg>
);

export const Solution = ({ onBack }: { onBack: () => void }) => (
  <Screen title="Общее решение">
    <section className="rules-section">
      <h2 className="rules-h">📈 Игра как граф состояний</h2>
      <p className="rules-p">
        Удобно представлять всю партию как карту. Каждый возможный расклад на столе —
        это <b>точка</b> на этой карте. Например, начало задачи 1 — точка{" "}
        <Code>(2, 3, 4)</Code>: в первой кучке две скрепки, во второй три, в третьей
        четыре. Любой ход переносит нас в другую точку — скажем, после «взять 2 из
        кучки 2» окажемся в <Code>(2, 1, 4)</Code>.
      </p>
      <p className="rules-p">
        Если для каждой точки нарисовать <b>стрелки</b> во все точки, в которые можно
        перейти за один корректный ход, получится <b>граф</b>. Партия — это путь по
        этому графу: ваш ход → ход бота → ваш ход → … И каждый шаг идёт ровно по одной
        стрелке.
      </p>
      <p className="rules-p">
        В графе есть особая точка — <Code>(0, 0, …, 0)</Code>, когда все кучки пустые.
        Из неё стрелок не выходит: брать нечего. По правилам тот игрок, чья очередь
        ходить в этот момент, уже проиграл — последнюю скрепку забрал противник.
        Назовём её <b>тупиковой</b>.
      </p>
      <p className="rules-p">
        Чтобы наглядно увидеть граф, возьмём совсем маленький пример: одна кучка из
        двух скрепок, позиция <Code>(2)</Code>. Из неё два хода: «взять 1» ведёт в{" "}
        <Code>(1)</Code>, «взять 2» — сразу в <Code>(0)</Code>. Из <Code>(1)</Code>
        возможен только один ход → <Code>(0)</Code>. Картинка получится такой:
      </p>
      <TinyGraph />
      <p className="rules-p rules-hint">
        Серая вершина <Code>(0)</Code> — тупик. Кто оказался в ней — проиграл. В
        реальной задаче вроде <Code>(2, 3, 4)</Code> вершин и стрелок намного больше,
        но логика та же: партия — путь от стартовой точки до тупика.
      </p>
    </section>

    <section className="rules-section">
      <h2 className="rules-h">🎨 Двухцветная разметка</h2>
      <p className="rules-p">
        Покрасим каждую вершину в один из двух цветов: <b>L</b> (losing — проигрышная для
        того, чей ход) или <b>W</b> (winning — выигрышная). Будем называть разметку{" "}
        <b>правильной</b>, если выполнены три условия:
      </p>
      <ol className="sol-list">
        <li>Терминальная вершина окрашена в <b>L</b>.</li>
        <li>Из любой <b>W</b>-вершины есть хотя бы одно ребро в <b>L</b>-вершину.</li>
        <li>Из любой <b>L</b>-вершины <i>все</i> рёбра ведут в <b>W</b>-вершины.</li>
      </ol>
      <p className="rules-p">
        <b>Утверждение.</b> Если правильная разметка существует, она единственна, и она{" "}
        <i>решает</i> игру: при оптимальной игре игрок в <b>W</b>-позиции выигрывает,
        в <b>L</b>-позиции — проигрывает.
      </p>
      <p className="rules-p rules-hint">
        Стратегия очевидна: из <b>W</b> делайте ход в <b>L</b> (он существует по свойству 2);
        противник окажется в <b>L</b>, и любой его ход уведёт в <b>W</b> (свойство 3),
        откуда вы снова найдёте ход в <b>L</b>. Так продолжается до терминальной позиции,
        в которой проигрывает противник.
      </p>
    </section>

    <section className="rules-section">
      <h2 className="rules-h">🎯 Пример: раскраска (2, 1)</h2>
      <p className="rules-p">
        Применим правила к небольшой, но уже нетривиальной позиции — двум кучкам{" "}
        <Code>(2, 1)</Code>. Разрешено за ход уменьшить любую <i>одну</i> кучку
        на положительное число. Из <Code>(2, 1)</Code> достижимы шесть позиций:{" "}
        <Code>(2,1)</Code>, <Code>(1,1)</Code>, <Code>(2,0)</Code>,{" "}
        <Code>(0,1)</Code>, <Code>(1,0)</Code>, <Code>(0,0)</Code>. Перечислим
        все рёбра:
      </p>
      <ul className="sol-list">
        <li><Code>(2,1)</Code> → <Code>(1,1)</Code>, <Code>(0,1)</Code>, <Code>(2,0)</Code></li>
        <li><Code>(1,1)</Code> → <Code>(0,1)</Code>, <Code>(1,0)</Code></li>
        <li><Code>(2,0)</Code> → <Code>(1,0)</Code>, <Code>(0,0)</Code></li>
        <li><Code>(0,1)</Code> → <Code>(0,0)</Code></li>
        <li><Code>(1,0)</Code> → <Code>(0,0)</Code></li>
      </ul>
      <Graph21 />
      <p className="rules-p">
        Раскраску строим <b>обратной индукцией</b> — снизу вверх, от тупика. На
        каждом шаге смотрим только на уже окрашенных потомков и применяем три
        правила из предыдущего раздела:
      </p>
      <ol className="sol-list">
        <li>
          <Code>(0,0)</Code> — тупик (нет исходящих рёбер). По правилу 1 это{" "}
          <b>L</b>: ходить нечем, текущий игрок проиграл.
        </li>
        <li>
          <Code>(0,1)</Code> и <Code>(1,0)</Code> — единственный ход в каждой
          ведёт в <Code>(0,0)</Code>, то есть в <b>L</b>. По правилу 2 обе
          позиции — <b>W</b>.
        </li>
        <li>
          <Code>(2,0)</Code> — есть ход в <Code>(0,0)</Code> [<b>L</b>], значит{" "}
          <b>W</b>. (Второй ход ведёт в <Code>(1,0)</Code> [<b>W</b>], но для
          правила 2 достаточно <i>одного</i> ребра в L.)
        </li>
        <li>
          <Code>(1,1)</Code> — ходы только в <Code>(0,1)</Code> и{" "}
          <Code>(1,0)</Code>, и оба потомка — <b>W</b>. <i>Все</i> рёбра ведут
          в W → по правилу 3 это <b>L</b>: какой ход ни сделай, отдашь
          сопернику выигрышную позицию.
        </li>
        <li>
          <Code>(2,1)</Code> — среди потомков есть <Code>(1,1)</Code> [<b>L</b>],
          поэтому <b>W</b>. Это и есть выигрывающий первый ход:{" "}
          <i>уравнять кучки</i>, перейдя в <Code>(1,1)</Code>. Любой другой ход
          ((2,1)→(0,1) или (2,1)→(2,0)) подарит сопернику ту же возможность.
        </li>
      </ol>
      <p className="rules-p rules-hint">
        Стратегия первого игрока на этом графе: ход в <Code>(1,1)</Code>. Дальше
        соперник из L вынужден уйти в W (в <Code>(0,1)</Code> или{" "}
        <Code>(1,0)</Code>), оттуда первый возвращает его в L —{" "}
        <Code>(0,0)</Code> — и партия закончена. Шесть вершин, девять рёбер,
        две L-позиции — ровно те, у которых кучки совпадают.
      </p>
    </section>

    <section className="rules-section">
      <h2 className="rules-h">⚙️ Что такое XOR</h2>
      <p className="rules-p">
        XOR (исключающее «или», обозначается <Code>⊕</Code>) — побитовая операция:
        каждый бит результата равен 1, если ровно один из соответствующих битов
        операндов равен 1. Иначе — 0.
      </p>
      <div className="sol-xor-table">
        <div><Code>0 ⊕ 0 = 0</Code></div>
        <div><Code>0 ⊕ 1 = 1</Code></div>
        <div><Code>1 ⊕ 0 = 1</Code></div>
        <div><Code>1 ⊕ 1 = 0</Code></div>
      </div>
      <p className="rules-p">Пример: <Code>5 ⊕ 3 = ?</Code></p>
      <pre className="sol-pre">{`  5 = 1 0 1
  3 = 0 1 1
  ⊕   ─────
      1 1 0  = 6`}</pre>
      <p className="rules-p">
        Полезные свойства:
      </p>
      <ul className="sol-list">
        <li><Code>a ⊕ a = 0</Code> (само с собой даёт ноль)</li>
        <li><Code>a ⊕ 0 = a</Code> (ноль — нейтральный элемент)</li>
        <li><Code>a ⊕ b = b ⊕ a</Code> (коммутативность)</li>
        <li><Code>(a ⊕ b) ⊕ c = a ⊕ (b ⊕ c)</Code> (ассоциативность)</li>
      </ul>
    </section>

    <section className="rules-section">
      <h2 className="rules-h">🧩 Решение нима</h2>
      <p className="rules-p">
        <b>Теорема.</b> В нимe позиция <Code>(a₁, …, aₙ)</Code> является{" "}
        <b>L</b>-позицией тогда и только тогда, когда{" "}
        <Code>a₁ ⊕ a₂ ⊕ … ⊕ aₙ = 0</Code>. Все остальные позиции — <b>W</b>-позиции.
      </p>
      <p className="rules-p">
        Иначе говоря: правильная разметка существует и задаётся правилом «цвет = L
        ⟺ XOR размеров кучек равен нулю».
      </p>
    </section>

    <section className="rules-section">
      <h2 className="rules-h">✅ Доказательство</h2>
      <p className="rules-p">
        Достаточно проверить три свойства правильной разметки.
      </p>

      <p className="rules-p"><b>1) Терминальная позиция — L.</b></p>
      <p className="rules-p rules-hint">
        В <Code>(0, 0, …, 0)</Code> XOR всех кучек равен нулю, значит по нашему правилу
        она помечена как L. ✓
      </p>

      <p className="rules-p"><b>2) Из L все ходы ведут в W.</b></p>
      <p className="rules-p rules-hint">
        Пусть в позиции <Code>X = a₁ ⊕ … ⊕ aₙ = 0</Code> игрок взял{" "}
        <Code>k {">"} 0</Code> предметов из кучки <Code>i</Code>. Новый XOR:
      </p>
      <pre className="sol-pre">{`X' = X ⊕ aᵢ ⊕ (aᵢ − k)
   = 0 ⊕ aᵢ ⊕ (aᵢ − k)
   = aᵢ ⊕ (aᵢ − k)`}</pre>
      <p className="rules-p rules-hint">
        Так как <Code>k {">"} 0</Code>, то <Code>aᵢ ≠ aᵢ − k</Code>, и XOR двух разных
        чисел не равен нулю. Значит <Code>X' ≠ 0</Code> — новая позиция помечена W. ✓
      </p>

      <p className="rules-p"><b>3) Из W существует ход в L.</b></p>
      <p className="rules-p rules-hint">
        Пусть <Code>X = a₁ ⊕ … ⊕ aₙ ≠ 0</Code>. Обозначим через <Code>h</Code> номер
        старшего ненулевого бита в <Code>X</Code>. Поскольку этот бит в XOR равен 1,
        он равен 1 в нечётном числе <Code>aᵢ</Code> — выберем любую такую кучку{" "}
        <Code>i</Code>. Положим:
      </p>
      <pre className="sol-pre">{`aᵢ' = aᵢ ⊕ X`}</pre>
      <p className="rules-p rules-hint">
        В <Code>aᵢ'</Code> бит <Code>h</Code> сбросился (был 1 у <Code>aᵢ</Code>,
        XOR с 1 у <Code>X</Code> даёт 0), а старшие биты не изменились (их в{" "}
        <Code>X</Code> нет по выбору <Code>h</Code>). Значит{" "}
        <Code>aᵢ' {"<"} aᵢ</Code>, и игрок может взять из кучки{" "}
        <Code>i</Code> ровно <Code>aᵢ − aᵢ' {">"} 0</Code> предметов. Новый XOR:
      </p>
      <pre className="sol-pre">{`X' = X ⊕ aᵢ ⊕ aᵢ'
   = X ⊕ aᵢ ⊕ (aᵢ ⊕ X)
   = 0`}</pre>
      <p className="rules-p rules-hint">
        Полученная позиция помечена L. ✓
      </p>

      <p className="rules-p">
        Все три свойства выполнены — разметка правильная. Поскольку правильная разметка
        единственна, мы получили искомое решение. ∎
      </p>
    </section>

    <section className="rules-section">
      <h2 className="rules-h">🧮 Теорема Шпрага–Гранди</h2>
      <p className="rules-p">
        Доказанный факт — частный случай более общей теоремы. <b>Теорема Шпрага–Гранди</b>{" "}
        утверждает: любая <i>беспристрастная</i> игра с конечным числом позиций (в
        которой множество ходов не зависит от того, чья очередь, и игрок без хода
        проигрывает) эквивалентна одной куче нима — её{" "}
        <b>числу Гранди</b> <Code>g(v)</Code>:
      </p>
      <pre className="sol-pre">{`g(v) = mex { g(u) : v → u },
mex(S) = наименьшее неотрицательное число, которого нет в S.`}</pre>
      <p className="rules-p">
        Для <i>суммы</i> игр (когда ход — выбор одной из подыгр) число Гранди равно XOR
        чисел Гранди подыгр. Ним — это сумма «однокучечных игр», а число Гранди одной
        кучи размера <Code>a</Code> равно <Code>a</Code>. Отсюда{" "}
        <Code>g(a₁, …, aₙ) = a₁ ⊕ … ⊕ aₙ</Code>, и L ⟺ <Code>g = 0</Code> — то самое
        утверждение, которое мы доказали выше.
      </p>
    </section>

    <section className="rules-section">
      <h2 className="rules-h">📚 Дополнительные материалы</h2>
      <ul className="sol-list">
        <li>
          <a className="link" href="https://ru.wikipedia.org/wiki/Ним_(игра)" target="_blank" rel="noreferrer">
            Википедия: Ним (игра)
          </a>{" "}
          — история, варианты, разбор стратегии.
        </li>
        <li>
          <a className="link" href="https://ru.wikipedia.org/wiki/Функция_Шпрага_—_Гранди" target="_blank" rel="noreferrer">
            Википедия: Функция Шпрага — Гранди
          </a>{" "}
          — общая теория беспристрастных игр.
        </li>
        <li>
          <a className="link" href="https://cp-algorithms.com/game_theory/sprague-grundy-nim.html" target="_blank" rel="noreferrer">
            cp-algorithms: Sprague–Grundy theorem &amp; Nim
          </a>{" "}
          — алгоритмическая сторона с примерами кода (на английском).
        </li>
      </ul>
    </section>

    <Button variant="ghost" onClick={onBack}>Вернуться</Button>
  </Screen>
);
