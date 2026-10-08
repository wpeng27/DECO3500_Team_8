CREATE TABLE `ice_sessions` (
	`code` text PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `ice_sessions_expiry` ON `ice_sessions` (`expires_at`);