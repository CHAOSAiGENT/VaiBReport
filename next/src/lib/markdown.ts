import { remark } from "remark";
import remarkHtml from "remark-html";

/**
 * Convert markdown string to HTML.
 *
 * Content is pipeline-generated (not user input), so remark-html's
 * default sanitization is sufficient.
 */
export async function markdownToHtml(md: string): Promise<string> {
  const result = await remark().use(remarkHtml).process(md);
  return result.toString();
}
