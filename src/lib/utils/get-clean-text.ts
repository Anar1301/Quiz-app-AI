export function cleanText(input: string) {
  return input
    .replace(/[`"'\\]/g, "") // remove quotes, backticks, and backslashes
    .replace(/[^\w\s.,;:()!?-]/g, "") // remove special symbols except punctuation
    .replace(/\s+/g, " ") // collapse multiple spaces
    .replace(/\s([.,;:!?])/g, "$1") // remove spaces before punctuation
    .trim(); // remove leading/trailing spaces
}

export function parseJsonBlockSafe(input: string) {
  const cleaned = input.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Invalid JSON from AI:", err);
    return null;
  }
}
