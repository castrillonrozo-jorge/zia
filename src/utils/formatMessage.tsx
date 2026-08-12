import React from 'react';

/**
 * Formats a message string containing basic markdown syntax (bold asterisks and bullet points)
 * into a beautiful, styled hierarchy of React JSX elements.
 * This guarantees no raw markdown sequences (e.g. asterisks) slip into the view.
 */
export function formatMessageText(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const parseInlineStyles = (line: string): React.ReactNode[] => {
    interface Token {
      type: 'text' | 'bold' | 'link' | 'raw_url';
      text: string;
      url?: string;
    }

    const tokens: Token[] = [];
    let currentIndex = 0;

    // Combined regex for **bold** (g2), [text](url) (g4, g5), raw URL (g6)
    const regex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|((https?:\/\/[^\s()[\]]+))/g;

    let match;
    while ((match = regex.exec(line)) !== null) {
      const matchIndex = match.index;

      if (matchIndex > currentIndex) {
        tokens.push({
          type: 'text',
          text: line.substring(currentIndex, matchIndex),
        });
      }

      if (match[1]) {
        tokens.push({
          type: 'bold',
          text: match[2],
        });
      } else if (match[3]) {
        tokens.push({
          type: 'link',
          text: match[4],
          url: match[5],
        });
      } else if (match[6]) {
        tokens.push({
          type: 'raw_url',
          text: match[6],
          url: match[6],
        });
      }

      currentIndex = regex.lastIndex;
    }

    if (currentIndex < line.length) {
      tokens.push({
        type: 'text',
        text: line.substring(currentIndex),
      });
    }

    return tokens.map((token, index) => {
      if (token.type === 'bold') {
        return (
          <strong 
            key={`bold-${index}`} 
            className="font-extrabold text-[#4F84C4] underline decoration-[#4F84C4]/20 pb-0.5"
          >
            {token.text}
          </strong>
        );
      }
      if (token.type === 'link') {
        return (
          <a
            key={`link-${index}`}
            href={token.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 my-1 mx-0.5 rounded-xl bg-gradient-to-r from-[#4F84C4]/15 to-[#3A69A3]/10 hover:scale-[1.02] hover:shadow-none hover:from-[#4F84C4]/25 hover:to-[#3A69A3]/20 text-[#4F84C4] font-bold border border-[#4F84C4]/25 transition-all duration-200 shadow-none text-xs select-none hover:underline decoration-2 align-middle"
          >
            <span>{token.text}</span>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
      }
      if (token.type === 'raw_url') {
        const displayUrl = token.text.replace(/https?:\/\/(www\.)?/, '').substring(0, 30) + (token.text.length > 30 ? '...' : '');
        return (
          <a
            key={`rawurl-${index}`}
            href={token.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 my-0.5 rounded-xl bg-slate-200/50 hover:bg-slate-200/80 text-[#4F84C4] font-bold border border-black/5 transition-all duration-200 shadow-none active:scale-95 text-xs select-none hover:underline decoration-2 align-middle mx-1"
          >
            <span>{displayUrl}</span>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
      }
      return <span key={`text-${index}`}>{token.text}</span>;
    });
  };

  let currentListType: 'bullet' | 'ordered' | null = null;

  const flushList = (index: number) => {
    if (currentList.length > 0) {
      if (currentListType === 'bullet') {
        elements.push(
          <ul key={`ul-${index}`} className="my-3 space-y-1.5 pl-2">
            {currentList}
          </ul>
        );
      } else if (currentListType === 'ordered') {
        elements.push(
          <ol key={`ol-${index}`} className="my-3 space-y-1.5 pl-2">
            {currentList}
          </ol>
        );
      }
      currentList = [];
      currentListType = null;
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    
      // 1. Check for headings (e.g. ### Subheading or ## Subheading)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList(lineIdx);
      const content = headingMatch[2];
      elements.push(
        <h4 
          key={`heading-${lineIdx}`} 
          className="font-black text-[#4F84C4] text-base mt-4 mb-2 tracking-tight flex items-center gap-1.5 border-b border-black/10 pb-1"
        >
          {parseInlineStyles(content)}
        </h4>
      );
      return;
    }

    // 2. Check if line is a bullet list (starts with *, -, or • followed by a space)
    const bulletMatch = trimmed.match(/^[\*\-\u2022]\s+(.*)$/);
    if (bulletMatch) {
      if (currentListType !== 'bullet') {
        flushList(lineIdx);
        currentListType = 'bullet';
      }
      const content = bulletMatch[1];
      currentList.push(
        <li 
          key={`li-${lineIdx}`} 
          className="ml-5 list-disc mb-1.5 text-[#1A2B49] leading-relaxed text-sm"
        >
          {parseInlineStyles(content)}
        </li>
      );
      return;
    }

    // 3. Check if line is an ordered list (starts with number e.g. 1. or 1-)
    const orderedMatch = trimmed.match(/^(\d+)[.\-]\s+(.*)$/);
    if (orderedMatch) {
      if (currentListType !== 'ordered') {
        flushList(lineIdx);
        currentListType = 'ordered';
      }
      const content = orderedMatch[2];
      currentList.push(
        <li 
          key={`li-${lineIdx}`} 
          className="ml-5 list-decimal mb-1.5 text-[#1A2B49] leading-relaxed text-sm pr-1"
        >
          {parseInlineStyles(content)}
        </li>
      );
      return;
    }

    // 4. Regular line or blank line
    flushList(lineIdx);
    if (trimmed === '') {
      elements.push(<div key={`spacer-${lineIdx}`} className="h-2" />);
    } else {
      // Check if this line is a subheader styled like "**Subtítulo:** Content"
      // If a line is just bold text at the start, let's make it look prominent
      const boldHeaderMatch = trimmed.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
      if (boldHeaderMatch) {
        const header = boldHeaderMatch[1];
        const restOfLine = boldHeaderMatch[2];
        elements.push(
          <p key={`p-${lineIdx}`} className="mb-2.5 text-[#1A2B49] leading-relaxed text-sm">
            <strong className="block text-[#1A2B49] font-extrabold mt-3.5 mb-1 text-sm border-l-2 border-[#4F84C4] pl-2">
              {header}:
            </strong>
            {restOfLine ? <span>{parseInlineStyles(restOfLine)}</span> : null}
          </p>
        );
      } else {
        elements.push(
          <p key={`p-${lineIdx}`} className="mb-2.5 text-[#1A2B49] leading-relaxed text-sm">
            {parseInlineStyles(line)}
          </p>
        );
      }
    }
  });

  // Flush any remaining items in list at end of source
  flushList(lines.length);

  return <div className="space-y-1">{elements}</div>;
}
