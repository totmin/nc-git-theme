<?php

declare(strict_types=1);

namespace OCA\NcTotminTheme\AppInfo;

use OCA\NcTotminTheme\Listener\InjectCssListener;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\Events\BeforeLoginTemplateRenderedEvent;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;

class Application extends App implements IBootstrap {
	public const APP_ID = 'nc-totmin-theme';

	public function __construct(array $urlParams = []) {
		parent::__construct(self::APP_ID, $urlParams);
	}

	public function register(IRegistrationContext $context): void {
		// Authenticated pages (all apps — selectors are scoped in custom.css)
		$context->registerEventListener(BeforeTemplateRenderedEvent::class, InjectCssListener::class);
		// Login page
		$context->registerEventListener(BeforeLoginTemplateRenderedEvent::class, InjectCssListener::class);
	}

	public function boot(IBootContext $context): void {
	}
}