// OST2 (teak3_1_hide-completion-tracking-better)
//
// ENABLE_COMPLETION_TRACKING is turned on for *background* data collection / sanity-
// checking only. The auto-computed block-completion state must stay INVISIBLE to learners,
// because it contradicts the manual "Mark as complete" (done XBlock) buttons that are
// OST2's real progress mechanism — showing both confuses learners about what actually
// counts.
//
// This flag suppresses every student-facing block-completion indicator:
//   - Course-outline tab .......... section & subsection check-circles (SectionTitle/SequenceTitle)
//   - Sequence navigation ......... unit "complete" check + green highlight (UnitButton)
//   - Course-outline sidebar tray . section/sequence completion icons + unit complete icons
//                                   (CompletionIcon, UnitIcon)
//   - Progress tab ................ the "Course completion" donut + % (CourseCompletion)
//
// It deliberately does NOT touch: the manual done-buttons, grades, certificate status,
// or the completion data itself (which keeps being collected for staff analysis).
//
// Typed as `boolean` (not the literal `true`) so guards like `!HIDE_COMPLETION_UI` do not
// trip "this condition is always false" TS/eslint errors.
export const HIDE_COMPLETION_UI: boolean = true;
