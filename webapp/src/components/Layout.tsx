import type { ReactNode } from "react";

export const Screen = ({ title, children }: { title?: string; children: ReactNode }) => (
  <div className="screen">
    {title && <h1 className="title">{title}</h1>}
    {children}
  </div>
);

export const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
}) => (
  <button className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);
