import getMissingTimingFeedback from './utils';

const tf = (name, problemEarned, url = `/u/${name}`) => ({
  assignmentType: 'Timing Feedback',
  displayName: `Timing Feedback ${name} - X`,
  url,
  numPointsEarned: problemEarned + 1,
  problemScores: [{ earned: problemEarned, possible: 2 }, { earned: 1, possible: 1 }],
});

const tfAttempted = (name, attempted) => ({
  ...tf(name, 0),
  numPointsEarned: 1,
  problemScores: [{ earned: 0, possible: 2, attempted }, { earned: 1, possible: 1, attempted: true }],
});

describe('getMissingTimingFeedback', () => {
  it('works once the 1-point done block is removed and the problem is the only score', () => {
    const only = (name, attempted) => ({
      assignmentType: 'Timing Feedback',
      displayName: `Timing Feedback ${name} - X`,
      numPointsEarned: 0,
      problemScores: [{ earned: 0, possible: 1, attempted }],
    });
    const sections = [{ subsections: [only('01', true), only('02', false)] }];
    expect(getMissingTimingFeedback(sections).map(m => m.label)).toEqual(['2']);
  });

  it('uses the attempted flag, so a submission scoring 0 counts as submitted', () => {
    const sections = [{ subsections: [tfAttempted('01', true), tfAttempted('02', false), tfAttempted('03', false)] }];
    expect(getMissingTimingFeedback(sections).map(m => m.label)).toEqual(['2', '3']);
  });

  it('lists unsubmitted entries when some but not all are submitted', () => {
    const sections = [{ subsections: [tf('01', 1), tf('02', 0), tf('03', 2), tf('04', 0)] }];
    expect(getMissingTimingFeedback(sections).map(m => m.label)).toEqual(['2', '4']);
  });
  it('is empty when none are submitted', () => {
    expect(getMissingTimingFeedback([{ subsections: [tf('01', 0), tf('02', 0)] }])).toEqual([]);
  });
  it('is empty when all are submitted', () => {
    expect(getMissingTimingFeedback([{ subsections: [tf('01', 1), tf('02', 2)] }])).toEqual([]);
  });
  it('ignores other assignment types and missing data', () => {
    const other = { assignmentType: 'Progress Marker', displayName: 'PM', problemScores: [] };
    expect(getMissingTimingFeedback([{ subsections: [other] }])).toEqual([]);
    expect(getMissingTimingFeedback(undefined)).toEqual([]);
  });
});

describe('getMissingTimingFeedbackBeforeLastDone', () => {
  // eslint-disable-next-line global-require
  const { getMissingTimingFeedbackBeforeLastDone: sofar } = require('./utils');
  const doneUrl = key => `https://lms/courses/c/jump_to/block-v1:O+C+R+type@done+block@${key}`;
  const lesson = (key, checked) => ({
    assignmentType: 'Progress Marker',
    displayName: `Lesson ${key}`,
    problemScores: [{
      earned: checked ? 1 : 0, possible: 1, attempted: checked !== undefined, url: doneUrl(key),
    }],
  });
  const quiz = key => ({
    assignmentType: 'Homework',
    displayName: `Quiz ${key}`,
    problemScores: [{
      earned: 1, possible: 1, attempted: true, url: `https://lms/jump_to/block-v1:O+C+R+type@problem+block@${key}`,
    }],
  });

  it('lists every unsubmitted entry before the furthest checked Mark as complete, not just the last one', () => {
    const sections = [{
      subsections: [lesson(1, true), tfAttempted('00', false), lesson(2), tfAttempted('01', true),
        tfAttempted('02', false), lesson(3, true), tfAttempted('03', false), lesson(4)],
    }];
    expect(sofar(sections).map(m => m.label)).toEqual(['0', '2']);
  });

  it('fires even when no entry has been submitted yet', () => {
    const sections = [{ subsections: [lesson(1), tfAttempted('00', false), lesson(2, true)] }];
    expect(sofar(sections).map(m => m.label)).toEqual(['0']);
  });

  it('ignores unchecked (scored 0) done blocks and non-done problems', () => {
    const sections = [{ subsections: [tfAttempted('00', false), lesson(1, false), quiz('q')] }];
    expect(sofar(sections)).toEqual([]);
  });

  it('is empty when nothing earlier is missing', () => {
    const sections = [{ subsections: [lesson(1, true), tfAttempted('00', true), lesson(2, true), tfAttempted('01', false)] }];
    expect(sofar(sections)).toEqual([]);
  });
});
