import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';
import { DataTable } from '@openedx/paragon';
import { useContextId } from '../../../../data/hooks';

import { useModel } from '../../../../generic/model-store';
import messages from '../messages';
import SubsectionTitleCell from './SubsectionTitleCell';
import { showUngradedAssignments } from '../../utils';
import { isSubmitted, isTimingFeedback } from '../../../timing-feedback/utils';

const DetailedGradesTable = () => {
  const intl = useIntl();
  const courseId = useContextId();

  const {
    sectionScores,
  } = useModel('progress', courseId);

  const isLocaleRtl = isRtl(getLocale());
  return (
    sectionScores.map((chapter) => {
      const subsectionScores = chapter.subsections.filter(
        // OST2: Timing Feedback is set to never show correctness, so it would be filtered out here.
        // Always list it, scored 1/1 once submitted and 0/1 otherwise.
        (subsection) => isTimingFeedback(subsection) || !!(
          (showUngradedAssignments() || subsection.hasGradedAssignment)
            && subsection.showGrades
            && (subsection.numPointsPossible > 0 || subsection.numPointsEarned > 0)
        ),
      );

      if (subsectionScores.length === 0) {
        return null;
      }

      const detailedGradesData = subsectionScores.map((subsection) => {
        const timingFeedback = isTimingFeedback(subsection);
        const earned = timingFeedback ? Number(isSubmitted(subsection)) : subsection.numPointsEarned;
        const possible = timingFeedback ? 1 : subsection.numPointsPossible;
        return {
          subsectionTitle: <SubsectionTitleCell subsection={subsection} hideProblemScores={timingFeedback} />,
          score: <span className={subsection.learnerHasAccess ? '' : 'greyed-out'}>{earned}{isLocaleRtl ? '\\' : '/'}{possible}</span>,
        };
      });

      return (
        <div className="my-3" key={`${chapter.displayName}-grades-table`}>
          <DataTable
            data={detailedGradesData}
            itemCount={detailedGradesData.length}
            columns={[
              {
                Header: chapter.displayName,
                accessor: 'subsectionTitle',
                headerClassName: 'h5 mb-0',
                cellClassName: 'mw-100',
              },
              {
                Header: `${intl.formatMessage(messages.score)}`,
                accessor: 'score',
                headerClassName: 'justify-content-end h5 mb-0',
                cellClassName: 'align-top text-right small',
              },
            ]}
          >
            <DataTable.Table />
          </DataTable>
        </div>
      );
    })
  );
};

export default DetailedGradesTable;
