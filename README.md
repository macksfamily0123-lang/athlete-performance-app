# Athlete Performance App — Phase 72.3.41

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


## Phase 72.3.21 — Shared Coach / Parent Notes + easier Parent navigation

### Shared support-team notes
The old **Private Coach Notes** section is replaced by **Coach / Parent Notes**.

Shared notes are visible in the athlete workspace to the athlete support team and may be entered as:
- Coach
- Parent
- Athlete
- Medical Provider
- Admin (Admin workspace only)

Each note includes:
- source / author type;
- author name;
- topic;
- title;
- note body;
- date.

Legacy Coach notes remain visible in Shared Note History.

A Medical Provider source is supported for entering information supplied by a provider. This phase does **not** create a separate Medical Provider login/account role; it does not verify clinical credentials and is not intended to be a medical-record system.

### Parent permissions
Parent accounts can now add **shared notes**, but they still cannot modify the athlete's general training/performance workspace.

This is enforced with `002_shared_support_notes.sql`, which adds a `save_shared_notes` RPC. The function:
- requires authentication;
- verifies that the user can access the athlete workspace;
- permits Player / Coach / Parent / Admin;
- updates only the `coachNotes` shared-note array inside `workspace_state`;
- leaves the rest of the Parent workspace read-only.

### Parent navigation
Parent navigation now includes **Recovery & Notes** under Train.

Parent Overview adds large direct shortcuts:
- Schedule
- Recovery & Notes
- Progress
- Development
- Competition

Parent Recovery & Notes provides:
- readiness/recovery overview;
- Sleep Improvement Guide;
- Mindful Recovery & Meditation;
- shared support-team notes.

The Daily Readiness check-in remains controlled by Player/Coach rather than Parent.

Phase 72.3.20 mobile header tools and all earlier workout/recovery/text-size features are preserved.


## Phase 72.3.22 — Beta Feedback Inbox + signup verification guidance + mobile recovery fix

### Beta Feedback Inbox
Admin → Beta Admin now has two tabs: **Accounts** and **Feedback**. The Feedback inbox reads the existing `beta_feedback` table using the Admin-only RLS policy already installed in the Phase 72 beta foundation. It shows newest reports first, category, tester name/email when available, submitted date/time, app version, report text, and the reported page URL. It supports category filtering and manual refresh.

No Supabase migration is required for the inbox because `beta_feedback` and the Admin read policy already exist.

### Signup verification screen
When Supabase creates an account but requires email confirmation, the signup form now transitions to a dedicated **Check your email** screen. It tells the tester to open the verification email, click the confirmation link, return to the beta site, and sign in. It also explains that Coach/Admin approval can remain pending after email verification and warns against repeatedly requesting verification emails because of rate limits.

### Mobile recovery alignment
On small screens, the **Recovery tool, not a requirement** mindfulness notice now stacks vertically and aligns left so the explanatory text no longer gets pushed far to the right or off center.

Phase 72.3.21 shared support-team notes, Parent navigation, Phase 72.3.20 mobile header tools, and all prior recovery/training features are preserved.


## Phase 72.3.23 — Simplified navigation and interactive Parent experience

This phase is a usability pass focused on making the app easy to understand for Players, Parents, and Coaches, with the largest changes in the Parent workspace.

### Parent navigation
The Parent bottom navigation is now direct:
- Overview
- Schedule
- Recovery
- Progress
- More

Parents no longer need to guess whether a feature is under Plan or Train. **More** contains Development and Competition.

Every Parent page also includes a compact direct section bar so a Parent can move immediately between:
- Overview
- Schedule
- Recovery
- Progress
- Development
- Competition

### Parent Overview
The Parent home page now starts with **What do you want to check?** and direct task buttons.

It also includes:
- clickable snapshot cards;
- a simplified Coming Up list;
- a What Needs Attention section;
- direct links to the relevant page;
- a compact Current Plan summary.

### Interactive Parent pages
Schedule:
- All / Training / Competition / Event filters;
- 14-day / 30-day / All time range;
- expandable rows.

Progress:
- Summary / Testing / Competition views;
- clickable summary cards.

Development:
- Priorities / Program / Milestones views.

Competition:
- Last 5 / Last 10 / All;
- expandable event details;
- direct link to shared notes.

Recovery:
- guides are collapsed by default for Parent accounts;
- Recovery Summary / Sleep Guide / Mindfulness / Shared Notes shortcuts;
- simplified parent recovery explanation.

### Player and Coach usability
Player and Coach Overview action cards are now clickable and take the user directly to the relevant feature.

Internal development jargon such as `PHASE 47`, `PHASE 66`, and similar labels has been removed from major user-facing screens. Page headings now describe what the user is actually looking at.

### Preserved from Phase 72.3.22
- Beta Feedback Inbox;
- post-signup Check Your Email verification screen;
- small-screen Recovery tool / not a requirement alignment fix.

### Preserved from Phase 72.3.21
- shared Coach / Parent / Athlete / Medical Provider notes;
- limited Parent shared-note cloud write RPC and migration.

No new Supabase migration is required for Phase 72.3.23.


## Phase 72.3.24 — Athlete profile sport lock

Sport is now part of the athlete profile instead of a free global selector.

- The sport selected when a profile is saved is stored with that athlete.
- The top sport area remains visible, but it is locked and cannot change the athlete's sport.
- Sport can only be changed through **Overview → Player Profile → Edit Profile**.
- Changing sport in Edit Profile clears the previous position so a valid position for the new sport must be chosen.
- Parent, Coach, and Admin multi-athlete views automatically switch to the selected profile's saved sport.
- Cloud-backed Parent and Coach workspaces use athlete metadata as a fallback for older profiles.
- Existing profiles are automatically upgraded by copying their current sport into the profile record.
- Backup schema is v1.1 / export v15.0.

No new Supabase migration is required for Phase 72.3.24.


## Phase 72.3.25 — Player-only daily check-ins and weekly reviews

Daily readiness check-ins and weekly reviews are now **Player-only entry features**.

### Player
The Player can:
- submit or update today's Daily Check-In;
- enter sleep, energy, soreness, stress, and a personal check-in note;
- complete or update the current Weekly Review;
- record biggest win, main challenge, next-week focus, and weekly rating.

The Player UI explicitly explains that saved results are visible to linked Parents and Coaches.

### Parent
Parents cannot submit or edit Daily Check-Ins or Weekly Reviews.

Parents can view:
- the latest Daily Check-In on Parent Overview;
- sleep / energy / soreness / stress results;
- 7-day readiness trend;
- recent Player Check-In history;
- Player notes attached to check-ins;
- latest Weekly Review;
- recent Weekly Review history.

### Coach / Admin support view
Coach and Admin support views cannot submit or change Daily Check-Ins or Weekly Reviews.

They can view the same Player-entered:
- daily readiness results;
- recent check-in details and notes;
- readiness trends;
- weekly ratings, wins, challenges, and next focus.

### Prompts and setup
Morning Daily Check-In prompts and end-of-week Weekly Review prompts appear only for Player accounts. Coach / Parent / Admin setup no longer asks those roles to complete a Player check-in.

### Cloud protection
The normal Coach/Admin cloud save path preserves the existing Player-entered `readiness` and `weeklyReviews` arrays instead of overwriting them. Parent general cloud writes remain blocked.

No new Supabase migration is required for Phase 72.3.25.


## Phase 72.3.26 — Coach Weekly Review demo

This phase adds a separate **Coach Weekly Review** alongside the Player's own weekly reflection.

### Coach perspective
A linked Coach can review:
- Player performance
- Effort
- Attitude
- Teamwork
- Coachability
- Leadership

Each is rated on a simple 1–5 scale.

The Coach also records:
- what stood out this week;
- a development opportunity;
- a leadership opportunity;
- next-week focus;
- an optional Coach message to the Player.

### Sharing
Coach reviews use a separate secure Supabase table.

Visibility rules are enforced by RLS:
- **Coach:** sees and manages only their own reviews for athletes they coach.
- **Parent:** sees Coach reviews for linked athletes automatically.
- **Player:** sees only reviews the Coach explicitly marks **Share this Coach review with the Player**.
- **Admin:** read-only access.

The Player's own Daily Check-In and Weekly Review remain Player-only entry features.

### Navigation
Coach workspace now has:
- Readiness
- Weekly Review
- Coach Plan

Parent Overview includes a direct Coach Weekly Review card so Parents do not need to search for it.

When a Coach shares a review with the Player, it appears in the Player Overview above the Player's own Weekly Review.

### Migration
Run `supabase/migrations/003_coach_weekly_reviews.sql` once before testing cloud Coach reviews.


## Phase 72.3.27 — Universal Athlete Development Engine

Built directly on Phase 72.3.26, so this package preserves both recent updates:
- Phase 72.3.25 Player-only Daily Check-Ins and Player Weekly Reviews, viewable by linked Parents and Coaches.
- Phase 72.3.26 Coach Weekly Review with Parent visibility and Coach-controlled Player sharing.

### Universal Development Blueprint
Every sport now uses the same nine development pillars:
Movement, Sport Skill, Speed / Power, Strength, Conditioning, Decision-Making, Mental Performance, Recovery / Habits, and Character / Leadership.

Coach/Admin can set 1–5 development ratings. The app ranks current opportunities and explains **why** each priority matters and **what to do next**.

### Sport Skill Trees
Each supported sport has its own eight-skill progression:
Needs Work → Developing → Consistent → Advanced.

Coach/Admin can add a coaching note and optional progress-video URL to each skill.

### Adaptive Development Engine
The Development page combines:
- blueprint ratings;
- sport skill status;
- recovery/readiness;
- open development objectives;
- Coach Weekly Review observations.

It surfaces up to three current priorities with both the reason and a practical action.

### Player Today screen
Player Overview now answers:
1. How do I feel?
2. What am I doing?
3. What is my focus?

This keeps the Player experience simple even as the development system becomes deeper.

### Post-training reflection
Only the Player can submit the short post-training reflection:
effort, training quality, confidence, what felt good, and what needs work.

Linked support views can see the reflection as part of the shared athlete workspace.

### Development Meetings
Coach/Admin can save a 4–8 week development meeting containing:
progress, current priority, Player perspective, Coach plan, Parent support action, and next measurable goal.

### Development Journal
The app builds a chronological evidence timeline from:
Player training reflections, development meetings, milestones, completed goals, Player Weekly Reviews, and Coach Weekly Reviews.

### Universal athletic foundations
The blueprint includes sprinting, jumping, landing, deceleration, change of direction, balance/coordination, strength patterns, and mobility/body control.

### Season phase
The development plan recognizes:
Off-season, Preseason, In-season, Championship, and Transition / Recovery.

### Parent view
Parent Development now has:
Blueprint · Skills · Priorities · Program · Milestones.

Parent Overview also shows the current season phase, top blueprint emphasis, and skills currently needing attention.

### Storage
The new development system is stored in the existing per-athlete `workspace_state` JSON and per-athlete local snapshot. No new database migration is required for Phase 72.3.27 itself.

**Phase 72.3.26 migration `003_coach_weekly_reviews.sql` is still required once** for the Coach Weekly Review feature.


## Phase 72.3.28 — Profile switching, profile setup, weekly review, and goal usability

Built directly on Phase 72.3.27, preserving the Player-only check-in/review rules, Coach Weekly Review, and Universal Development Engine.

### Viewing selector
Fixed the duplicate-profile display that could appear after switching away from the primary athlete. The selector now reads the actual saved primary-athlete snapshot instead of cloning the currently viewed secondary profile into the `primary` option.

Viewing labels now include athlete name, sport, and team to make profiles easier to distinguish.

### Player profile setup
`Player name` is now the first field in Edit Profile, spans the full form width, and is visibly marked **Required**.

If Save Player is blocked because the name is missing, the app automatically scrolls to and focuses the Player name field.

### Weekly reviews
After a Player saves their Weekly Review:
- all review input fields reset;
- the editor automatically collapses;
- a compact **Weekly Review Complete** card remains;
- the Player can use **View / Edit Review** to reopen the saved review.

The Coach Weekly Review follows the same completion behavior for consistency.

### Goal timeframes
Goal Type now has three choices:
- Short-term (1–4 weeks)
- Mid-term (1–3 months)
- Long-term (3–12 months)

Existing Short-term and Long-term saved goals remain compatible.

### Create Goal guide
Create Goal now starts with a small three-step guide:
1. Choose a timeframe.
2. Make it measurable.
3. Set the finish line.

A simple goal formula and example are shown immediately above the form.

No new Supabase migration is required for Phase 72.3.28.

The existing `003_coach_weekly_reviews.sql` migration from Phase 72.3.26 is still included and must be run once if it has not already been installed.


## Phase 72.3.29 — Daily Check-In sleep range

The Player Daily Check-In sleep dropdown now allows 4 through 12 hours.

The readiness formula is otherwise unchanged. Sleep still reaches full credit at the existing readiness threshold, so 9–12 hours do not inflate the score above the sleep maximum.

No Supabase migration is required.


## Phase 72.3.30 — Position-specific Competition Stats

Competition statistics now adapt to the athlete's sport and position.

- Ice Hockey no longer shows position names as statistic fields.
- Goaltenders receive goalie stats; skaters receive skater stats; Centers also receive faceoff totals.
- Baseball, Football, Basketball, Lacrosse, Wrestling, Soccer, and Figure Skating now have relevant position/discipline stat sets.
- Role / Position defaults to the locked Player Profile position and can be changed for a specific competition.
- An optional Add Custom Stat control lets a team track an extra metric.
- Season Snapshot totals use the actual stat labels saved in competition history, preserving compatibility with older entries.

No Supabase migration is required for Phase 72.3.30.


## Phase 72.3.31 — Shared Analytics Across Roles

Fixed the role-to-role Analytics mismatch for the same athlete.

### One analytics source
Player, Parent, and Coach now use the exact same `Analytics` component and the exact same calculations for:
- Shared Performance Score
- Testing score
- Training consistency
- Goal progress
- 7-day readiness
- Competition score
- Season Progress
- Test trends
- Baseline / current / best results
- Positive and declining trends

The Parent Progress page no longer maintains a separate set of summary calculations such as `last 5 competition average` or `latest readiness` that could appear different from the Player and Coach Analytics page.

### Clear athlete identity
Analytics now shows:
- Athlete
- Sport
- Position
- Shared athlete profile data source

This helps confirm that Player, Parent, and Coach are viewing the same athlete.

### Coach Plan distinction
The separate Coach Plan number is now labeled **Coach Plan Indicator** instead of **Coaching Score** and explicitly states that it is not the shared Analytics Performance Score.

Role permissions can still change which actions are available, but the core athlete analytics and scores do not change based on who is viewing them.

No Supabase migration is required for Phase 72.3.31.


## Phase 72.3.32 — Analytics Cockpit

The shared Analytics page has been redesigned as a high-clarity instrument panel inspired by a jet cockpit: important information is large, grouped, consistent, and easy to scan without turning the app into a novelty aircraft UI.

### Primary display
- Large Shared Performance Score instrument.
- Data Coverage indicator.
- Five primary instruments:
  - Testing
  - Training
  - Goals
  - Readiness
  - Competition
- Each instrument shows:
  - 0–100 value or No Data
  - status: Strong / Building / Watch / Attention / No Data
  - compact gauge
  - plain-language explanation of what the number means.

### Score explanation
A disclosure directly beneath the primary instruments explains the current shared Performance Score formula:
Testing + Training + Goals + Readiness + Competition, each weighted equally at 20%.

It also explains that categories with no data currently contribute 0 and the Data Coverage indicator should be read with the score.

### Quick Scan
A dedicated scan row shows:
- Top Improvement
- Needs Attention
- 7-Day Readiness
- Season Momentum

### Secondary instruments
The existing season metrics, time-range filters, category filter, test count, average positive trend, training consistency, and goal progress are reorganized into a secondary instrument panel.

### Detailed trends
Testing history remains available with:
- trend chart
- baseline
- current
- best
- improvement percentage
- dates
- CSV download

### Role consistency
The Analytics Cockpit is still the same shared Analytics component for Player, Parent, and Coach, so this visual redesign does not reintroduce role-specific calculation differences.

No Supabase migration is required for Phase 72.3.32.


## Phase 72.3.33 — Analytics Cockpit Syntax Fix

Fixed the Phase 72.3.32 build error:

`Expected '}', got '<eof>'`

The Analytics Cockpit component was missing its final function-closing brace immediately before `CompareTests`.

No Analytics calculations or cockpit features were removed. The shared Player / Parent / Coach analytics design remains intact.

No Supabase migration is required for Phase 72.3.33.


## Phase 72.3.34 — Parent Player Support Toolkit

Adds a dedicated Parent support layer while preserving the rule that Parents support the athlete without taking over coaching or Player-owned check-ins/reviews.

### Parent Home
A new **How can I support today?** card translates current athlete context into a practical Parent support action.

It can use:
- latest Player Daily Check-In readiness
- upcoming training
- latest Coach Weekly Review focus
- upcoming competition

The card emphasizes:
- Ask
- Help
- Avoid

### Parent Development → Support
Support is now the default Parent Development view.

It includes:
- Best Support Right Now
- current readiness context
- next training
- active goals
- skills needing work
- an athlete-centered conversation prompt
- before-practice support
- after-practice support
- competition-day support
- recovery support
- Coach alignment
- Development Meeting Parent-support action
- healthy Parent/Coach boundaries

### Parent Development Activity
The Parent can now read a combined development activity feed containing:
- Player Training Reflections
- Development Meetings
- Player Weekly Reviews
- Coach Weekly Reviews
- Milestones

This closes an earlier visibility gap while keeping the Parent experience read-only.

### Permissions
This update does not allow Parents to:
- submit Player Daily Check-Ins
- submit Player Weekly Reviews
- edit Coach Weekly Reviews
- edit Development Blueprint ratings
- edit Skill Tree statuses
- change the Player training plan

Shared Notes remain the existing Parent write pathway.

No new Supabase migration is required for Phase 72.3.34.


## Phase 72.3.35 — Development Intelligence Loop

This is the combined intelligence upgrade that connects athlete data to practical development actions.

### 1. Analytics → Action
The Analytics Cockpit now includes a **Development Intelligence Loop**:
- identifies the clearest current signal
- explains why it matters
- gives a recommended next step
- Player / Coach / Admin can create:
  - a Development Priority
  - a Short-Term Goal
  - a scheduled Training Focus
- Parent sees the same intelligence in read-only support mode.

### 2. Readiness 2.0
A shared readiness formula is now used across the app:
- Sleep 25%
- Energy 25%
- Soreness 25%
- Stress 25%

Improvements:
- sleep contribution uses age-based sleep targets
- 1/10 soreness and stress now correctly map to the best component score
- the theoretical maximum is 100/100
- component scores are shown individually
- Main Limiter is identified
- recent 3-entry trend is shown
- 7-day average uses the same central formula
- Program Generator, Analytics, Coach Plan, Reports, Home, Parent Support, Development, and Roster summaries now use the same readiness calculation.

The score remains a training/recovery decision aid, not a medical diagnosis.

### 3. Better Performance Benchmarks
Detailed Analytics trends now show:
- Baseline
- Current
- Personal Best
- Change from Baseline
- Distance from Personal Best

No invented age/sport normative standards are added.

### 4. Coach Practice Observations
Development now has an **Observations** view.

Coach / Admin can record:
- Practice / Game / Training context
- sport skill
- observed skill level
- behavior-based observation
- next action

Saving an observation:
- adds it to development history
- updates the Skill Tree status
- can feed Adaptive Development priorities.

Player sees Coach-entered observations read-only.

### 5. Player ↔ Coach Weekly Review Comparison
Development Journal now includes **Weekly Review Alignment**.

It displays Player and available Coach perspectives side by side and produces a conversation prompt. Differences are presented as useful discussion opportunities—not as a right/wrong score.

Parent Activity includes a Parent-oriented version that encourages helping the Player and Coach communicate rather than choosing a side.

### 6. One Athlete Development Timeline
Development now has a **Timeline** view combining:
- completed workouts
- performance tests
- competitions
- Player training reflections
- Coach practice observations
- Player Weekly Reviews
- Coach Weekly Reviews
- development meetings
- completed goals
- milestones

Parent Development → Activity now uses a comparable read-only timeline.

### 7. Parent Support Integration
The Phase 72.3.34 Parent Player Support Toolkit is preserved and now receives Coach observations and the expanded athlete timeline.

### Persistence
Practice observations are stored in the existing per-athlete `developmentSystem` / `workspace_state` structure.

Data schema is now `1.3`.
Portable backup envelope is now version `17.0`.

No new Supabase migration is required for Phase 72.3.35.


## Phase 72.3.36 — Player Profile Ownership & Coach Read-Only

Player identity/profile information is no longer editable from the Coach experience.

### Profile ownership
- **Player:** can edit their own Player Profile.
- **Coach:** view-only Player Profile.
- **Parent:** view-only Player information.
- **Admin:** can edit/correct Player Profile information.

Protected profile fields:
- Player Name
- Age
- Sport
- Position
- Team
- Season
- Height
- Weight
- Handedness

### Coach Home
The Coach sees the Player Profile summary with a **VIEW ONLY** badge instead of Edit Profile.

A **Request Profile Update** action sends the Coach to Shared Notes so a correction can be communicated without changing identity data directly.

### Coach Roster
Coach Roster still allows athlete selection, switching, summaries, and comparison tools.

Coach Roster no longer exposes:
- Add Player profile form
- Edit Profile
- Remove Player
- Data & Backup / restore tools

Those profile-administration controls are Admin-only.

### Admin
Admin retains profile correction, Add Player, Remove Player, and Data & Backup tools.

### Guided setup
Coach role no longer opens the Player profile editor during guided setup. Coach setup explains that Player profile identity is read-only.

No new Supabase migration is required for Phase 72.3.36.


## Phase 72.3.37 — Coach Roster Analytics Quick Scan

The Coach Roster is redesigned for fast multi-athlete review.

Each Player card now shows:
- Player name, sport, position, and team
- shared Performance Score
- Strong / Building / Watch / Attention status
- Data Coverage out of 5
- Testing
- Training
- Goals
- Readiness
- Competition
- top positive testing trend
- first area to check
- current Development Focus

The five primary scores use the same core calculations as the shared Analytics Cockpit.

Coach can sort by:
- Attention
- Performance
- Readiness
- Name

Every card includes:
- Select Player / Open Overview
- Open Analytics

The older duplicate Coach roster list is removed from the Coach experience. Team Overview and Compare Athletes remain available under optional tools.

Phase 72.3.36 profile ownership remains unchanged: Coach is view-only for Player profile information.

No new Supabase migration is required for Phase 72.3.37.


## Phase 72.3.38 — Coach Command Center & Weekly Workflow

This phase turns the Coach Roster from a passive analytics list into a weekly action workflow.

### Coach Command Center
The Coach Roster now begins with a weekly dashboard showing:
- Players
- Need Attention
- Review Checks
- Retests
- Low Readiness
- Competitions in the next 7 days

### Coach Attention Queue
Players are prioritized using current development signals such as:
- Watch / Attention Analytics status
- low readiness
- declining repeated-test trends
- Coach Review status
- stale Practice Observations
- retesting needs
- upcoming competition context

Each queue row explains **why** the Player is surfaced and shows the recommended **next Coach action**.

### Coach Review status
The Roster shows:
- Complete — current-week Coach Review is known
- Due — a previous local/current review marker exists, but the current week is not complete
- Check — the Roster cannot safely confirm current-week completion yet

The app stores a lightweight local current-week marker when a Coach Weekly Review is loaded or saved. Secure Coach Review content remains in `coach_weekly_reviews`; it is not copied into `workspace_state`.

### Practice Observation reminders
Each Player card shows whether a Coach Practice Observation is:
- Current — observation exists this week
- Due — no observation this week

The latest observation summary is available in the 2-minute Player Review workflow.

### Retest Queue
The Coach Command Center identifies:
- explicitly scheduled retests that are due
- tests with only one result
- repeated tests not updated in roughly 30 days

The Coach can jump directly to Testing for that Player.

### Upcoming Competition context
Player workflow status includes the next saved upcoming competition when available and counts competitions occurring in the next 7 days.

### 2-Minute Player Review
`Review Player` opens a six-step workflow:
1. Readiness
2. Analytics
3. Development
4. Coach Review
5. Practice Observation
6. Next Action

Buttons deep-link to the correct Coach or Development sub-view when applicable.

### Next Coach Action
Every Coach Player card now includes one recommended next action derived from the clearest current signal.

### Existing permissions preserved
- Player edits own profile
- Coach profile information remains view-only
- Parent profile information remains view-only
- Admin can correct/manage Player profile information

No new Supabase migration is required for Phase 72.3.38.


## Phase 72.3.39 + 72.3.40 — Combined Upgrade

This download combines **Beta Hardening & Cloud Reliability** with **Age + Position-Specific Development Progressions**.

### Beta Hardening & Cloud Reliability
- Failed cloud saves keep a local retry copy.
- Sync status now shows Cloud ready / Saving / Sync issue · Retry.
- Tapping a sync issue retries the preserved payload.
- The app retries a pending save when the browser comes back online.
- Last successful cloud save is tracked for Admin diagnostics.
- Admin Roster includes Beta Health & Diagnostics:
  - app version
  - cloud connection state
  - cloud workspace loaded
  - selected athlete
  - workspace identifier (shortened)
  - last successful save
  - retry-copy state
- Coach Command Center can preload all linked team athlete `workspace_state` records through the secure Coach relationship and use those cloud snapshots for roster analytics.
- Coach cloud roster status is visible in the Command Center.
- Key duplicate-entry protections were added for Testing, Competition, Practice Observations, and Analytics-created Development/Goal actions.
- Additional mobile overflow and layout safeguards were added.
- Existing role rules remain intact.

### Cloud-first Coach Roster
The Beta bridge now exposes:
- `loadCoachRosterStates()`
- `selectCoachRosterAthlete(workspaceId)`

The Coach roster uses cloud snapshots when available instead of depending only on browser-local athlete copies.

No service-role key or secret is exposed to the browser. Existing Supabase RLS remains the security boundary.

### Age + Position-Specific Development Progressions
The Development Engine now classifies athletes into:
- Foundation — generally age 12 and under
- Build — generally age 13–15
- Performance — generally age 16+

The stage changes **how the app recommends progressing a skill**, not whether the athlete is good or bad.

### Five-step progression language
The intelligence layer now translates the existing Skill Tree into:
- Learn
- Developing
- Consistent
- Game Ready
- Advanced

Existing stored Coach Skill Tree statuses remain unchanged:
- Needs Work
- Developing
- Consistent
- Advanced

The new progression language is a recommendation layer; it does not silently auto-promote stored Coach ratings.

### Position-specific priorities
All eight sports receive position/role-aware priority logic.

Examples include:
- Ice Hockey Goaltender vs Center vs Defense vs Wing
- Soccer Goalkeeper vs Defender vs Midfielder vs Forward
- Basketball Guard vs Frontcourt
- Football QB / receiver / line / defense
- Baseball Pitcher / Catcher / field positions
- Lacrosse Goalie / Defense / Faceoff / field
- Figure Skating Singles / Pairs / Ice Dance / Synchronized
- Wrestling

### Personalized Development card
Development → Blueprint now shows:
- athlete age and stage
- position-specific priority skills
- current next skill
- current progression level
- recommended next progression level
- what successful progression should look like
- position-relevant testing emphasis

### Skill Tree
Position-priority skills are highlighted and show the recommended next progression target.

### Coach Roster
Each Coach Player analytics card now displays:
- Foundation / Build / Performance stage
- next age/position progression

### Parent Support
Parent Development → Support translates the same progression into simple support language:
- the athlete's stage
- next development step
- what it means
- the best Parent role at that stage

No new Supabase migration is required for this combined Phase 72.3.40 upgrade.


## Phase 72.3.41 — Role-Specific Experience + Player Simple Mode

This phase fixes two usability problems at the same time:

1. The Player account was becoming too dense.
2. Setup and Help needed to teach the exact role being used.

### Player Simple Mode
The Player Home page is now a **Today-first** experience.

It prioritizes:
- one clear Start Here / Next action
- today's Daily Check-In result
- next training
- current development focus
- Foundation / Build / Performance stage
- weekly workout count
- 7-day check-in count
- Weekly Review status
- fast links to My Goals, My Progress, and My Development

Dense Coach-style dashboard panels are hidden from the normal Player Home experience. The underlying data and calculations are preserved.

Player-facing labels are simpler:
- Overview → Today
- Readiness → Daily Check-In
- Analytics → My Progress
- Development → My Development
- Goals → My Goals

### Player setup
Player setup now teaches only:
1. Player Profile
2. Daily Check-In
3. Schedule / first workout
4. one clear Goal
5. Weekly Review
6. My Progress

It no longer walks the Player through Coach/Admin-oriented concepts.

### Coach setup
Coach setup now teaches:
1. Teams
2. Coach Roster / Command Center
3. Player readiness
4. Development
5. Practice Observations
6. Coach Weekly Review

Player Profile identity remains view-only.

### Parent setup
Parent setup now teaches:
1. My Players
2. Parent Overview
3. Schedule
4. Recovery
5. Progress
6. Development Support

It does not ask Parents to create Player goals, testing results, workouts, Daily Check-Ins, or Player Weekly Reviews.

### Admin setup
Admin setup focuses on:
- Beta Admin
- Roster + Diagnostics
- role previews

### Role-specific Help
Help is now task-based and role-aware.

Player Help includes:
- What should I do today?
- Daily Check-In
- next workout
- goals
- testing
- Weekly Review
- My Progress
- My Development
- Join Team when available

Coach Help includes:
- Teams
- select a Player
- who needs attention
- readiness
- Practice Observations
- Coach Review
- Player analytics
- development priorities

Parent Help includes:
- switch Players
- schedule
- recovery
- progress
- development support
- competition
- support-team communication

Admin Help includes:
- beta accounts
- role testing
- diagnostics
- athlete-data management

The full feature map is still available below Quick Help, but it only contains features accessible to the current role.

### Permissions preserved
- Player edits own Player Profile.
- Coach Player Profile remains view-only.
- Parent remains view/support focused.
- Admin can correct/manage Player Profile information.
- Player Daily Check-In and Player Weekly Review remain Player-entered.
- Coach Weekly Review remains separate and secure.

No new Supabase migration is required for Phase 72.3.41.
