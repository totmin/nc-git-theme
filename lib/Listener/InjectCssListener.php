<?php

declare(strict_types=1);

namespace OCA\NcTotminTheme\Listener;

use OCA\NcTotminTheme\AppInfo\Application;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * @template-implements IEventListener<Event>
 */
class InjectCssListener implements IEventListener {
	public function handle(Event $event): void {
		Util::addStyle(Application::APP_ID, 'custom');
		Util::addScript(Application::APP_ID, 'filetypes');
		Util::addScript(Application::APP_ID, 'files');
		Util::addScript(Application::APP_ID, 'navigation');
	}
}