import { useEffect, useState } from "react";
import { problems } from "./content";
import { loadProgress, type Progress } from "./lib/storage";
import { useBackButton } from "./lib/telegram";
import { MainMenu } from "./components/MainMenu";
import { About } from "./components/About";
import { ProblemSelect } from "./components/ProblemSelect";
import { Rules } from "./components/Rules";
import { Solution } from "./components/Solution";
import { Game } from "./components/Game";

type Screen =
  | { name: "menu" }
  | { name: "about" }
  | { name: "problems" }
  | { name: "rules" }
  | { name: "solution" }
  | { name: "game"; problemId: string };

export const App = () => {
  const [screen, setScreen] = useState<Screen>({ name: "menu" });
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const goBack = () => {
    setScreen((s) => {
      if (s.name === "about" || s.name === "problems") return { name: "menu" };
      if (s.name === "rules" || s.name === "solution" || s.name === "game") return { name: "problems" };
      return s;
    });
  };

  useEffect(() => useBackButton(screen.name !== "menu", goBack), [screen.name]);

  switch (screen.name) {
    case "menu":
      return (
        <MainMenu
          onPlay={() => setScreen({ name: "problems" })}
          onAbout={() => setScreen({ name: "about" })}
        />
      );
    case "about":
      return <About onBack={() => setScreen({ name: "menu" })} />;
    case "problems":
      return (
        <ProblemSelect
          progress={progress}
          onPick={(id) => setScreen({ name: "game", problemId: id })}
          onRules={() => setScreen({ name: "rules" })}
          onSolution={() => setScreen({ name: "solution" })}
          onBack={() => setScreen({ name: "menu" })}
        />
      );
    case "rules":
      return <Rules onBack={() => setScreen({ name: "problems" })} />;
    case "solution":
      return <Solution onBack={() => setScreen({ name: "problems" })} />;
    case "game": {
      const problem = problems.find((p) => p.id === screen.problemId)!;
      return (
        <Game
          problem={problem}
          onWin={(updated) => setProgress(updated)}
          onLeave={() => setScreen({ name: "problems" })}
        />
      );
    }
  }
};
