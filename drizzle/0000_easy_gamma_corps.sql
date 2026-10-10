CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`idempotency_key` text NOT NULL,
	`payload_hash` text NOT NULL,
	`product_id` text NOT NULL,
	`product_name` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` integer NOT NULL,
	`delivery` integer NOT NULL,
	`total` integer NOT NULL,
	`currency` text NOT NULL,
	`full_name` text NOT NULL,
	`mobile` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_idempotency_key_unique` ON `orders` (`idempotency_key`);