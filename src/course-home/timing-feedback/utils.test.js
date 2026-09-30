import getMissingTimingFeedback from './utils';

const tf = (name, problemEarned, url = `/u/${name}`) => ({
  assignmentType: 'Timing Feedback',
  displayName: `Timing Feedback ${name} - X`,
  url,
  numPointsEarned: problemEarned + 1,
  problemScores: [{ earned: problemEarned, possible: 2 }, { earned: 1, possible: 1 }],
});

describe('getMissingTimingFeedback', () => {
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
