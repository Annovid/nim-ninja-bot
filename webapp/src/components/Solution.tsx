import { solutionText, solutionUrl } from "../content";
import { Button, Screen } from "./Layout";

export const Solution = ({ onBack }: { onBack: () => void }) => (
  <Screen title="Общее решение">
    <p className="prose">{solutionText}</p>
    <a className="link" href={solutionUrl} target="_blank" rel="noreferrer">
      {solutionUrl}
    </a>
    <Button variant="ghost" onClick={onBack}>Вернуться</Button>
  </Screen>
);
