# Athlete Performance App — Phase 72.3.5

## Simplified navigation

The bottom navigation is reduced to five clear destinations:

1. **Overview**
2. **Plan**
3. **Train**
4. **Progress**
5. **More**

No features were removed.

Grouped features:
- Plan → Goals + Schedule
- Train → Development + Readiness/Coach
- Progress → Testing + Analytics
- More → Competition + Roster when the role has Roster access

When a group contains multiple sections, a small contextual selector appears inside that area. The former quick-navigation search is still available through **More → Search All Features**.

## Sport + Position Workout Builder

The Training Program generator now uses both:
- athlete sport
- athlete position

Position-specific demand profiles are included for:
- Baseball
- Football
- Ice Hockey
- Basketball
- Lacrosse
- Wrestling
- Soccer
- Figure Skating

Examples:
- Hockey Goaltender → lateral power, deceleration, hip/adductor robustness, reaction
- Hockey Defense → backward-to-forward acceleration, crossover power, lower-body strength
- Football speed positions → acceleration, max-speed mechanics, COD, elastic power
- Soccer wide players → high-speed running, acceleration, hamstring strength
- Baseball Pitcher → lower-body force, rotational power, single-leg control, scapular robustness
- Basketball Guards → first-step speed, lateral COD, deceleration
- Lacrosse Midfield → repeated-sprint ability and aerobic support
- Figure Skating Singles → jump power, landing control, single-leg strength, rotation speed

## Evidence-informed programming framework

Generated programs now emphasize:
- sprint and power work before fatigue
- adequate recovery for quality sprint repetitions
- progressive strength with reps in reserve
- combined strength, plyometric, and sprint exposure
- reactive change-of-direction instead of only pre-planned drills
- position-specific work/rest demands
- season phase: Off-season, Pre-season, In-season
- readiness-aware volume reduction when readiness is below 60
- developmentally appropriate technique and supervision

All Phase 72.2 account, Parent multi-player, Coach Team, team invite, cloud sync, setup, Help, readiness, testing, goals, analytics, competition, and beta feedback features are preserved.


## Navigation scroll behavior

Whenever the user opens a different app section/tab, the page automatically returns to the top of the newly opened section. This applies to the simplified bottom navigation, grouped navigation, setup/help navigation, and feature-search navigation because they all use the same tab state.


## Phase 72.3.2 syntax fix

Removed an accidental leading backslash at the start of `components/BetaGate.tsx` that caused Next.js/SWC to report `Expected unicode escape`. No app functionality was removed.


## Phase 72.3.3 syntax fix

Fixed the malformed `mainSets("3","2")` call in the sport/position workout generator that caused Next.js to report `Expected ',', got 'numeric literal (3, 3)'`.

Everything from Phase 72.3.2 is preserved.


## Phase 72.3.4 verification fixes

A deeper code review found and corrected several non-syntax issues:

- cloud workspace switching now waits for the selected athlete's cloud data to finish loading before autosave can begin
- prevents a slow network response from risking the previous athlete's data being saved into a newly selected athlete workspace
- Parent accounts no longer attempt cloud writes that their read-only permissions correctly reject
- Soccer Center Back now receives a dedicated Center Back training-demand profile rather than the Fullback profile
- beta version labels and feedback version now match 72.3.4
- `.gitignore` is included in the release package

The previous BetaGate and workout-generator syntax fixes remain included.


## Phase 72.3.5 Supabase migration fix

Fixed the `parent_create_athlete` PostgreSQL function. Its `RETURNS TABLE` declaration used `position` as an output-column identifier, which PostgreSQL parsed as a keyword in this context and rejected with `syntax error at or near "position"`.

The output column is now `athlete_position`. The app only relies on the returned athlete id, workspace id, and display name, so this change does not remove or change any app functionality.

The migration remains safe to re-run over the partially created Phase 72.2/72.3 beta schema because its tables use `IF NOT EXISTS`, functions use `CREATE OR REPLACE`, triggers are dropped before recreation, and policies are dropped before recreation.
