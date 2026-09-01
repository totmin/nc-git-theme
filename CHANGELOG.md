# Changelog

All notable changes to this project will be documented in this file.

## 1.0.2 - 2026-09-01

### Fixed

- README markdown tables in the files_readmemd header/footer cards collapsed
  into 44px flex blobs inside the file card. The Files app scopes its
  list styles (`tr`/`tbody`/`td`/`th` are `display: flex`, cells
  `width: var(--row-height)`) to the whole `.files-list` container, which
  also hit the plugin's rendered tables. Restore real table layout for
  every `.markdown-body` table; the file list's own flex table is untouched.

### Changed

- README tables are now a faithful replica of github.com's rendered
  markdown tables: `6px 13px` cell padding, a uniform `1px` border on all
  four sides of every cell (one shared grey, no separate outer frame),
  `th` weight 600 with `--color-main-text` (the Files app washes list text
  to grey; we force it back), white base rows (`--color-main-background`)
  with a `1px` `--color-background-darker` separator per row, subtle zebra
  striping (`--color-background-hover`) and `font-variant: tabular-nums`.
  Each rule maps to the nearest Nextcloud colour token so it works in both
  light and dark themes. Previously the plugin's own stylesheet that ships
  these rules is only loaded inside the Files app, not on public-share
  pages, so the cells had zero padding and no borders.
- Readability of README text: `.markdown-body` uses GitHub's real system
  font stack, `15px`/`1.5` metrics, weight 400 and `-webkit-font-smoothing:
  antialiased` + `text-rendering: optimizeLegibility` so the text renders
  as crisp and legible as on github.com (instead of Nextcloud's narrower
  stack with subpixel rendering on Linux).

## 1.0.1 - 2026-08-21

### Changed

- Trashbin: hide the "Modified" and "Deleted by" columns — redundant in
  personal storage (deleted-by is always the current user). Keeps checkbox,
  name, restore, size, original path and deleted date.

## 1.0.0 - 2026-08-21

Initial public release.

### Added

- Files app: file list (breadcrumbs + toolbar + table) wrapped in a single
  centered 1012px card, harmonized with the README card rendered by the
  files_readmemd plugin.
- GitHub-style per-type file icons (ported from Gitea's Material icon set).
- Files navigation sidebar starts collapsed by default on desktop.
- Themed, directly-rendered batch "Download" and "Delete" actions in the
  selection bar (idempotent, no page freeze).
- Simplified guest header on public share pages (logo + single Download).
- Login page styled as a card in the same style.
- Guest footer hidden on non-authenticated pages.
- Light and dark themes adapt automatically via Nextcloud CSS variables.
- Scoped to the Files app / login / guest pages — other apps are unaffected.

### Requirements

- Nextcloud 30–35, PHP >= 8.1.
