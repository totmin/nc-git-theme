/**
 * Totmin Theme — Files app navigation starts collapsed on load.
 *
 * The Files sidebar is the Vue `NcAppNavigation` component (@nextcloud/vue),
 * mounted inside `NcContent`. On desktop it mounts open; the collapsed state
 * is the reactive class `app-navigation--closed` on the `.app-navigation`
 * root (negative margin slides it off-canvas, the floating hamburger stays
 * visible so the user can reopen it).
 *
 * The official way to close it is the `toggle-navigation` event on the
 * `@nextcloud/event-bus`. The bus is a window-level singleton
 * (`window._nc_event_bus`), so a plain (non-bundled) script reaches the exact
 * bus instance the Files bundle subscribes to. Fallback: click the native
 * `.app-navigation-toggle` button (guarded by its `aria-expanded` state).
 *
 * Design goals:
 * - Scope: authenticated users on the Files app (`#content-vue.app-files`)
 *   only. Other apps (Photos, Talk, …) and public share pages are untouched.
 * - One-shot: the navigation is collapsed exactly once on mount. Afterwards
 *   the observer is disconnected, so a user who reopens the sidebar during
 *   the session is never collapsed again.
 * - No visual artifacts: the initial slide transition is suppressed while the
 *   collapsed state is applied, and the emit is retried briefly until the
 *   `--closed` class is observed, so the page never flashes the open sidebar.
 * - Mobile starts closed already (NcAppNavigation opens only on wide
 *   viewports), so this is a no-op there.
 */
const FILES_CONTENT_SELECTOR = '#content-vue.app-files'
const NAV_SELECTOR = '.app-navigation'
const EVENT_BUS_GLOBAL = '_nc_event_bus'
const TOGGLE_SELECTOR = '.app-navigation-toggle'
const CLOSED_CLASSES = ['app-navigation--closed', 'app-navigation--close']

const RETRY_MS = 50
const MAX_ATTEMPTS = 10

/**
 * Whether the current session is authenticated. Public share pages have no
 * user and never render the Files navigation anyway.
 *
 * @return {boolean}
 */
const isAuthenticated = () => Boolean(window.OC?.getCurrentUser?.()?.uid)

const isClosed = (nav) => CLOSED_CLASSES.some((cls) => nav.classList.contains(cls))

/**
 * Collapse the Files navigation exactly once. Idempotent and self-healing:
 * if the emit happens before the component subscribed (the observer can fire
 * before Vue's mounted hooks), the closed class is not applied yet, so the
 * next scheduled pass emits again. Bounded by MAX_ATTEMPTS.
 */
const collapse = () => {
	if (collapse.done) {
		observer?.disconnect()
		return
	}
	const nav = document.querySelector(FILES_CONTENT_SELECTOR + ' ' + NAV_SELECTOR)
	if (nav === null) {
		return // not mounted yet -> the observer calls us again
	}
	if (isClosed(nav)) {
		collapse.done = true
		observer?.disconnect()
		return
	}
	collapse.attempts += 1
	if (collapse.attempts > MAX_ATTEMPTS) {
		collapse.done = true
		observer?.disconnect()
		return
	}

	// Instant collapse: suppress the slide transition for this one state
	// change so the sidebar never visibly animates on load. Restored after
	// the closed state has been applied so future user toggles animate.
	nav.style.transition = 'none'
	window.setTimeout(() => { nav.style.transition = '' }, RETRY_MS)

	const bus = window[EVENT_BUS_GLOBAL]
	if (bus && typeof bus.emit === 'function') {
		// Official API: @nextcloud/event-bus 'toggle-navigation' event.
		bus.emit('toggle-navigation', { open: false })
	} else {
		// Fallback: drive the native toggle button, guarded against reopening.
		const toggle = nav.querySelector(TOGGLE_SELECTOR)
		if (toggle !== null && toggle.getAttribute('aria-expanded') === 'true') {
			toggle.click()
		}
	}

	window.setTimeout(collapse, RETRY_MS)
}

let observer = null
if (isAuthenticated()) {
	collapse.done = false
	collapse.attempts = 0
	observer = new MutationObserver(() => queueMicrotask(collapse))
	observer.observe(document.body, { childList: true, subtree: true })
	collapse()

	// If the page finished loading without a Files app root, this is another
	// app — stop watching so the observer does not linger on unrelated pages.
	window.addEventListener('load', () => {
		if (!collapse.done && document.querySelector(FILES_CONTENT_SELECTOR) === null) {
			observer?.disconnect()
		}
	})
}