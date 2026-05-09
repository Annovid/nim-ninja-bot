import { rulesText } from "../content";
import { Button, Screen } from "./Layout";

export const Rules = ({ onBack }: { onBack: () => void }) => (
  <Screen title="Правила">
    <p className="prose">{rulesText}</p>
    <Button variant="ghost" onClick={onBack}>Вернуться</Button>
  </Screen>
);
