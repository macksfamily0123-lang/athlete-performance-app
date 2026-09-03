# Athlete Performance App — Phase 72.3.63 Beta RC14

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


## Phase 72.3.42 + 72.3.43 — Combined Player Development Upgrade

This single download combines:

- **72.3.42 — Player Progress + Development Simplification**
- **72.3.43 — Athlete Development Plan + Priority Tracking**

The product direction remains athlete development and the support around that development. It does **not** become a team-practice planning product.

### Player → My Progress
Players now see a simple progress summary first:
- Overall Performance status
- strongest improving repeated-test trend
- clearest area to keep working on
- Goals
- workouts completed this week
- Readiness
- Testing coverage
- a **Why?** explanation

The full shared Analytics Cockpit remains available through **See Detailed Progress**.

The detailed calculations are unchanged. Player, Parent, and Coach still share the same underlying athlete data.

### Player → My Development
Players now see a simple development view first:
- Foundation / Build / Performance stage
- Current Focus
- current progression level
- next progression level
- clear target
- **Why is this my focus?**
- Athlete Development Plan
- quick links to My Testing, My Progress, and My Goals

The full Blueprint, Skill Tree, observations, timeline, reflections, mental preparation, and supporting training tools remain available through **See Full Development Record**.

### Athlete Development Plan
A central shared development record now shows:
- Primary Development Priority
- Secondary Priority
- Current → Target progression
- progress percentage
- Next Review date
- evidence supporting the priority
- readiness context
- recent training context
- an active Goal needing movement

Evidence can include:
- repeated testing trends
- Coach Practice Observations
- Coach Weekly Review
- Player Weekly Review
- Player Training Reflections

No external normative benchmarks are invented.

### Coach Development Plan controls
Coach and Admin can update:
- Primary Priority
- Primary Target
- Primary progress %
- Secondary Priority
- Secondary Target
- Next Review date

The plan is stored using the existing athlete Development data already saved in `workspace_state`; no new table is introduced.

Coach still **cannot edit Player Profile identity information**.

### Parent support
Parent Development Support now reads the same Athlete Development Plan and translates it into:
- Primary Development Priority
- Current → Target progression
- Secondary Priority
- Next Review
- Best Parent Support

Parent remains support-focused and does not control the Coach-owned development direction.

### Coach tools stay development-focused
The old **Coach Plan** label is now **Development Signals**.

The previous weekly coaching/practice-plan style output was removed from Smart Coach. The replacement focuses on:
- development context
- recovery context
- training-load context
- supporting needs
- measurable trends
- recommended Development actions
- Player / Coach evidence

The page explicitly states that practice design belongs in the Coach's preferred external planning tools.

### Role principle
- **Player:** understand what I am working on and why.
- **Coach:** understand development evidence and manage development direction.
- **Parent:** understand how to support the athlete.
- **Admin:** oversee beta reliability and correct administrative data when necessary.

No new Supabase migration is required for Phase 72.3.43.


## Phase 72.3.44 — Role-Specific Home Setup

This phase fixes the Home-page onboarding so a Coach no longer sees a Player-style **Finish Your Setup** checklist.

### Coach Home setup
Coach now gets **COACH WORKSPACE SETUP / Finish Coach Setup** with Coach-only orientation:
- Open Coach Teams and select an athlete
- Review Coach Command Center
- Learn where to review Player readiness
- Review Athlete Development Plan
- Learn Coach Practice Observations
- Learn Coach Weekly Review

The Coach setup explicitly reinforces role boundaries:
- Coach develops the athlete
- Player owns Player Profile identity, Daily Check-In, and Player Weekly Review
- Parent supports the athlete

The Coach setup does not ask the Coach to:
- complete or edit Player Profile fields
- create the Player's Daily Check-In
- complete the Player Weekly Review
- follow Parent setup tasks

### Player Home setup
Player gets a separate **PLAYER SETUP / Finish Player Setup** checklist:
- Complete Player Profile
- Complete first Daily Check-In
- Find or schedule first workout
- Create one clear goal

### Parent
Parent continues to use the dedicated Parent setup/help flow and does not inherit the Coach or Player Home setup card.

### Setup persistence
Home setup dismissal and Coach orientation progress are stored separately from the other role experiences so the Coach checklist no longer reuses the generic Player setup.

No new Supabase migration is required for Phase 72.3.44.


## Phase 72.3.45 — Player-Owned Goals + Coach Feedback

This phase makes goal ownership explicit.

### Goal ownership
Only the **Player** can:
- create a goal
- change goal progress
- pause / resume a goal
- mark a goal complete
- delete a goal

Goals must originate from the Player.

### Coach role
Coach can:
- review existing Player goals
- see goal progress, target, timeframe, Player notes, and status
- add a **Suggestion**
- add a **Comment**

Coach cannot:
- create a Player goal
- change Player goal progress
- pause / resume a goal
- mark a Player goal complete
- delete a Player goal

Coach feedback is attached to the existing goal and is visible to the Player and other supported read views.

### Parent role
Parent remains view/support focused:
- can see Player goals
- can see Coach suggestions/comments
- cannot create or change Player goals

### Admin
Admin can review the goal record but direct goal creation/editing remains Player-owned.

### Analytics → Action
The Development Intelligence Loop no longer lets a Coach create a short-term Player goal.
- Player can choose **Create My Short-Term Goal**
- Coach gets **Review Player Goals**
- Coach can then add feedback to an existing goal

A direct guard also prevents Analytics goal creation unless the real signed-in account is a Player. Admin role preview cannot create a Player goal.

### Coach setup + Help
Coach-specific setup now includes:
- **Review Player-owned goals and feedback**

Coach Help includes:
- **How do I support a Player goal?**

Both explain that the Player owns the goal while the Coach supports it through suggestions and comments.

### Persistence
Coach goal feedback is stored inside the existing Goal record in `workspace_state`.
No new Supabase migration is required for Phase 72.3.45.


## Phase 72.3.46 — Admin Full Access

Admin is now a true administrative override account.

### Admin can select and manage any athlete
Admin Roster loads athlete cloud workspaces across the beta environment. Admin can switch to an athlete and manage that athlete's saved cloud state.

### Admin full-access controls
In **Admin** view, Admin can:
- create / edit / correct Player Profile information
- create, update, pause, complete, delete, or correct Player goals
- add goal feedback
- create or correct Player Daily Check-In / readiness data
- create or correct Player Weekly Reviews
- create or correct Coach Weekly Reviews
- manage Testing data
- manage Training / Calendar records
- manage Competition records
- manage Athlete Development Plan and development records
- add Coach-style Practice Observations
- add Player-style training reflections when administrative correction is needed
- manage roster / athlete data
- use Data & Backup tools
- use Beta Admin / diagnostics

### Normal role rules do not change
- Player still owns goals during normal Player use.
- Coach still cannot create or alter Player goals.
- Parent remains support/read-focused.
- Coach still cannot edit Player Profile identity data.

Admin is the explicit exception.

### Role Preview
Admin's **Preview role** selector is still a simulation tool. When Preview role is set to Player, Coach, or Parent, the interface intentionally resembles that role. Switch Preview role back to **Admin** to expose the full Admin override controls.

### Cloud / RLS
Migration `004_admin_full_access.sql`:
- lets Admin access any athlete workspace
- lets Admin write any athlete `workspace_state`
- lets Admin create/update/delete Coach Weekly Reviews
- preserves Coach, Parent, and Player policies
- safely ensures `coach_weekly_reviews` exists even if migration 003 was not previously installed

This phase **does require migration 004**.


## Phase 72.3.47 — Coach Setup Returns Each Login Until Complete

Coach Home keeps the temporary **Coach Workspace Setup** card, but its dismissal behavior is now login-scoped.

### New behavior
If Coach setup is incomplete:
- it appears on Coach Home after login
- Coach may dismiss it for the current login
- navigating around the app during that same login does not bring it back
- refreshing during the same authenticated login does not intentionally reset the dismissal
- after the Coach signs out and signs in again, the incomplete setup card appears again
- once all Coach setup steps are complete, the card no longer appears

The Coach card states that dismissal hides it for the current login only.

### What counts as Coach setup
The Coach-specific checklist remains:
- Open Coach Teams and select an athlete
- Review Coach Command Center
- Learn Player readiness
- Review Athlete Development Plan
- Review Player-owned goals and feedback
- Learn Coach Practice Observations
- Learn Coach Weekly Review

The setup never asks a Coach to perform Player or Parent-owned tasks.

### Technical behavior
The app uses the authenticated Supabase login instance (`last_sign_in_at`) only as a non-sensitive setup-session key. Coach dismissal is stored in session storage for that login instance. No password, token, or credential is stored.

### Admin full-access preservation
This phase also corrects the Beta bridge so Admin receives the cloud athlete roster/select functions and Coach Weekly Review save bridge required by Phase 72.3.46 full-access behavior.

### Database
Phase 72.3.47 introduces **no new migration**.

Migration `004_admin_full_access.sql` from Phase 72.3.46 remains required if it has not already been applied.


## Phase 72.3.48 + 72.3.49 — Combined Role Audit + Coach Command Center 2.0

This single update combines the planned Phase 72.3.48 and Phase 72.3.49.

# Phase 72.3.48 — Full Role & Permission Audit

A centralized `rolePermissions` matrix now defines the primary ownership/write rules.

### Player
Player can:
- edit own Player Profile
- create and update own goals
- complete own Daily Check-In
- complete own Player Weekly Review
- add Player training reflections
- log/support own Training, Testing, and Competition records
- use Shared Notes

Player cannot:
- manage the formal Athlete Development Plan / Development Objectives
- add Coach Practice Observations
- create Coach Weekly Reviews

### Coach
Coach can:
- review Player Profile read-only
- add Suggestion / Comment to existing Player-owned goals
- create Coach Weekly Review
- manage Athlete Development Plan / formal Development Objectives
- add Practice Observations
- assign/support Training
- log Testing and Competition records
- use Shared Notes

Coach cannot:
- edit Player Profile identity fields
- create, update, pause, complete, or delete Player goals
- submit Player Daily Check-In
- submit Player Weekly Review
- submit Player training reflections as the Player

### Parent
Parent remains a support/read role.
Parent cannot:
- edit Player Profile
- create/change Player goals
- submit Player Daily Check-In
- submit Player Weekly Review
- create Coach Weekly Review
- manage Athlete Development Plan
- add Practice Observations
- change Training / Testing / Competition records

Parent's main write pathway remains Shared Notes / support communication.

### Admin
Admin remains the explicit full-access override.

### Secondary-path audit
Permission guards now cover:
- Home profile editing
- Goals
- Daily Check-In
- Player Weekly Review
- formal Development Objectives
- Analytics → Development Priority
- Analytics → Player Goal
- Analytics → Training Focus
- Training / Calendar writes
- Testing writes
- Competition writes

The Player can still participate in development through reflections, goals, testing, training, and conversations while formal Coach development direction remains Coach/Admin managed.

### Admin permission matrix
Admin Home now includes a visible Role Ownership Matrix so the intended role boundaries can be checked in-app.

### Automated permission tests
New test command:
`npm run test:roles`

It audits the role permission matrix and key UI/save guards.

# Phase 72.3.49 — Coach Development Command Center 2.0

Coach Home is now a dedicated development workspace instead of a Player-style athlete dashboard.

### Coach Home summary
Coach Home shows:
- Players
- Need Attention
- Low Readiness
- Development Plan Reviews due / missing
- Player Goals needing Coach feedback
- Coach Weekly Reviews due
- Retests due
- Practice Observations due

### Who should I review next?
Coach Home ranks athletes using development-support signals including:
- low readiness
- missing / due Athlete Development Plan
- Player goals with no Coach feedback
- Coach Weekly Review due
- Practice Observation due
- retest follow-up
- declining repeated-test trend

The highest-priority athlete appears in **Who Should I Review Next?** with:
- WHY
- current development focus
- NEXT BEST ACTION
- quick links to Player Goals, Progress, Development, and the recommended action

### 7-step athlete development review
The Coach workflow is now:

1. Readiness
2. Player Goals
3. Testing Trends
4. Development Plan
5. Practice Observations
6. Coach Weekly Review
7. Next Development Action

The same priority signals are also added to the full Coach Command Center in Roster.

### No practice planner
Coach Home and Coach Command Center explicitly remain focused on athlete development. They do not generate practice plans.

### Coach Workspace Setup
The incomplete Coach setup behavior from 72.3.47 is preserved:
- appears on every new login while incomplete
- dismissal hides it for that login
- returns on the next login if still incomplete
- disappears once completed

The card is now labeled **Get Your Coach Workspace Ready**.

### Automated regression tests
New test command:
`npm run test:regression`

Run both suites with:
`npm test`

### Database
No new migration is introduced in 72.3.48/72.3.49.

Migration `004_admin_full_access.sql` remains included and required if it has not already been applied.


## Phase 72.3.50 — Beta Release Candidate 1

The major feature set is frozen for beta testing.

Run the full release gate with:

`npm run release:check`

A beta build should only be promoted after the role audit, regression suite,
TypeScript typecheck, and Next.js production build all pass.

No new migration is introduced in 72.3.50.


## Phase 72.3.51 — Beta RC2 Reliability Hardening

This phase keeps the major feature set frozen and focuses on beta reliability.

### Runtime recovery
A React error boundary now surrounds the authenticated Athlete app.
If an unexpected render/runtime error occurs, the user gets:
- a clear beta recovery screen
- Reload App
- Report This Error
- optional technical details

The recovery screen does not claim that cloud data was deleted.

### Online / offline awareness
The beta shell now listens for browser online/offline changes.
When offline, a visible banner explains that cloud saves will retry after the connection returns.

### Better beta feedback
Report Problem automatically includes:
- app version
- signed-in role
- selected athlete
- sport
- online/offline state
- page path

The feedback modal explicitly tells the beta tester what diagnostic context is included.
Passwords and authentication tokens are not included.

### Settings reliability status
The Settings panel includes a compact beta reliability status for cloud save state,
last successful save, and pending retry-copy state.

### Automated reliability tests
New:
`npm run test:reliability`

Full test:
`npm test`

Release gate:
`npm run release:check`

No new Supabase migration is introduced in Phase 72.3.51.
Migration 004 remains required if it has not already been applied.


## Phase 72.3.52 — Coach Roster Invites + Team Management

Coach Roster is now the primary, obvious location for adding Players to a Coach's team.

### Coach → Roster
The top of Coach Roster now includes:
- **Invite Player**
- **Manage Teams**

A clear Add Players card explains that:
- Coach sends the team invite
- Player or Parent creates/signs in to their own account
- Player retains ownership of Player Profile, goals, Daily Check-In, and Player Weekly Review
- the team connection lets the Coach review/support development

### Invite Player flow
Invite Player opens a dedicated invite-first Coach modal:
1. Select a team
2. Copy Invite Message or Copy Code Only
3. Send it to the Player or Parent
4. Player/Parent signs in and chooses Join Team
5. Player appears in Coach Roster

The copied invite message includes the current beta website origin automatically.

### Manage Teams
Manage Teams remains available for:
- creating teams
- switching teams
- viewing team membership
- regenerating invite codes
- opening linked athletes
- removing a Player from a Coach team

### Important beta limitation
This phase does **not** pretend to send direct email invitations.
The current beta invite is a secure team-code sharing workflow.
Direct email/link invitation tracking can be added later if needed.

### Coach Home + Help
Coach Home keeps a Teams & Invites shortcut.
Coach Help now includes **How do I invite a Player?**
Coach setup sends Coaches to Roster for Player invitations and team management.

### Database
No new Supabase migration is introduced in Phase 72.3.52.
Migration 004 remains required if not already applied.


## Phase 72.3.53 — Family Accounts + Junior Player Experience

This phase adds one-athlete family account linking and a simplified Player experience for younger athletes.

### One athlete record
The Player is the center of the relationship model:

Parent account → athlete workspace ← Player login
Coach team → athlete workspace

The Parent and Coach do not create separate copies of the athlete.

### Parent-managed Players
A Parent can add a Player with:
- name
- age
- sport
- position
- team

The new Player starts as **Parent Managed**. A separate child login is not required.

From **My Players**, the Parent can:
- Open Parent View
- Open Junior Player / Player View
- connect the Player to a Coach team
- optionally create a Player Access Code for a future Player login

### Junior Player Mode
For Players age **10 and under**, Junior Player Mode turns on automatically.

It keeps the underlying features/data while simplifying the presentation:
- Today-first Home
- one next action at a time
- My Goal
- My Training
- How I Feel
- How I'm Doing
- My Skills
- My Tests
- Games
- large buttons and short language
- simplified goal creation
- emoji/easy-choice Daily Check-In
- advanced analytics/setup panels hidden from the Junior interface

### Parent-managed Player data safety
When a Parent opens a Parent-managed Player session, the browser presents the Player experience, but cloud saves go through the restricted
`parent_save_managed_player_state` RPC.

That RPC can save Player-owned information while preserving Coach-owned information such as:
- formal Development Plan/Objectives
- Practice Observations
- Coach Weekly Reviews
- Coach-managed testing targets/direction

### Giving the Player a login later
A Parent can choose **Give Player Login Access**.

The app generates a Player Access Code. The Player can:
- enter it during Player signup, or
- use Player Connections to link an already-created fresh Player account

The login is attached to the **existing athlete workspace**, preserving the Player's history and Parent relationship.

### Duplicate protection
An existing Player account may only claim a Parent-managed athlete automatically when its provisional athlete record is still unused.
If it already has connected or meaningful development data, the secure claim RPC stops and directs the family to Admin instead of silently merging records.

### Coach linking
Coach linking is unchanged:
Coach → Roster → Invite Player → team code.

A Parent can use the Coach's team code for any linked child. The Coach is connected through team membership to that same athlete workspace.

### Database
Phase 72.3.53 adds:
`supabase/migrations/005_family_accounts_junior_player.sql`

Migration 005 must be applied after the existing beta foundation/migrations.
Do not rerun older migrations if they have already completed successfully.


## Phase 72.3.54 — Junior UX + Shared Scheduling & Competition Results

### Junior Home bug fix
The Junior Player **How am I doing?** action in the top greeting card is now:
- forest green
- pointer/click enabled
- mobile-safe
- wired directly to Junior Progress / How I'm Doing

### Parent workout scheduling
Parent → Schedule now includes a dedicated **Schedule a Workout** support card.

A Parent may add:
- date
- workout name
- category
- duration
- intensity
- optional focus/note

The workout is tagged `assignedByRole: "Parent"`.

This is a narrow support permission. Parent still cannot broadly manage Coach training programming, formal Development Plans, Practice Observations, or Coach reviews.

### Parent competition results
Parent → Competition now includes **Add Competition Score / Result**.

A Parent may enter:
- date
- event type
- opponent/event
- score/result
- optional location

These are factual result-only entries tagged:
- `enteredByRole: "Parent"`
- `entryKind: "Score"`

Parent score-only entries do not create a Player performance rating or reflection.

### Coach access
Coach already has full training and competition write permissions. Phase 72.3.54 also makes them easier to find from Coach Home with:
- **Schedule Workout**
- **Add Competition Result**

### Competition analytics safety
A Parent score-only result stores rating `0` as "not rated."
All progress, analytics, reporting, recommendations, and competition rating summaries now exclude unrated score-only entries so no false `0/10` signal is created.

### Server-side Parent support restriction
New migration:
`supabase/migrations/006_parent_support_scheduling_results.sql`

The `parent_save_support_data(...)` RPC:
- requires a Parent account
- requires an existing Parent ↔ Player link
- accepts only Parent-tagged workouts
- accepts only Parent-tagged score/result competition entries
- preserves Coach/Player/Admin workout records
- preserves Coach/Player/Admin competition records
- does not grant unrestricted `workspace_state` write access

No practice-plan generator was added.


## Phase 72.3.55 — Junior Goal Entry Fix

Junior Player Goal pages now put a clearly visible goal-entry card directly under the page header.

The Junior form includes:
- My goal
- Goal type/category
- How the Player will know they achieved it
- Optional note/reminder
- A large forest-green **Save My Goal** button

The form is intentionally shown whenever the active view is Junior Player mode. This also covers a Parent-managed Junior Player session, where the Parent may help type while the saved goal remains Player-owned.

No database migration is required for 72.3.55. Migration 006 from 72.3.54 remains the latest migration.


## Phase 72.3.57 — Family Reliability + Admin Diagnostics + Junior Polish

This is a **single combined release**. It already includes the Phase 72.3.56 Junior Goal build hotfix, so 72.3.56 does not need to be installed separately.

### Family account reliability

The existing Parent-first flow remains:

Parent creates Player → Parent-managed Player → Player gets a login later → same athlete record and same history.

Phase 72.3.57 also adds the opposite flow:

Player already has an account → Player creates a Parent Connection Code → Parent enters the code in My Players → Parent connects to the same athlete record.

This connection:
- does not create a duplicate athlete
- does not transfer Player ownership to Parent
- does not change Coach/team links
- does not merge unrelated athlete records

### Admin Family & Account Diagnostics

Beta Admin now includes a **Family** tab that checks:
- Player login connection
- Parent connections
- Coach/team connections
- Parent Managed vs Player Managed
- workspace state
- Player login/workspace alignment
- stale Player Access Codes
- relationship inconsistencies

Safe Admin repair actions include:
- sync a valid Player login to its athlete workspace
- correct Parent Managed / Player Managed status when the underlying relationships make that safe
- clear a stale Player Access Code
- restore Parent-managed Player Access
- create a missing workspace-state row

There is **no automatic athlete merge**. Complex duplicate-data situations remain manual-review items.

### Cloud-save reliability

The header now makes cloud state explicit:
- Saved
- Saving
- Waiting for connection
- Save failed / Retry

If the device is offline, the current payload is stored as a local retry copy and automatically retried when the connection returns.

### Junior Player mobile polish

Junior Mode now includes:
- a clear `← Today` route from every non-Home page
- larger touch targets
- 16px minimum mobile form text
- simplified header controls
- hidden advanced context controls
- retained Parent View button for Parent-managed Juniors
- retained Junior Goal Entry
- retained green `How am I doing?` action

### Shared Development Communication

The same athlete development picture is now translated by role:

- Player: **What am I working on?**
- Coach: **What does this Player need next?**
- Parent: **How can I help this week?**

The role permissions do not change. Player goals remain Player-owned; Coach formal development direction remains Coach/Admin-owned; Parent remains a support role.

### Database

New migration:

`supabase/migrations/007_family_reliability_admin_diagnostics.sql`

For this combined download, run migration 007 as the only new migration. It also installs/retains the Parent support scheduling/results RPC from migration 006, so 006 does not need to be rerun.


## Phase 72.3.58 — Persistent Admin Preview Controls

This release fixes the Admin role-preview trap found during live testing.

### Fixed
When an Admin previewed Player—especially a Junior Player—the Junior interface hid the normal context bar. That also hid the role-preview dropdown, making it difficult to switch back to Admin, Coach, or Parent.

Admin accounts now have a dedicated **ADMIN TEST MODE** bar that remains visible while previewing:
- Admin
- Coach
- Player
- Parent
- Junior Player (automatic when the selected Player is age 10 or younger)

The persistent bar includes:
- Athlete selector
- Preview role selector
- Return to Admin button while previewing another role
- Beta Admin button

It remains visible even when Junior Mode intentionally hides the normal context bar.

### Live-test SQL correction included
Migration 007 in this source package also includes the corrected qualified athlete query:

`select athlete_row.* ... order by lower(athlete_row.display_name)`

This fixes the `display_name is ambiguous` diagnostics error discovered during live testing.

No new database migration is introduced in v72.3.58. If migration 005 and the corrected migration 007 are already installed in Supabase, no database command is required for this release.


## Phase 72.3.59 — Junior More / All Features Fix

Fixed the Junior Player `More → Search All Features` bug that blurred the screen without showing any menu.

Cause:
- Junior CSS intentionally hid `.commandPalette`
- the command overlay still opened
- the result was a blurred overlay with no visible options

Fix:
- Junior Mode now has a dedicated child-friendly **See All My Features** palette
- the palette remains visible while the overlay is open
- labels use Junior language:
  - Today
  - My Goal
  - Training
  - How I'm Doing
  - How I Feel
  - My Skills
  - My Tests
  - Games
- search uses Junior-friendly text
- buttons use large mobile touch targets
- advanced Junior tools remain hidden

Preserved:
- Persistent Admin Test Mode bar from v72.3.58
- Junior Goal Entry
- green How Am I Doing action
- Back to Today
- Parent/Coach workout scheduling and competition results
- Family diagnostics
- role permissions

No database migration is required.


## Combined Phase 72.3.60 + 72.3.61 — Connections & Beta Reliability

This single build contains the next two planned updates.

### Phase 72.3.60 — Connections & Account Setup Cleanup

The account/athlete relationship is now much clearer for Player, Parent, Coach, and Admin users.

Parent → My Players:
- clearly chooses **Create New Player** or **Connect Existing Player**
- explains when each path should be used
- shows Player Login / Parent / Coach connection status per athlete
- keeps Parent-managed Junior Players on one athlete record
- makes Coach Team connection use an existing Player
- prevents same-Parent accidental duplicate creation in both the UI and database

Player → Connections:
- new connection summary for Player Login, Parent, Coach, and Team status
- recommends the next connection action
- Parent invitation explicitly tells the Parent to use **Connect Existing Player**
- Coach team joining explicitly connects the Coach to the existing athlete
- Parent-created Player recovery is moved into a secondary recovery section so it is not confused with normal connection setup

Coach → Roster / Invite Player:
- explains that the Coach connects to an existing Player rather than creating another Player
- roster rows show Player-login and Parent-connection status
- no Parent identities are exposed to Coach accounts

Admin:
- Accounts now explicitly explains that **Accounts are logins, not all athletes**
- Parent-managed Junior Players remain visible in Family even when they do not have a Player login
- Family diagnostics includes connection guidance and a safe **View Athlete** action

### Phase 72.3.61 — Beta Reliability & Connection Hardening

- new migration 008 adds role-gated relationship-summary RPCs
- connection actions are protected from double-submit while a request is running
- invalid/expired connection codes get plain-language error messages
- network/schema setup failures get clearer guidance
- Parent/Player/Coach connection status refreshes after successful changes
- duplicate protection is scoped to the signed-in Parent's own family
- no automatic athlete merge or delete behavior was added
- all prior Junior, Family, Admin Preview, cloud retry, role permission, and development features are retained

### Database update

Run only:

`supabase/migrations/008_connection_setup_reliability.sql`

Do not rerun earlier migrations when upgrading an already-working v72.3.59 database.


## Phase 72.3.62 — Player More + Cloud Test Athlete Hotfix

This hotfix fixes two live beta issues.

### Player More navigation
For a regular Player, `More` previously jumped straight to Competition when Competition was the only direct tab in that group. That bypassed the More sheet and made `Search All Features` unreachable.

`More` now always opens the Player More sheet. Competition is still available, and Search All Features remains accessible.

### Admin test athletes now persist in the cloud
Admin-created beta test Players were previously local browser/Codespace records. A new Codespace uses a different browser origin, so those local test profiles could disappear even though the real Supabase athlete records were safe.

In secure beta mode, Admin → Roster → Create Cloud Test Player now creates the test athlete in Supabase with a dedicated cloud workspace. The test athlete persists across:
- refreshes
- new Codespaces
- browsers
- devices
- app updates

Cloud test athletes do not automatically get a Player login, Parent, or Coach relationship. Family diagnostics identifies them as `Admin Test` and does not incorrectly flag the intentionally missing Player login as an account problem.

Existing local-only test athletes are not automatically converted or merged.

New migration: `009_player_more_cloud_test_athletes.sql`.


## Phase 72.3.63 — Visual Hierarchy & Navigation Cleanup

This is a combined release built on Phase 72.3.62, so it includes:
- Player More navigation hotfix
- cloud-persistent Admin test athletes
- migration 009
- all prior connection/family/Junior/Admin fixes

### Visual cleanup
The interface now emphasizes scanability instead of equal-weight text.

Changes include:
- larger page titles
- larger section headings
- readable body/form text
- smaller helper/eyebrow text
- stronger graphite panel contrast
- stronger forest-green primary actions
- softer silver secondary controls
- larger metric values
- clearer active navigation state
- simpler navigation sheets
- more whitespace between topics
- shorter top-of-page guidance copy
- stronger mobile typography
- larger Junior Player text and actions

No development features or role permissions were removed.

### Database
No new database migration was added for the visual cleanup.

This combined ZIP still includes migration:
`009_player_more_cloud_test_athletes.sql`

Run migration 009 only if it has not already been installed.
