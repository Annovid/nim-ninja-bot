type CloudStorageCb<T> = (err: string | null, value: T) => void;

interface TelegramWebApp {
  ready(): void;
  expand(): void;
  enableClosingConfirmation?(): void;
  themeParams?: Record<string, string>;
  colorScheme?: "light" | "dark";
  onEvent(event: string, cb: () => void): void;
  offEvent(event: string, cb: () => void): void;
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void };
  HapticFeedback?: {
    impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): void;
    notificationOccurred(type: "error" | "success" | "warning"): void;
    selectionChanged(): void;
  };
  CloudStorage?: {
    setItem(key: string, value: string, cb?: CloudStorageCb<boolean>): void;
    getItem(key: string, cb: CloudStorageCb<string | undefined>): void;
    removeItem(key: string, cb?: CloudStorageCb<boolean>): void;
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export const tg = (): TelegramWebApp | undefined => window.Telegram?.WebApp;

export const initTelegram = () => {
  const app = tg();
  if (!app) return;
  app.ready();
  app.expand();

  const applyTheme = () => {
    const params = app.themeParams ?? {};
    const root = document.documentElement;
    for (const [k, v] of Object.entries(params)) {
      root.style.setProperty(`--tg-${k.replace(/_/g, "-")}`, v);
    }
    root.dataset.theme = app.colorScheme ?? "light";
  };
  applyTheme();
  app.onEvent("themeChanged", applyTheme);
};

export const haptic = (kind: "tap" | "success" | "error" | "select" = "tap") => {
  const hf = tg()?.HapticFeedback;
  if (!hf) return;
  if (kind === "tap") hf.impactOccurred("light");
  else if (kind === "success") hf.notificationOccurred("success");
  else if (kind === "error") hf.notificationOccurred("error");
  else hf.selectionChanged();
};

export const useBackButton = (visible: boolean, onClick: () => void) => {
  const app = tg();
  if (!app) return () => {};
  if (visible) {
    app.BackButton.show();
    app.BackButton.onClick(onClick);
  } else {
    app.BackButton.hide();
  }
  return () => {
    app.BackButton.offClick(onClick);
    app.BackButton.hide();
  };
};

export const cloud = {
  get(key: string): Promise<string | undefined> {
    const cs = tg()?.CloudStorage;
    if (!cs) return Promise.resolve(undefined);
    return new Promise((resolve) => {
      cs.getItem(key, (err, value) => resolve(err ? undefined : value));
    });
  },
  set(key: string, value: string): Promise<boolean> {
    const cs = tg()?.CloudStorage;
    if (!cs) return Promise.resolve(false);
    return new Promise((resolve) => {
      cs.setItem(key, value, (err, ok) => resolve(!err && !!ok));
    });
  },
};
