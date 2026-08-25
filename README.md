# Athlete Performance App — Phase 71.9

## Changes
- Renamed **Export Results CSV** to **Download Test Results**.
- Test-results download now uses `test-results.csv`.
- Bottom navigation indicator remains visual-only but now moves with the user's horizontal tab scrolling.
- Fixed local-date handling to prevent dates appearing one day behind because of UTC conversion.
- Weekly Review now displays **Week of [date]**.
- On Sundays, if the current week's review has not been completed, the app prompts the athlete to fill out the weekly review.
- Each day, if today's readiness check-in has not been completed, the app prompts the athlete to complete it.
- “Not now” dismisses the daily readiness reminder for that day and the weekly-review reminder for that week.
- Prompt buttons jump directly to the correct area of the app.

All guided setup and Help overview behavior from Phase 71.8 remains included.
