import { Fragment, ReactNode } from "react";

type ListKind = "ul" | "ol";

function inlineText(value: string): ReactNode[] {
  const parts = value.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\))/g);

  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    const link = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]}>{link[1]}</a>;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

function isTableDivider(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);
}

function tableCells(line: string) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function listItem(line: string) {
  const unordered = line.match(/^[-*]\s+(.+)$/);
  if (unordered) return { kind: "ul" as ListKind, content: unordered[1] };
  const ordered = line.match(/^\d+\.\s+(.+)$/);
  if (ordered) return { kind: "ol" as ListKind, content: ordered[1] };
  return null;
}

/** Renders the supplied source verbatim in content while restoring Markdown hierarchy. */
export function MarkdownArticle({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const Tag = `h${level}` as "h1" | "h2" | "h3";
      blocks.push(<Tag key={`heading-${index}`}>{inlineText(heading[2])}</Tag>);
      index += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={`rule-${index}`} />);
      index += 1;
      continue;
    }

    if (line.startsWith("<!--") && line.endsWith("-->")) {
      blocks.push(<p className="article-source-note" key={`comment-${index}`}>{line}</p>);
      index += 1;
      continue;
    }

    if (/^<a\s+id=["'][^"']+["']\s*><\/a>$/.test(line.trim())) {
      const id = line.match(/id=["']([^"']+)["']/)?.[1];
      blocks.push(<span key={`anchor-${index}`} id={id} className="article-anchor" aria-hidden="true" />);
      index += 1;
      continue;
    }

    if (line.includes("|") && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const headers = tableCells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      blocks.push(
        <div className="article-table-wrap" key={`table-${index}`}>
          <table>
            <thead><tr>{headers.map((cell, cellIndex) => <th key={cellIndex}>{inlineText(cell)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inlineText(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    const firstItem = listItem(line);
    if (firstItem) {
      const kind = firstItem.kind;
      const items: string[] = [];
      while (index < lines.length) {
        const item = listItem(lines[index]);
        if (!item || item.kind !== kind) break;
        items.push(item.content);
        index += 1;
      }
      const List = kind;
      blocks.push(<List key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inlineText(item)}</li>)}</List>);
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const candidate = lines[index];
      if (!candidate.trim() || /^(#{1,3})\s+/.test(candidate) || /^---+$/.test(candidate.trim()) || listItem(candidate) || candidate.startsWith("<!--") || /^<a\s+id=/.test(candidate.trim()) || (candidate.includes("|") && index + 1 < lines.length && isTableDivider(lines[index + 1]))) break;
      paragraph.push(candidate);
      index += 1;
    }
    blocks.push(<p key={`paragraph-${index}`}>{inlineText(paragraph.join(" "))}</p>);
  }

  return <>{blocks}</>;
}
