# Changelog

All notable changes to this project will be documented in this file.

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
