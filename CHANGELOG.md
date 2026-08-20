# Changelog

All notable changes to this project will be documented in this file.

## 1.0.0 - 2026-08-20

Initial release.

### Added

- Files app: file list (toolbar + table) wrapped in a single centered 1012px
  card, harmonized with the README card of the `files_readmemd` plugin.
- Login page styled as a card in the same style.
- Guest footer (`footer.guest-box`: slogan + "Create your own free account")
  hidden on non-authenticated pages (public share links and login).
- Dark and light themes adapt automatically via Nextcloud CSS variables.
- Scoped to `.files-list*` / `.login-box` / `footer.guest-box` — other apps
  are not affected.