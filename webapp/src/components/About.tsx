import { aboutText } from "../content";
import { Button, Screen } from "./Layout";

export const About = ({ onBack }: { onBack: () => void }) => (
  <Screen title="Обо мне">
    <p>{aboutText}</p>
    <Button variant="ghost" onClick={onBack}>Вернуться</Button>
  </Screen>
);
