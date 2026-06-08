import type { ReactNode } from "react";

type MessageResponseProps = {
  children: ReactNode;
  className?: string;
};

export function MessageResponse({ children, className = "" }: MessageResponseProps) {
  const text = typeof children === "string" ? children : "";
  const blocks = text.split(/\n{2,}/).filter(Boolean);

  if (!blocks.length) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`.trim()}>
      {blocks.map((block, index) => (
        <p key={`${index}-${block.slice(0, 12)}`} className="whitespace-pre-wrap leading-7">
          {block}
        </p>
      ))}
    </div>
  );
}
