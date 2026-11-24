# Database Setup

## Requirements
- XAMPP with MySQL running

## Steps

1. Open phpMyAdmin at `http://localhost/phpmyadmin`
2. Click **Import** tab
3. Click **Choose File** and select `asdeleon.sql`
4. Click **Import**

The `asdeleon` database will be created automatically with all tables and default settings.

## Tables
- `users` — owner, employee, and customer accounts
- `attendance` — employee time in and time out records
- `project_errors` — employee deduction records
- `settings` — system settings (work start time, rates)

## Default Settings
| Key | Value |
|-----|-------|
| `work_start` | 08:00:00 |
| `absent_rate_per_day` | 500.00 |
| `late_rate_per_hour` | 50.00 |
| `break_minutes` | 60 |
