# nc-git-theme

GitHub-style theme for the Nextcloud **Files** app.

The file list (breadcrumbs + toolbar + table) is wrapped in a single centered
1012px card, harmonized with the README card rendered by the
[`files_readmemd`](https://github.com/totmin/files_readmemd) plugin. The login page gets the same card look, and the guest
footer is hidden on non-authenticated pages. Only stable Nextcloud CSS
variables are used, so both light and dark themes adapt automatically.

## Features

- **Centered card layout** — the Files content is constrained to 1012px and
  centered, like a GitHub file view.
- **Login page** — the same card look, centered.
- **Per-type file icons** — colored icons (ported from Gitea's Material icon
  set, MIT) replace the generic mimetype icons.
- **Collapsed sidebar** — the Files navigation starts collapsed on desktop;
  reopening it during the session is never undone.
- **Direct batch actions** — a `[Download] [Delete]` pair is rendered inline in
  the selection bar (the overflow menu keeps the rest).
- **Guest header** — on public share pages only the logo and a single
  "Download" button remain.
- **Light / dark** — driven entirely by Nextcloud CSS variables.

## Requirements

- Nextcloud `30` – `35`
- PHP `>= 8.1`

## Installation

Install as a regular Nextcloud app:

```sh
# place the app in the apps directory (or apps-extra)
cp -r nc-git-theme /var/www/nextcloud/apps-extra/

# enable
php occ app:enable nc-git-theme
```

To disable:

```sh
php occ app:disable nc-git-theme
```

## Related

- [`files_readmemd`](https://github.com/totmin/files_readmemd) — fork of the
  README-card plugin this theme harmonizes with (renders the README card below
  the Files list).

## License

AGPL-3.0-or-later.
