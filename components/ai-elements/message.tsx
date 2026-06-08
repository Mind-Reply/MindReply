"use client";

import { memo, type ComponentProps } from "react";
import { Streamdown } from "streamdown";

type MessageResponseProps = ComponentProps<typeof Streamdown>;

export const MessageResponse = memo(
  ({ className = "", ...props }: MessageResponseProps) => (
    <Streamdown className={`space-y-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ${className}`.trim()} {...props} />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.className === nextProps.className,
);

MessageResponse.displayName = "MessageResponse";
