import { Button, Screen } from "./Layout";

export const MainMenu = ({ onPlay, onAbout }: { onPlay: () => void; onAbout: () => void }) => (
  <Screen title="Ним">
    <p className="lead">Математическая пошаговая игра. Игроки по очереди берут предметы из кучек, побеждает тот, кто возьмёт последний.</p>
    <div className="stack">
      <Button onClick={onPlay}>Играть</Button>
      <Button variant="ghost" onClick={onAbout}>Обо мне</Button>
    </div>
  </Screen>
);
