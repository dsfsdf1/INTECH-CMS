import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

const sourceFiles: Record<string, string> = {
  "business-process-automation": "1_1_автоматизация_бизнес_процессов.md",
  "request-automation-system": "1.2. система автоматизации заявок.md",
  "sales-automation": "1.3. автоматизация продаж (2).md",
  "document-workflow-automation": "1_4_автоматизация_документооборота.md",
  "reporting-automation": "1.5. автоматизация отчетности.md",
  "ai-implementation": "1.6. внедрение ии.md",
  "information-systems-implementation": "1_7_внедрение_информационных_систем.md",
};

export function getAutomationSource(slug: string) {
  const filename = sourceFiles[slug];
  if (!filename) return;

  return readFileSync(
    path.join(process.cwd(), "content", "automation", filename),
    "utf8",
  );
}
