// Shared per-page <title>/meta-description builder. Each page passes its
// admin-editable override (if any) plus a sensible fallback derived from
// its own content, so the page always has a real title/description even
// before an editor sets one. The returned title is a plain string (not
// `{ absolute }`), so the root layout's "%s | Architecture ONE" template
// applies consistently everywhere except the home page, which sets its
// own absolute title.
import type { Metadata } from "next";

export function pageMetadata(opts: {
  metaTitle?: string | null;
  metaDescription?: string | null;
  fallbackTitle: string;
  fallbackDescription: string;
}): Metadata {
  return {
    title: opts.metaTitle?.trim() || opts.fallbackTitle,
    description: opts.metaDescription?.trim() || opts.fallbackDescription,
  };
}
