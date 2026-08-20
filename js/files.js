/**
 * Totmin Theme — selection batch bar: render direct "Download" and "Delete"
 * actions for authenticated users.
 *
 * This used to live in the files_readmemd plugin (src/selection-delete.js),
 * whose MutationObserver re-created the button on every mutation and froze the
 * page. The theme now owns the buttons.
 *
 * The pair is placed inside the inline action row, right before the native
 * overflow menu, so it stays on one line. Vue re-renders the row when the
 * viewport width changes, so every sync re-positions the buttons (they are
 * only ever re-inserted when not already in place — idempotent, no loop).
 *
 * Guests on public share pages are left untouched: they only get the native
 * Download button and never any theme button.
 *
 * The overflow menu itself keeps holding the actions that do not fit inline
 * (favorites / move-copy on narrow layouts). The duplicate Download and Delete
 * entries are removed from it via CSS, and on wide layouts (app-content ≥
 * 1024px, matching Nextcloud's own breakpoint) the menu would only repeat
 * those actions, so the theme hides it entirely.
 */
document.addEventListener('DOMContentLoaded', () => {
	const BAR_SELECTOR = '[data-cy-files-list-selection-actions]'
	const ITEMS_SELECTOR = '.action-items'
	const DELETE_CLASS = 'totmin-batch-delete-button'
	const DOWNLOAD_CLASS = 'totmin-batch-download-button'
	const NATIVE_DELETE = '.files-list__row-actions-batch-delete button'
	const NATIVE_DOWNLOAD_BUTTON = 'button.files-list__row-actions-batch-download'
	const NATIVE_DOWNLOAD_ENTRY = '.files-list__row-actions-batch-download button'
	const WIDE_CLASS = 'totmin-wide-batch'
	const WIDE_BREAKPOINT = 1024

	/**
	 * Whether the current session is authenticated. Public share pages have no
	 * user and must never see the theme's batch buttons.
	 *
	 * @return {boolean}
	 */
	const isAuthenticated = () => Boolean(window.OC?.getCurrentUser?.()?.uid)

	/**
	 * Localized label of a files batch action, reusing the files app wording.
	 *
	 * @param {string} key the translation key (e.g. 'Download', 'Delete')
	 * @return {string}
	 */
	const label = (key) => (typeof window.OC?.L10N?.translate === 'function')
		? window.OC.L10N.translate('files', key)
		: key

	/**
	 * The overflow (…) trigger of the batch bar: the last `.action-item`
	 * wrapper inside the inline action row. The trigger button inside it is
	 * styled differently across viewport widths, so the wrapper (not the
	 * button class) is the stable anchor.
	 *
	 * @param {HTMLElement} bar the batch actions bar
	 * @return {HTMLButtonElement|undefined}
	 */
	const findOverflow = (bar) => {
		const items = bar.querySelector(ITEMS_SELECTOR)
		if (items === null) {
			return undefined
		}
		const wrappers = Array.from(items.querySelectorAll(':scope > .action-item'))
		const last = wrappers[wrappers.length - 1]
		return last?.querySelector('button') ?? undefined
	}

	/**
	 * Run the native delete batch action by opening the files app overflow menu
	 * and clicking its "Delete" entry, so Nextcloud's own handler (including any
	 * confirmation dialog) runs unchanged.
	 */
	const runNativeDelete = () => {
		const bar = document.querySelector(BAR_SELECTOR)
		if (bar === null) {
			return
		}
		const overflow = findOverflow(bar)
		if (overflow === undefined) {
			return
		}
		overflow.click()
		// The overflow menu is rendered by Vue asynchronously.
		window.setTimeout(() => {
			const item = document.querySelector(NATIVE_DELETE)
			if (item !== null) {
				item.click()
			}
		}, 100)
	}

	/**
	 * Run the native download batch action: on wide layouts the native button
	 * sits inline in the bar, on narrow layouts it lives in the overflow menu.
	 */
	const runNativeDownload = () => {
		const inline = document.querySelector(NATIVE_DOWNLOAD_BUTTON)
		if (inline !== null) {
			inline.click()
			return
		}
		const bar = document.querySelector(BAR_SELECTOR)
		if (bar === null) {
			return
		}
		const overflow = findOverflow(bar)
		if (overflow === undefined) {
			return
		}
		overflow.click()
		window.setTimeout(() => {
			const entry = document.querySelector(NATIVE_DOWNLOAD_ENTRY)
			if (entry !== null) {
				entry.click()
			}
		}, 100)
	}

	/**
	 * @param {string} className the button class
	 * @param {string} key the localized label key
	 * @param {() => void} onClick the click handler
	 * @return {HTMLButtonElement}
	 */
	const createButton = (className, key, onClick) => {
		const button = document.createElement('button')
		button.type = 'button'
		button.className = className
		button.textContent = label(key)
		button.addEventListener('click', onClick)
		return button
	}

	const appContent = () => document.querySelector('#app-content-vue')

	/**
	 * Keep the batch bar in sync: ensure the [Download][Delete] pair is present
	 * and placed right before the overflow menu (i.e. after the last inline
	 * action). Guests get nothing. Idempotent — a correctly placed pair is left
	 * untouched, so the observer cannot re-trigger itself.
	 */
	const syncBar = () => {
		const app = appContent()
		if (app !== null) {
			// Match Nextcloud's own "isWide" breakpoint (app-content width).
			app.classList.toggle(WIDE_CLASS, app.clientWidth >= WIDE_BREAKPOINT)
		}
		const bar = document.querySelector(BAR_SELECTOR)
		if (bar === null) {
			return
		}
		const items = bar.querySelector(ITEMS_SELECTOR)
		if (items === null) {
			return
		}
		if (!isAuthenticated()) {
			bar.querySelectorAll(`.${DELETE_CLASS}, .${DOWNLOAD_CLASS}`).forEach((node) => node.remove())
			return
		}
		const wrappers = Array.from(items.querySelectorAll(':scope > .action-item'))
		const overflow = wrappers[wrappers.length - 1]
		const download = items.querySelector(`.${DOWNLOAD_CLASS}`)
		const del = items.querySelector(`.${DELETE_CLASS}`)
		const correct = download !== null && del !== null
			&& download.parentElement === items && del.parentElement === items
			&& download.nextElementSibling === del
			&& (overflow === undefined ? del.nextElementSibling === null : del.nextElementSibling === overflow)
		if (correct) {
			return
		}
		// Remove misplaced buttons (e.g. left behind by a Vue re-render) before
		// re-inserting the pair right before the overflow menu.
		bar.querySelectorAll(`.${DELETE_CLASS}, .${DOWNLOAD_CLASS}`).forEach((node) => node.remove())
		const downloadButton = createButton(DOWNLOAD_CLASS, 'Download', runNativeDownload)
		const deleteButton = createButton(DELETE_CLASS, 'Delete', runNativeDelete)
		if (overflow !== undefined) {
			items.insertBefore(downloadButton, overflow)
			items.insertBefore(deleteButton, overflow)
		} else {
			items.appendChild(downloadButton)
			items.appendChild(deleteButton)
		}
	}

	/**
	 * Replace the row preview / default icon with a per-type colored icon.
	 * Rows are skipped once marked, so the observer cannot re-trigger itself.
	 */
	const syncIcons = () => {
		const data = window.TOTMIN_FILE_ICONS
		if (!data) {
			return
		}
		document.querySelectorAll('.files-list__row').forEach((row) => {
			if (row.getAttribute('data-totmin-icon') !== null) {
				return
			}
			const name = row.getAttribute('data-cy-files-list-row-name')
			const iconWrap = row.querySelector('.files-list__row-icon')
			if (!name || iconWrap === null) {
				return
			}
			const isDir = iconWrap.querySelector('.folder-icon') !== null
				|| iconWrap.querySelector('.files-list__row-icon-preview') === null
			let svg
			if (isDir) {
				svg = data.svg._folder
			} else {
				const lower = name.toLowerCase()
				let icon = data.names[lower]
				if (!icon) {
					// e.g. README.md -> readme, LICENSE.txt -> license
					icon = data.names[lower.replace(/\.[^.]+$/, '')]
				}
				if (!icon) {
					const dot = lower.lastIndexOf('.')
					const ext = dot > 0 ? lower.slice(dot + 1) : ''
					icon = data.ext[ext] || 'file'
				}
				svg = data.svg[icon] || data.svg.file
			}
			if (!svg) {
				return
			}
			iconWrap.querySelectorAll('.files-list__row-icon-preview-container, .material-design-icon')
				.forEach((node) => { node.style.display = 'none' })
			const holder = document.createElement('div')
			holder.className = isDir ? 'totmin-file-icon totmin-file-icon--folder' : 'totmin-file-icon'
			holder.innerHTML = svg
			iconWrap.appendChild(holder)
			row.setAttribute('data-totmin-icon', '1')
		})
	}

	/**
	 * Called on every DOM change: keep the batch bar and the file icons in sync.
	 */
	const onDomChange = () => {
		syncBar()
		syncIcons()
	}

	const target = appContent() ?? document.body
	const observer = new MutationObserver(onDomChange)
	observer.observe(target, { childList: true, subtree: true })
	if (appContent() !== null) {
		const widthObserver = new ResizeObserver(onDomChange)
		widthObserver.observe(appContent())
	}
	onDomChange()
})