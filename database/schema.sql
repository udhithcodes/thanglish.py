-- =============================================================================
-- thanglish.py — Relational MySQL Database Schema
-- Multi-User Auth, Question Bank, Translations, Quizzes, Progress
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `thanglish_db` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `thanglish_db`;

-- 1. Users Table (Permanent User ID + UUID Internal PK)
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(32) NOT NULL,
    `full_name` VARCHAR(128) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NULL,
    `profile_picture` VARCHAR(500) NULL,
    `preferred_language` VARCHAR(16) NOT NULL DEFAULT 'tanglish',
    `current_level` VARCHAR(32) NOT NULL DEFAULT 'Beginner',
    `role` VARCHAR(32) NOT NULL DEFAULT 'student',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_users_user_id` (`user_id`),
    UNIQUE KEY `uq_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Authentication Identities Table (Supports Multi-Provider Linking)
CREATE TABLE IF NOT EXISTS `auth_identities` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `provider` VARCHAR(32) NOT NULL, -- 'email', 'google', 'github'
    `provider_user_id` VARCHAR(255) NOT NULL,
    `provider_email` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_provider_identity` (`provider`, `provider_user_id`),
    INDEX `idx_auth_identities_user_id` (`user_id`),
    CONSTRAINT `fk_auth_identities_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Password Reset Tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `used_at` DATETIME NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_reset_token` (`token`),
    INDEX `idx_reset_user` (`user_id`),
    CONSTRAINT `fk_reset_tokens_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Topics Table
CREATE TABLE IF NOT EXISTS `topics` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `level` VARCHAR(32) NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
    `description` TEXT NULL,
    `icon` VARCHAR(64) NOT NULL DEFAULT 'book',
    `order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_topics_name` (`name`),
    UNIQUE KEY `uq_topics_slug` (`slug`),
    INDEX `idx_topics_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Questions Table
CREATE TABLE IF NOT EXISTS `questions` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `topic_id` INT NOT NULL,
    `level` VARCHAR(32) NOT NULL,
    `question_type` VARCHAR(32) NOT NULL DEFAULT 'mcq',
    `title` VARCHAR(255) NOT NULL,
    `english_question` TEXT NOT NULL,
    `code_snippet` TEXT NULL,
    `expected_output` TEXT NULL,
    `explanation` TEXT NULL,
    `hints` TEXT NULL,
    `points` INT NOT NULL DEFAULT 10,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_questions_topic` (`topic_id`),
    INDEX `idx_questions_level` (`level`),
    INDEX `idx_questions_type` (`question_type`),
    CONSTRAINT `fk_questions_topic` FOREIGN KEY (`topic_id`) 
        REFERENCES `topics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Question Options (for MCQs, Predict Output, Find Error)
CREATE TABLE IF NOT EXISTS `question_options` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `question_id` INT NOT NULL,
    `option_key` VARCHAR(8) NOT NULL, -- 'A', 'B', 'C', 'D'
    `option_text` TEXT NOT NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT FALSE,
    `order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    INDEX `idx_options_question` (`question_id`),
    CONSTRAINT `fk_options_question` FOREIGN KEY (`question_id`) 
        REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Question Translations (English, Tanglish, Tamil Script)
CREATE TABLE IF NOT EXISTS `question_translations` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `question_id` INT NOT NULL,
    `language` VARCHAR(16) NOT NULL, -- 'tanglish', 'ta'
    `translated_question` TEXT NOT NULL,
    `translated_explanation` TEXT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'verified',
    `reviewed` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_question_language` (`question_id`, `language`),
    CONSTRAINT `fk_translations_question` FOREIGN KEY (`question_id`) 
        REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Coding Test Cases
CREATE TABLE IF NOT EXISTS `coding_test_cases` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `question_id` INT NOT NULL,
    `input_data` TEXT NULL,
    `expected_output` TEXT NOT NULL,
    `is_hidden` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`id`),
    INDEX `idx_test_cases_question` (`question_id`),
    CONSTRAINT `fk_test_cases_question` FOREIGN KEY (`question_id`) 
        REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Quiz Attempts
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `level` VARCHAR(32) NOT NULL,
    `topic_id` INT NULL,
    `mode` VARCHAR(32) NOT NULL DEFAULT 'test',
    `total_questions` INT NOT NULL DEFAULT 0,
    `score` INT NOT NULL DEFAULT 0,
    `accuracy` FLOAT NOT NULL DEFAULT 0.0,
    `time_taken_seconds` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_quiz_user` (`user_id`),
    CONSTRAINT `fk_quiz_attempts_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. User Answers
CREATE TABLE IF NOT EXISTS `user_answers` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `quiz_attempt_id` VARCHAR(36) NULL,
    `question_id` INT NOT NULL,
    `user_answer` TEXT NOT NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT FALSE,
    `points_earned` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_answers_user` (`user_id`),
    INDEX `idx_answers_question` (`question_id`),
    INDEX `idx_answers_quiz` (`quiz_attempt_id`),
    CONSTRAINT `fk_answers_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_answers_question` FOREIGN KEY (`question_id`) 
        REFERENCES `questions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_answers_quiz` FOREIGN KEY (`quiz_attempt_id`) 
        REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Bookmarks Table
CREATE TABLE IF NOT EXISTS `bookmarks` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `question_id` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_user_question_bookmark` (`user_id`, `question_id`),
    INDEX `idx_bookmarks_user` (`user_id`),
    CONSTRAINT `fk_bookmarks_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_bookmarks_question` FOREIGN KEY (`question_id`) 
        REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. User Progress Table
CREATE TABLE IF NOT EXISTS `user_progress` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `topic_id` INT NOT NULL,
    `level` VARCHAR(32) NOT NULL,
    `questions_attempted` INT NOT NULL DEFAULT 0,
    `questions_correct` INT NOT NULL DEFAULT 0,
    `accuracy` FLOAT NOT NULL DEFAULT 0.0,
    `last_activity_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_user_topic_progress` (`user_id`, `topic_id`),
    INDEX `idx_progress_user` (`user_id`),
    CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_progress_topic` FOREIGN KEY (`topic_id`) 
        REFERENCES `topics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
