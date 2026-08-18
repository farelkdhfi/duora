# Duora — A Digital Space for Couples

Duora is a web application designed to help couples manage and grow their relationship in a structured way — from shared financial goals, daily mood journals, and idea notes to an AI-assisted discussion space for resolving disagreements in a healthy and constructive way.

## ✨ Key Features

### 🎯 Shared Goals & Savings

Create shared financial or non-financial goals with your partner, such as a vacation fund, wedding fund, or personal milestones. Each goal includes progress checklists and contribution history from both partners.

### 💭 Mood Check-in

A daily journal for each partner to record their mood, energy level, and stress level — along with notes about what they liked or disliked that day and what they need from their partner. This helps couples stay aware of each other's emotional state, even on busy days when direct communication is difficult.

### 📝 Notes

A shared space for date ideas, travel plans, small messages, and other thoughts. Notes support categories, pinning, favorites, and simple checklists, and are displayed in an editable masonry board with inline editing.

### 📊 Activity Feed

An automatic timeline that records all couple activities — goals created, savings added, checklists completed, mood check-ins, and more. The entire feed is powered by database triggers, without requiring manual logging code in the application layer.

### 🤖 AI Debate — AI-Powered Discussion Mediator

The most complex feature in the application: a real-time chat space where couples can discuss topics they disagree on, with AI acting as a neutral mediator that:

* Separates **opinions** from **facts** in each person's arguments
* Responds contextually throughout the discussion rather than providing a single response and stopping
* Provides a **final conclusion** that evaluates which arguments are more logically sound from an objective perspective — without taking sides personally
* Supports customizable **communication styles**: Formal, Gentle, Playful, or Dramatic
* Uses **dual AI providers** (OpenRouter + Groq) with automatic fallback — if one provider is unavailable or reaches its rate limit, the system automatically switches to the backup provider without disrupting the user experience

## 🛠️ Tech Stack

* **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
* **State & Data Fetching**: TanStack Query (React Query)
* **Backend**: Supabase (PostgreSQL, Row Level Security, Edge Functions, Realtime)
* **AI**: OpenRouter & Groq APIs with automatic fallback
* **Validation**: Zod + React Hook Form

## 🏗️ Architecture Highlights

* **Database-driven activity logging** — the entire activity feed is powered by PostgreSQL triggers rather than application code, ensuring consistent activity logs even when new endpoints are added without explicitly implementing activity logging.

* **Full Row Level Security** — every table is protected by database-level access policies, ensuring data access is validated at the database layer rather than relying solely on application-level checks.

* **Real-time architecture** — Supabase Realtime (Postgres Changes) is used for chat messages, discussion status, and list synchronization without relying on polling.

* **Race-condition-safe AI trigger** — a unique partial index at the database level ensures that only one final AI conclusion can be stored, even when both partners access the application simultaneously.

* **Resilient AI pipeline** — automatic fallback between AI providers, safeguards against malformed AI responses, and automatic recovery from processing failures prevent the application from becoming stuck in an inconsistent state.

## 🚀 Live Demo

https://duora-grow-together.vercel.app