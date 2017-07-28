/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Challenge header component.
 * This component renders all other child components part of the header.
 * Any data massaging needed for a child view should be done here.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { challengeLinks } from 'utils/tc';
import ArrowUp from '../../../../assets/images/icon-arrow-up.svg';
import ArrowDown from '../../../../assets/images/icon-arrow-down.svg';

import Prizes from './Prizes';
import ChallengeTags from './ChallengeTags';
import DeadlineCards from './DeadlineCards';
import ChallengeViewSelector from './ChallengeViewSelector';
import './style.scss';

export default function ChallengeHeader(props) {
  const {
    name,
    track,
    subTrack,
    events,
    technologies,
    platforms,
    prizes,
    numberOfCheckpointsPrizes,
    topCheckPointPrize,
    reliabilityBonus,
    userDetails,
    currentPhases,
    registrationEndDate,
    submissionEndDate,
    numRegistrants,
    numSubmissions,
    allPhases,
  } = props.challenge;

  const trackLower = track ? track.toLowerCase() : 'design';
  const stylizedSubTrack = (subTrack || '').replace('_', ' ')
    .replace(/\w\S*/g, txt => _.capitalize(txt));
  const subTrackStyle = `${trackLower}-accent-background`;
  const eventStyle = `${trackLower}-accent-color`;
  const eventNames = (events || []).map((event => (event.eventName || '').toUpperCase()));
  const miscTags = _.union((technologies || '').split(', '), platforms.split(', '));

  const tagFilterString = '/challenges?filter[tags][0]=';

  let bonusType = '';
  if (numberOfCheckpointsPrizes && topCheckPointPrize) {
    bonusType = 'Bonus';
  } else if (reliabilityBonus) {
    bonusType = 'Reliability Bonus';
  }
  const hasRegistered = userDetails && userDetails.roles && userDetails.roles.includes('Submitter');
  const registrationEnded = new Date(registrationEndDate).getTime() < Date.now();
  const submissionEnded = new Date(submissionEndDate).getTime() < Date.now();
  const hasSubmissions = userDetails && userDetails.hasUserSubmittedForReview;
  const nextDeadline = currentPhases && currentPhases.length > 0 && currentPhases[0].phaseType;
  const deadlineEnd = currentPhases && currentPhases.length > 0 ?
    new Date(currentPhases[0].scheduledEndTime).getTime() : Date.now();
  const currentTime = Date.now();
  const timeDiff = deadlineEnd > currentTime ? deadlineEnd - currentTime : 0;
  const duration = moment.duration(timeDiff);
  const timeLeft = `${duration.days()}d ${duration.hours()}:${duration.minutes()}h`;
  let relevantPhases = [];
  let registerButtonStyle = 'challenge-action-common';
  let submitButtonStyle = 'challenge-action-common';
  let viewSubmissionsStyle = 'challenge-action-common';
  const buttonEnableStyle = `challenge-action-${trackLower}`;
  if (!registrationEnded) {
    if (hasRegistered) {
      registerButtonStyle = `${registerButtonStyle} challenge-action-warning`;
    } else {
      registerButtonStyle = `${registerButtonStyle} ${buttonEnableStyle}`;
    }
  }
  if (!submissionEnded && hasRegistered) {
    submitButtonStyle = `${submitButtonStyle} ${buttonEnableStyle}`;
  }
  if (hasRegistered && hasSubmissions) {
    viewSubmissionsStyle = `${viewSubmissionsStyle} ${buttonEnableStyle}`;
  }

  if (props.showDeadlineDetail) {
    relevantPhases = (allPhases || []).filter((phase) => {
      const phaseLowerCase = phase.phaseType.toLowerCase();
      if (phaseLowerCase.includes('screening') || phaseLowerCase.includes('specification')) {
        return false;
      }
      if (phaseLowerCase.includes('registration') || phaseLowerCase.includes('checkpoint') ||
          phaseLowerCase.includes('submission') || phaseLowerCase.includes('approval') ||
          phaseLowerCase.includes('review')) {
        return true;
      }
      return false;
    });

    relevantPhases.sort((a, b) => {
      if (a.phaseType.toLowerCase().includes('registration')
      || b.phaseType.toLowerCase().includes('approval')) {
        return -1;
      }
      if (b.phaseType.toLowerCase().includes('registration')
      || a.phaseType.toLowerCase().includes('approval')) {
        return 1;
      }
      return (new Date(a.actualEndTime || a.scheduledEndTime)).getTime() -
      (new Date(b.actualEndTime || b.scheduledEndTime)).getTime();
    });
  }

  return (
    <div styleName="challenge-outer-container">
      <div styleName="important-detail">
        <h1 styleName="challenge-header">{name}</h1>
        <ChallengeTags
          subTrack={stylizedSubTrack}
          events={eventNames}
          technPlatforms={miscTags}
          subTrackStyle={subTrackStyle}
          eventStyle={eventStyle}
          tagFilterString={tagFilterString}
        />
        <div styleName="prizes-ops-container">
          <div styleName="prizes-outer-container">
            <h3 styleName="prizes-title">PRIZES</h3>
            <Prizes prizes={prizes && prizes.length ? prizes : [0]} />
            {
              bonusType &&
              <div id={`bonus-${trackLower}`} styleName="bonus-div">
                {
                  bonusType === 'Bonus' ?
                    <p styleName="bonus-text">
                      <span styleName={`bonus-highlight ${trackLower}-accent-color`}>
                        BONUS: {numberOfCheckpointsPrizes} </span>CHECKPOINTS AWARDED
                        WORTH <span styleName={`bonus-highlight ${trackLower}-accent-color`}>${topCheckPointPrize} </span>EACH
                    </p> :
                    <p styleName="bonus-text">
                      <span styleName={`bonus-highlight ${trackLower}-accent-color`}>
                        RELIABILITY BONUS: {reliabilityBonus}
                      </span>
                    </p>
                }
              </div>
            }
          </div>
          <div styleName="challenge-ops-container">
            <div styleName="challenge-ops">
              <form method="get" styleName="challenge-ops-form">
                <button
                  disabled={registrationEnded}
                  styleName={registerButtonStyle}
                  type="submit"
                  formAction={challengeLinks(props.challenge, 'detail')}
                >{hasRegistered ? 'Unregister' : 'Register'}
                </button>
                <button
                  disabled={!hasRegistered || submissionEnded}
                  styleName={submitButtonStyle}
                  type="submit"
                  formAction={challengeLinks(props.challenge, 'submit')}
                >Submit
                </button>
                <button
                  disabled={!hasRegistered || !hasSubmissions}
                  styleName={viewSubmissionsStyle}
                  type="submit"
                  formAction={challengeLinks(props.challenge, 'submissions')}
                >View Submissions
                </button>
              </form>
            </div>
          </div>
        </div>
        <div styleName="deadlines-view">
          <div styleName="deadlines-overview">
            <div styleName="deadlines-overview-text">
              <div styleName="next-deadline">
                Next Deadline: <span styleName="deadline-highlighted">{nextDeadline || '-'}</span>
              </div>
              <div styleName="current-phase">
                <span styleName="deadline-highlighted">{timeLeft}</span> until current deadline ends
              </div>
            </div>
            <a onClick={props.onToggleDeadlines} styleName="deadlines-collapser">
              {props.showDeadlineDetail ?
                <span styleName="collapse-text">Hide Deadlines <ArrowDown /></span>
                : <span styleName="collapse-text">View All Deadlines <ArrowUp /></span>
              }
            </a>
          </div>
          {
            props.showDeadlineDetail &&
            <DeadlineCards relevantPhases={relevantPhases} />
          }
        </div>
        <ChallengeViewSelector
          onSelectorClicked={props.onSelectorClicked}
          trackLower={trackLower}
          selectedView={props.selectedView}
          numRegistrants={numRegistrants}
          numSubmissions={numSubmissions}
        />
      </div>
    </div>
  );
}

ChallengeHeader.propTypes = {
  onSelectorClicked: PT.func.isRequired,
  selectedView: PT.string.isRequired,
  challenge: PT.shape().isRequired,
  showDeadlineDetail: PT.bool.isRequired,
  onToggleDeadlines: PT.func.isRequired,
};