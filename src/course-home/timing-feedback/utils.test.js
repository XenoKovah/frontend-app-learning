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
