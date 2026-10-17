export function applicationStatus(stage: number) {
  if (stage >= 5) return "Accepted";
  if (stage >= 3) return "Under review";
  return "Pending";
}

export function eastAfricaDate(value: number | string) {
  return new Date(value).toLocaleDateString("en-GB", { timeZone: "Africa/Dar_es_Salaam" });
}

export function todayInTanzania() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Dar_es_Salaam", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function completion(values: Record<string, unknown>) {
  const missing = Object.entries(values).filter(([, value]) => Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim()).map(([key]) => key);
  return { percent: Math.round((Object.keys(values).length - missing.length) / Object.keys(values).length * 100), missing };
}

export function safeUrl(value: string) {
  if (!value) return "";
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Use an http or https URL.");
  return url.href;
}

export function csv(rows: Record<string, string | number>[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const cell = (v: unknown) => `"${String(v ?? "").replace(/^[=+@-]/, "'$&").replaceAll('"', '""')}"`;
  return [keys.map(cell).join(","), ...rows.map(row => keys.map(key => cell(row[key])).join(","))].join("\r\n");
}