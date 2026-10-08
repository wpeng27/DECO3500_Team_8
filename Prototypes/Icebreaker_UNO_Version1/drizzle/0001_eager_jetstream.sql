CREATE TABLE `postgame_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`recipient_id` text,
	`message` text NOT NULL,
	`anonymous` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_postgame_messages_session_id` ON `postgame_messages` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_postgame_messages_recipient_id` ON `postgame_messages` (`recipient_id`);--> statement-breakpoint
ALTER TABLE `players` ADD `post_game_status` text DEFAULT 'undecided' NOT NULL;--> statement-breakpoint
ALTER TABLE `players` ADD `replay_vote` integer DEFAULT false NOT NULL;