# Changelog

All notable changes to this project will be documented in this file.

## 1.2.2 - 2026-08-21

### Changed

- Guest header: the top-left logo + app title (`.header-start`) is **kept**
  on public share pages. Only the "⋯ More actions" menu and the avatar
  user-menu are hidden, so the header shows the logo on the left and a single
  "Download" button on the right.

## 1.2.0 - 2026-08-21

### Added

- Public share pages (guest UI): the header is simplified — the "⋯ More
  actions" menu and the avatar user-menu (triggers and their dropdown panels)
  are hidden, leaving the app logo on the left and a single "Download" button
  on the right. Scoped to `#body-public` — authenticated users
  (`layout.user.php`) keep the full header untouched. Pure CSS
  (`css/custom.css`), no JS.

## 1.0.9 - 2026-08-20

### Added

- Files app: the left navigation sidebar now starts **collapsed by default**
  on desktop (mobile was already collapsed). The official
  `@nextcloud/event-bus` `toggle-navigation` event is emitted from
  `js/navigation.js` (window-level singleton bus, so the plain script reaches
  the same bus the Files bundle subscribes to); a guarded click on the native
  `.app-navigation-toggle` button is the fallback. The initial slide
  transition is suppressed, so the page loads instantly with the sidebar
  closed and only the floating hamburger visible. Collapsing is **one-shot**:
  if the user reopens the sidebar during the session, it stays open. Scoped to
  authenticated sessions on the Files app — other apps and public share pages
  are unaffected.

## 1.0.8 - 2026-08-20

### Changed

- Public share pages: the toolbar panel (`.files-list__header`) is hidden at
  the share root, where it renders as an empty strip (the root breadcrumb is
  already hidden). Guests inside a share subfolder keep the panel and their
  breadcrumb navigation. Authenticated users are unaffected (`#body-public`
  scoping).

## 1.0.7 - 2026-08-20

### Added

- Selection batch bar: the theme renders direct, uniformly styled "Download"
  and "Delete" buttons (multilingual via `OC.L10N.translate('files', ...)`),
  replacing the native inline batch buttons. Only authenticated users get them;
  guests on public share pages keep the single native "Download" button.
- The batch action row never wraps: on narrow layouts the overflow menu still
  holds "Move or copy", while the duplicate Download/Delete entries are
  removed from it.

### Fixed

- Page freeze when selecting files on authenticated pages. The root cause was
  the `files_readmemd` plugin's `selection-delete.js`, whose MutationObserver
  re-created the Delete button on every mutation (an infinite microtask loop).
  The feature now lives in this theme with an idempotent sync, and the
  plugin's copy is disabled.
- White focus ring that appeared around the selection bar after a mouse
  selection: suppressed for the transient bar (hover states are kept).
- Public share pages: the native "Download" button is no longer hidden when a
  selection is made.

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