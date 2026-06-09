import Link from "next/link";
import type { ReactNode } from "react";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Converte parágrafos com links markdown [texto](url) em elementos React. */
export function renderBlogParagraph(text: string): ReactNode {
  if (!LINK_PATTERN.test(text)) return text;

  LINK_PATTERN.lastIndex = 0;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const [, label, href] = match;
    const isInternal = href.startsWith("/");

    parts.push(
      isInternal ? (
        <Link
          key={`${href}-${match.index}`}
          href={href}
          className="font-medium text-solar-600 underline decoration-solar-500/40 underline-offset-2 transition-colors hover:text-solar-600/80"
        >
          {label}
        </Link>
      ) : (
        <a
          key={`${href}-${match.index}`}
          href={href}
          className="font-medium text-solar-600 underline decoration-solar-500/40 underline-offset-2 transition-colors hover:text-solar-600/80"
          rel="noopener noreferrer"
          target="_blank"
        >
          {label}
        </a>
      ),
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
