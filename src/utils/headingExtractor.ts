
export function extractHeadingsFromWPContent(json: any) {
  const content = json.content.rendered; // Extract rendered content
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  let headingsText = "";
  
  for (let i = 1; i <= 6; i++) {
    doc.querySelectorAll(`h${i}`).forEach((heading) => {
      headingsText += `${heading.textContent?.trim()},\n`; // Append heading text with newline
    });
  }
  
  return headingsText.trim();
}
