# Athlete Performance App — Phase 72.3.20

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


## Phase 72.3.6 Admin Roster fix

Fixed two Admin navigation issues introduced by the simplified navigation:
- Admin's visible tab list now includes `Roster`, so **More** correctly offers both Competition and Roster.
- The Roster page renderer now allows both Coach and Admin roles.

Also permanently includes the authenticated API grants that were required for the live Supabase beta so future database setups do not hit the false `Account is not active` state.


## Phase 72.3.7 — Setup + complete feature overview

The guided setup now teaches the simplified five-button navigation while users complete the essential setup tasks.

After setup finishes, the app automatically opens a quick role-specific tour containing:
- Overview / Plan / Train / Progress / More navigation map
- a 3-step explanation of how to navigate
- every in-app feature available to the signed-in role
- a short description of what each feature does
- exactly where each feature lives in the simple navigation
- direct Open buttons for every feature
- role-specific account tools for Player, Parent, Coach, or Admin
- Start Using App button after setup
- Restart Setup Guide option

After setup has already been completed, the header **Help** button opens the same feature guide as an always-available “How to use the app” reference.

No app functionality was removed.


## Phase 72.3.8 — Guided setup Continue label

Changed the green next-step button in Guided Setup from **Skip this step** to **Continue**. The final setup button remains **Finish**.


## Phase 72.3.9 — Player Setup save gate + sport-first profile

Fixed Guided Setup so Player Setup cannot advance while the user is still filling out the player.

Changes:
- Player profile editing now uses a temporary draft instead of saving every keystroke.
- Guided Setup advances only after **Save Player** is tapped and the required player fields are complete.
- The setup guide's Continue button cannot bypass an unsaved Player Setup step.
- Player Setup now includes **Sport** inside the profile form.
- Sport appears before Position and changing Sport resets Position, ensuring the Position dropdown always matches the selected sport.
- Profile edits can be canceled without changing saved player data.
- Player profile summary now includes Sport.


## Phase 72.3.10 — Guided setup exploration-step fix

Fixed the informational setup steps so opening a feature no longer immediately advances to the next setup step.

Updated Development, Competition, and Roster setup steps:
- tapping the green Open button now actually leaves the guide open in the selected app feature;
- the setup banner tells the user to explore the feature;
- **Return to Guide** brings the user back to the same setup step;
- **Continue** then advances manually to the next setup step.

Action-driven setup steps such as Player Setup, Goals, Testing, Schedule, and Readiness still auto-advance only after their required action is completed.


## Phase 72.3.11 — Age-aware, sport/position-specific workouts + custom workout builder

- Added player **Age** to Player Setup and profile data.
- The recommended workout generator now requires and uses Sport + exact Position + Age, then further adjusts for season phase, readiness, and equipment.
- Added age-band guardrails for weekly frequency, session length, strength volume, speed/power volume, and youth exercise progression.
- Replaced generic movement blocks with sport- and position-specific warm-ups, speed patterns, reaction drills, skill-transfer work, and conditioning patterns.
- Shared foundational strength remains only where the same movement quality is appropriate across sports.
- Removed generic YouTube search and Google image-search links. The app now shows a demo only when a specific curated resource is mapped to that exercise/sport/position.
- Added a Player-accessible **Create Your Own Custom Workout** builder with exercise-by-exercise phases, sets, reps/time, rest, purpose, and instructions. Custom workouts save directly to Schedule.
- Generated workouts now save their exercise list to Schedule too, and the Workout Log can expand those exercises.
- Existing cloud workspace storage automatically carries the new profile age and custom workout fields; no Supabase schema migration is required.


## Phase 72.3.12 — Verified full-routine video matching

Workout videos now follow a strict rule: **one routine = one matching reference video**.

- No per-exercise video is rendered in generated workouts.
- A video appears only when the session was built from that video's published workout routine.
- Exercise names and order match the source routine.
- Age can adjust dose, rest, or an easier variation, and the app explains that clearly.
- Ice Hockey recommendations in the workout builder are marked **Off-Ice / Dryland**.

### 8–10U Ice Hockey Goaltender
The app includes a verified no-equipment Goaltender reference routine using Maria Mountain / GoalieTrainingProTV's **4 minute no equipment workouts for goalies**.

The source video's three sections are represented as three distinct sessions:
- Mobility 4
- Strength 4
- Stamina 4

Each session carries the same full-routine video once at the top and labels which exact section it follows. The movement names/order match the published video workout breakdown; the app scales duration and easier variations for ages 8–10.

When a verified routine is added to Schedule, its single matching reference video follows it into the Workout Log.

For other sport / position / age combinations, the app does not show a routine video until a complete routine has been verified, preventing mismatched references.


## Phase 72.3.13 — Age-based workout duration + strict video bundles

### Workout duration rules
Generated and custom workout duration choices now follow:
- Ages 7–9: **15–45 minutes**
- Ages 10–12: **30–75 minutes**
- Ages 13+: **30–120 minutes**

Choices are available in 5-minute increments.

Players see **Workout Length** and select their own duration.
Coach/Admin views see **Assigned Workout Length** and assign the duration for the active athlete.

Generated sessions use the selected/assigned duration and scale the exercise prescription to the chosen session time. The duration and assigning/selecting role are stored with the program and scheduled workout.

### Strict video matching
Video references now support **multiple videos per workout**. A 15-minute workout can therefore use three verified 5-minute videos, for example.

A video is eligible only if all of these match:
- sport;
- exact position/position group;
- player age band;
- off-ice environment when applicable;
- exercise names contained in the generated workout.

If an exact match has not been verified, the app displays the written exercise instructions and intentionally shows **no video**.

The previously used GoalieTrainingProTV routine is not attached to the 7–9 Goaltender workout under this stricter rule because it is goalie-specific but is not explicitly age-specific enough to satisfy the new requirement.

### Hockey
Hockey generated workouts remain **Off-Ice / Dryland**.


## Phase 72.3.14 — Universal training rules + age 9 in 10–13 group

Chronological age and training group are now separate.

- A 9-year-old keeps the Ages 7–9 workout duration rule: **15–45 minutes**.
- For training/exercise selection, progressions, volume, and verified-video age matching, age 9 uses the **10–13 Development Group**.
- This applies to every sport and every exact position.

Universal generated-workout order:
1. chronological age -> duration limits;
2. training age group -> exercise progression;
3. exact sport;
4. exact position;
5. Player-selected or Coach-assigned duration;
6. readiness + season;
7. generated exercise list;
8. strict verified video-bundle matching.

Strict video bundles must match sport, exact position, training age group, hockey off-ice requirement, the full workout exercise list, and selected total workout time. Multiple videos are allowed only when their combined duration exactly equals the selected workout length and together they cover every exercise.

The verified video catalog remains empty until a source has been checked against every required field. The app intentionally prefers written instructions with no video over an approximate match.


## Phase 72.3.15 — Training age initialization fix

Fixed a runtime regression in the workout generator where `validAge` referenced `trainingAge` before `trainingAge` had been initialized.

Correct order:
1. read chronological `ageNumber`;
2. validate `ageNumber`;
3. derive `trainingAge`;
4. derive `trainingGroup`;
5. build the age-aware program.

Age 9 still uses the 10–13 training/exercise group while keeping the Ages 7–9 workout-duration limits.


## Phase 72.3.16 — Detailed exercise guides + verified youth-goalie media

Generated exercise cards now include an expandable **How to do this exercise** section with setup, numbered steps, key cues, mistakes to avoid, and age/safety guidance.

A verified visual/video reference is now included for the 9–13 Ice Hockey Goaltender development group using Goalie Training Pro / Maria Mountain's **Safe Stretches For Young Goalies** video. The app displays its thumbnail, source, direct link, and an explicit explanation of what it covers.

The video is used only for the exact seven mobility exercises demonstrated in the source:
- Supine Hip Internal Rotation
- 3-Way Hamstring With Strap
- Half-Kneeling Hip Flexor
- Hip Flexor With Foot on Wall
- Half-Kneeling Groin
- Kneeling Lat Stretch
- Active Ankle Dorsiflexion

For a 15-minute age 9–13 Goaltender plan, the first generated session is this verified off-ice mobility routine. Longer first sessions use the verified mobility block plus additional clearly separated position-specific work. The reference video is never presented as demonstrating exercises outside its verified block.

The detailed exercise guides also follow generated workouts into Schedule. The universal sport/age/position/duration matching rules remain in place for all other media.


## Phase 72.3.17 — Larger text + Settings menu

The default app typography is now **Comfortable (110%)**, making everyday text, workout instructions, labels, buttons, navigation, and exercise coaching significantly easier to read.

A new **Settings** button appears in the top header beside Help.

### Text-size choices
- Standard — 100%
- Comfortable — 110% (new default)
- Large — 120%
- Extra Large — 132%

The setting updates the app immediately and is saved locally on the device using `uiTextSize`, so users do not need to choose it again every time they sign in.

The sizing system specifically raises minimum text sizes for:
- paragraphs and lists;
- labels and form controls;
- buttons and navigation;
- cards and small helper text;
- detailed exercise instructions;
- setup / steps / cues / mistakes / safety text;
- verified workout video descriptions.

Large score/stat values remain visually prominent while normal reading text gets the larger accessibility treatment.


## Phase 72.3.18 — Sleep Recovery Guide

Added a practical **Sleep Improvement Guide** to the Readiness / Recovery section.

### Age-aware sleep targets
The guide uses Player Profile age to display:
- ages 6–12: 9–12 hours;
- ages 13–18: 8–10 hours;
- adults: 7–9 hours.

### Interactive bedtime planner
Players can enter tomorrow's wake-up time and see the recommended bedtime window calculated from their age-based sleep target.

### Wind-down routine
The guide walks the athlete through:
- 60 minutes before bed;
- 30 minutes before bed;
- 10 minutes before bed;
- lights out.

### Athlete recovery guidance
Includes practical cards for:
- morning light;
- schedule consistency;
- caffeine;
- late practices;
- naps;
- using readiness logs to identify sleep/performance patterns.

### Trouble sleeping
Includes a simple non-screen reset and clear guidance to involve a parent/guardian and healthcare professional for persistent difficulty, significant daytime sleepiness, loud snoring, gasping/choking, or other concerning symptoms.

The guide is educational and does not diagnose or treat sleep disorders.

All Phase 72.3.17 text-size settings are retained, so the sleep guide also responds to Standard, Comfortable, Large, and Extra Large text preferences.


## Phase 72.3.19 — Mindful Recovery & Meditation

Added a guided mindfulness section to Readiness / Recovery alongside the Sleep Improvement Guide.

### Guided meditation lengths
Players can choose:
- **3 minutes** — quick reset;
- **5 minutes** — recovery meditation;
- **10 minutes** — longer body scan.

Each routine is broken into simple step-by-step cards. Players use Back / Next Step controls instead of being shown a long block of instructions at once.

### Meditation content
Includes:
- settling into a comfortable position;
- natural breath awareness;
- body scanning;
- noticing thoughts without following them;
- simple recovery intentions;
- gradual return to normal activity.

### Athlete use cases
The guide explains how to use mindfulness:
- after practice;
- before sleep;
- on a stressful day;
- briefly before competition.

### Youth-friendly safeguards
The app explains that:
- wandering attention is normal;
- breathing should never be forced;
- eyes can stay open;
- short sessions are useful;
- mindfulness is optional and is not a substitute for professional mental-health care, medical care, sleep, food, hydration, or appropriate recovery.

Phase 72.3.18 Sleep Improvement Guide and Phase 72.3.17 text-size Settings are preserved.


## Phase 72.3.20 — Mobile beta/account tools moved to header

Fixed the small-screen overlap where beta/account action buttons could sit on top of the fixed bottom navigation.

The floating bottom-right beta utility bar has been removed.

Role-specific beta actions now appear in the top app header next to Settings / Help:
- Parent: **My Players**
- Player: **Join Team**
- Coach: **Teams**
- Coach while viewing an athlete: **Coach Home**
- Admin: **Beta Admin**
- Everyone: **Report Problem**

On phones, the header actions use a compact two-column grid so they remain available without covering Overview / Plan / Train / Progress / More at the bottom.

All existing modals and permissions are unchanged; only the entry-point location/layout changed.

Phase 72.3.19 mindful recovery, Phase 72.3.18 sleep recovery, and Phase 72.3.17 text-size Settings are preserved.
