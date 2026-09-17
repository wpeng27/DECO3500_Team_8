CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`type` text NOT NULL,
	`message` text NOT NULL,
	`player_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_events_session_id` ON `events` (`session_id`);--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`contact_consent` integer DEFAULT false NOT NULL,
	`token` text NOT NULL,
	`team` text NOT NULL,
	`initial_team` text NOT NULL,
	`is_leader` integer DEFAULT false NOT NULL,
	`leader_cards` integer DEFAULT 7 NOT NULL,
	`last_notification` text,
	`joined_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `players_token_unique` ON `players` (`token`);--> statement-breakpoint
CREATE INDEX `idx_players_session_id` ON `players` (`session_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`host_key` text NOT NULL,
	`assignment_mode` text DEFAULT 'random' NOT NULL,
	`status` text DEFAULT 'lobby' NOT NULL,
	`direction` text DEFAULT 'clockwise' NOT NULL,
	`current_round` integer DEFAULT 0 NOT NULL,
	`current_rule` text,
	`rule_history` text DEFAULT '[]' NOT NULL,
	`last_rule_change_round` integer DEFAULT 0 NOT NULL,
	`duration_seconds` integer DEFAULT 600 NOT NULL,
	`ends_at` integer,
	`paused_remaining` integer DEFAULT 600 NOT NULL,
	`winner` text,
	`created_at` integer NOT NULL
);
