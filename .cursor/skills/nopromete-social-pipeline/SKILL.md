---
name: nopromete-social-pipeline
description: >-
  Build and maintain the NoPromete social-first news pipeline: RSS → extraction →
  LLM → human review → social assets → Instagram publishing. Use when working on
  ingest, social_drafts, admin review, asset rendering, or Instagram API.
---

# NoPromete Social Pipeline

NoPromete is **social-first** (Instagram/TikTok). The public website is a **link hub + admin dashboard**, not a news site.

## Core principle

**Never publish automatically without human approval.**

Automate: ingest, extract (internal), LLM, captions, asset render, scheduling metadata.  
Human must: approve/reject before anything goes live.

## Brand (do not mix)

- Costa Rican, conversational, sharp, not cruel
- Don Zopi: tired vulture, observer — optional per post
- Always credit original source with link

Use with: `nopromete-editorial`, `nopromete-social`, `nopromete-headlines`.

## Data model (primary)

- `news_items` — RSS metadata, lean (no full article text in DB)
- `social_drafts` — LLM outputs + workflow + `rendered_asset_url` + publish ids

Legacy `posts` / `raw_articles` — web archive; not the main product.

## Pipeline stages

1. **Ingest RSS** → `news_items` (`fetched`, dedupe by `source_url`)
2. **Extract** (on-demand for LLM; minimal persistence)
3. **LLM** → strict JSON → `social_drafts` (`needs_review`)
4. **Human review** → approve / reject
5. **Asset** → deterministic Story template (`/api/assets/social/[id]`)
6. **Publish** → Instagram API only if `approved` + asset URL + env configured

## Free-tier constraints

- Manual buttons in `/admin` (no frequent cron)
- LLM: batch size 1, stop on 429 / quota / rate limit (Groq o Gemini)
- Neon: no `raw_html` / full extracted text in `news_items`

## LLM JSON contract

Fields: `safety_classification`, `reason`, `recommended_format`, `news_summary_internal`, `editorial_angle`, `story_headline`, `story_subtext`, `don_zopi_reaction`, `instagram_caption`, `hashtags`, `source_credit`, `link_sticker_url`.

Implementation: `lib/llm/social-generate.ts`, `lib/llm/social-prompts.ts`.

## Safety

Mark `not_suitable_for_satire` for tragedies, violence, missing persons, etc. Do not force humor.

## Code map

| Area | Path |
|------|------|
| Ingest | `lib/ingest/social-pipeline.ts` |
| LLM | `lib/llm/social-generate.ts` |
| Admin actions | `app/admin/actions.ts` |
| Review UI | `app/admin/social/[id]/page.tsx` |
| Assets | `app/api/assets/social/[id]/route.ts` |
| Instagram | `lib/publish/instagram.ts` |
| Public hub | `components/landing/LandingHub.tsx` |

## Env vars

- `DATABASE_URL`, `ADMIN_PASSWORD`, `AUTH_SECRET`
- LLM: `GROQ_API_KEY` (`SOCIAL_LLM_PROVIDER=groq`, `GROQ_MODEL`) o `GEMINI_API_KEY` (`SOCIAL_LLM_PROVIDER=gemini`)
- `ASSET_SIGNING_SECRET` (or dev fallback)
- `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL`
- `IG_ACCESS_TOKEN`, `IG_USER_ID` (when publishing)
- `BASIC_AUTH_USER`, `BASIC_AUTH_PASSWORD` (production gate)
