-- Add AI / personalization columns to existing tables
ALTER TABLE `trips` ADD COLUMN `aiPreferences` json;
--> statement-breakpoint
ALTER TABLE `destination_guides` ADD COLUMN `trendingTags` json;
--> statement-breakpoint
ALTER TABLE `destination_guides` ADD COLUMN `vrTourUrl` text;
--> statement-breakpoint

CREATE TABLE `identity_wallet` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`documentType` enum('passport','id_card','drivers_license','tsa_precheck','global_entry','loyalty_number','payment_token','other') NOT NULL DEFAULT 'other',
	`label` varchar(255) NOT NULL,
	`tokenRef` text,
	`maskedHint` varchar(64),
	`expiryDate` timestamp,
	`verifiedAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `identity_wallet_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint

CREATE TABLE `accessibility_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mobilityNeeds` json,
	`neurodivergentNeeds` json,
	`medicalNeeds` json,
	`dietaryRestrictions` json,
	`serviceAnimal` boolean NOT NULL DEFAULT false,
	`notes` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accessibility_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `accessibility_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint

CREATE TABLE `client_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` varchar(64) NOT NULL,
	`payload` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `client_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint

CREATE TABLE `collaborators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`role` enum('viewer','editor') NOT NULL DEFAULT 'viewer',
	`token` varchar(128) NOT NULL,
	`acceptedAt` timestamp,
	`acceptedByUserId` int,
	`expiresAt` timestamp NOT NULL,
	`invitedByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collaborators_id` PRIMARY KEY(`id`),
	CONSTRAINT `collaborators_token_unique` UNIQUE(`token`)
);
