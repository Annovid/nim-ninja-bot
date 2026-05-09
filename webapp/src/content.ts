export const aboutText =
  "Я — бот, созданный, чтобы познакомить пользователя с некоторыми математическими играми.";

export const problems: { id: string; label: string; position: number[]; star?: boolean }[] = [
  { id: "1.1", label: "1. (2, 3, 4)", position: [2, 3, 4] },
  { id: "1.2", label: "2. (3, 4, 5)", position: [3, 4, 5] },
  { id: "1.3", label: "3. (3, 4, 5, 6) ★", position: [3, 4, 5, 6], star: true },
];
