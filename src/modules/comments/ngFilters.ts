import type { NgEntry } from "@/config/storage";
import type { NvCommentItem } from "@/types/api";

export type CommentShape = Pick<NvCommentItem, "body" | "userId">;
export type NgFilter = (comment: CommentShape) => boolean;

const REGEX_PREFIX = "re:" as const;
const SLASH_REGEX = /^\/(.*)\/(i?)$/;

type WordRule = {
  test: (value: string) => boolean;
};

const toRegex = (raw: string): RegExp | null => {
  const normalized = raw.trim();
  if (!normalized) return null;
  const match = normalized.match(SLASH_REGEX);
  const source = match ? match[1] : normalized;
  const flags = match ? match[2] : undefined;
  try {
    return new RegExp(source, flags);
  } catch {
    return null;
  }
};

const buildWordRule = (entry: NgEntry): WordRule | null => {
  const rawValue = entry.value?.trim();
  if (!rawValue) return null;
  const treatAsRegex = entry.isRegex || rawValue.startsWith(REGEX_PREFIX);
  if (treatAsRegex) {
    const regexSource = entry.isRegex ? rawValue : rawValue.slice(REGEX_PREFIX.length);
    const regex = toRegex(regexSource);
    if (!regex) return null;
    return { test: (value: string) => regex.test(value) };
  }
  const needle = rawValue.toLowerCase();
  return { test: (value: string) => value.toLowerCase().includes(needle) };
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

export const normalizeNgList = (value: unknown): NgEntry[] => {
  if (!Array.isArray(value)) return [];
  const normalized: NgEntry[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!isRecord(item)) continue;
    const rawValue = typeof item.value === "string" ? item.value.trim() : "";
    if (!rawValue || seen.has(rawValue)) continue;
    seen.add(rawValue);
    normalized.push({
      value: rawValue,
      enabled: item.enabled !== false,
      isRegex: item.isRegex === true,
    });
  }
  return normalized;
};

export const createNgFilter = (lists: Partial<{ userEntries: NgEntry[]; wordEntries: NgEntry[] }>): NgFilter => {
  const userIds = new Set(
    (lists.userEntries ?? []).filter((entry) => entry.enabled !== false).map((entry) => entry.value)
  );

  const wordRules = (lists.wordEntries ?? [])
    .filter((entry) => entry.enabled !== false)
    .map(buildWordRule)
    .filter((rule): rule is WordRule => Boolean(rule));

  if (userIds.size === 0 && wordRules.length === 0) {
    return () => false;
  }

  return ({ body, userId }: CommentShape): boolean => {
    if (userId && userIds.has(userId)) return true;
    if (!body) return false;
    return wordRules.some((rule) => rule.test(body));
  };
};
