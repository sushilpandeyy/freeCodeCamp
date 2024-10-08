// Package Utilities
import { graphql } from 'gatsby';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { ObserveKeys } from 'react-hotkeys';
import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import { createSelector } from 'reselect';
import { Container, Col, Row, Button } from '@freecodecamp/ui';

// Local Utilities
import Loader from '../../../components/helpers/loader';
import Spacer from '../../../components/helpers/spacer';
import LearnLayout from '../../../components/layouts/learn';
import { ChallengeNode, ChallengeMeta, Test } from '../../../redux/prop-types';
import { challengeTypes } from '../../../../../shared/config/challenge-types';
import ChallengeDescription from '../components/challenge-description';
import Hotkeys from '../components/hotkeys';
import VideoPlayer from '../components/video-player';
import ChallengeTitle from '../components/challenge-title';
import CompletionModal from '../components/completion-modal';
import HelpModal from '../components/help-modal';
import PrismFormatted from '../components/prism-formatted';
import {
  challengeMounted,
  updateChallengeMeta,
  openModal,
  updateSolutionFormValues,
  initTests
} from '../redux/actions';
import { isChallengeCompletedSelector } from '../redux/selectors';

// Styles
import '../video.css';

// Redux Setup
const mapStateToProps = createSelector(
  isChallengeCompletedSelector,
  (isChallengeCompleted: boolean) => ({
    isChallengeCompleted
  })
);
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      initTests,
      updateChallengeMeta,
      challengeMounted,
      updateSolutionFormValues,
      openCompletionModal: () => openModal('completion'),
      openHelpModal: () => openModal('help')
    },
    dispatch
  );

// Types
interface ShowVideoProps {
  challengeMounted: (arg0: string) => void;
  data: { challengeNode: ChallengeNode };
  description: string;
  initTests: (xs: Test[]) => void;
  isChallengeCompleted: boolean;
  openCompletionModal: () => void;
  openHelpModal: () => void;
  pageContext: {
    challengeMeta: ChallengeMeta;
  };
  t: TFunction;
  updateChallengeMeta: (arg0: ChallengeMeta) => void;
  updateSolutionFormValues: () => void;
}

interface ShowVideoState {
  subtitles: string;
  downloadURL: string | null;
  selectedOption: number | null;
  answer: number;
  showWrong: boolean;
  videoIsLoaded: boolean;
}

// Component
class ShowVideo extends Component<ShowVideoProps, ShowVideoState> {
  static displayName: string;
  private container: React.RefObject<HTMLElement> = React.createRef();

  constructor(props: ShowVideoProps) {
    super(props);
    this.state = {
      subtitles: '',
      downloadURL: null,
      selectedOption: null,
      answer: 1,
      showWrong: false,
      videoIsLoaded: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(): void {
    const {
      challengeMounted,
      data: {
        challengeNode: {
          challenge: {
            fields: { tests },
            title,
            challengeType,
            helpCategory
          }
        }
      },
      pageContext: { challengeMeta },
      initTests,
      updateChallengeMeta
    } = this.props;
    initTests(tests);
    updateChallengeMeta({
      ...challengeMeta,
      title,
      challengeType,
      helpCategory
    });
    challengeMounted(challengeMeta.id);
    this.container.current?.focus();
  }

  componentDidUpdate(prevProps: ShowVideoProps): void {
    const {
      data: {
        challengeNode: {
          challenge: { title: prevTitle }
        }
      }
    } = prevProps;
    const {
      challengeMounted,
      data: {
        challengeNode: {
          challenge: { title: currentTitle, challengeType, helpCategory }
        }
      },
      pageContext: { challengeMeta },
      updateChallengeMeta
    } = this.props;
    if (prevTitle !== currentTitle) {
      updateChallengeMeta({
        ...challengeMeta,
        title: currentTitle,
        challengeType,
        helpCategory
      });
      challengeMounted(challengeMeta.id);
    }
  }

  handleSubmit(solution: number, openCompletionModal: () => void) {
    if (solution - 1 === this.state.selectedOption) {
      this.setState({
        showWrong: false
      });
      openCompletionModal();
    } else {
      this.setState({
        showWrong: true
      });
    }
  }

  handleOptionChange = (
    changeEvent: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({
      showWrong: false,
      selectedOption: parseInt(changeEvent.target.value, 10)
    });
  };

  onVideoLoad = () => {
    this.setState({
      videoIsLoaded: true
    });
  };

  render() {
    const {
      data: {
        challengeNode: {
          challenge: {
            title,
            challengeType,
            description,
            superBlock,
            block,
            translationPending,
            videoId,
            videoLocaleIds,
            bilibiliIds,
            fields: { blockName },
            question: { text, answers, solution }
          }
        }
      },
      openCompletionModal,
      openHelpModal,
      pageContext: {
        challengeMeta: { nextChallengePath, prevChallengePath }
      },
      t,
      isChallengeCompleted
    } = this.props;

    const blockNameTitle = `${t(
      `intro:${superBlock}.blocks.${block}.title`
    )} - ${title}`;

    const feedback =
      this.state.selectedOption !== null
        ? answers[this.state.selectedOption].feedback
        : undefined;

    return (
      <Hotkeys
        executeChallenge={() => {
          this.handleSubmit(solution, openCompletionModal);
        }}
        containerRef={this.container}
        nextChallengePath={nextChallengePath}
        prevChallengePath={prevChallengePath}
      >
        <LearnLayout>
          <Helmet
            title={`${blockNameTitle} | ${t('learn.learn')} | freeCodeCamp.org`}
          />
          <Container>
            <Row>
              <Spacer size='medium' />
              <ChallengeTitle
                isCompleted={isChallengeCompleted}
                translationPending={translationPending}
              >
                {title}
              </ChallengeTitle>

              {challengeType === challengeTypes.video && (
                <Col lg={10} lgOffset={1} md={10} mdOffset={1}>
                  <div className='video-wrapper'>
                    {!this.state.videoIsLoaded ? (
                      <div className='video-placeholder-loader'>
                        <Loader />
                      </div>
                    ) : null}
                    <VideoPlayer
                      bilibiliIds={bilibiliIds}
                      onVideoLoad={this.onVideoLoad}
                      title={title}
                      videoId={videoId}
                      videoIsLoaded={this.state.videoIsLoaded}
                      videoLocaleIds={videoLocaleIds}
                    />
                  </div>
                </Col>
              )}

              <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
                <ChallengeDescription description={description} />
                <PrismFormatted className={'line-numbers'} text={text} />
                <Spacer size='medium' />
                <ObserveKeys>
                  <div className='video-quiz-options'>
                    {answers.map(({ answer }, index) => (
                      // answers are static and have no natural id property, so
                      // index should be fine as a key:
                      <label
                        className='video-quiz-option-label'
                        key={index}
                        htmlFor={`mc-question-${index}`}
                      >
                        <input
                          checked={this.state.selectedOption === index}
                          className='sr-only'
                          name='quiz'
                          onChange={this.handleOptionChange}
                          type='radio'
                          value={index}
                          id={`mc-question-${index}`}
                        />{' '}
                        <span className='video-quiz-input-visible'>
                          {this.state.selectedOption === index ? (
                            <span className='video-quiz-selected-input' />
                          ) : null}
                        </span>
                        <PrismFormatted
                          className={'video-quiz-option'}
                          text={answer.replace(/^<p>|<\/p>$/g, '')}
                          useSpan
                          noAria
                        />
                      </label>
                    ))}
                  </div>
                </ObserveKeys>
                <Spacer size='medium' />
                <div
                  style={{
                    textAlign: 'center'
                  }}
                >
                  {this.state.showWrong ? (
                    <span>
                      {feedback ? (
                        <PrismFormatted
                          className={'multiple-choice-feedback'}
                          text={feedback}
                        />
                      ) : (
                        t('learn.wrong-answer')
                      )}
                    </span>
                  ) : (
                    <span>{t('learn.check-answer')}</span>
                  )}
                </div>
                <Spacer size='medium' />
                <Button
                  block={true}
                  variant='primary'
                  onClick={() =>
                    this.handleSubmit(solution, openCompletionModal)
                  }
                >
                  {t('buttons.check-answer')}
                </Button>
                <Spacer size='xxSmall' />
                <Button block={true} variant='primary' onClick={openHelpModal}>
                  {t('buttons.ask-for-help')}
                </Button>
                <Spacer size='large' />
              </Col>
              <CompletionModal />
              <HelpModal challengeTitle={title} challengeBlock={blockName} />
            </Row>
          </Container>
        </LearnLayout>
      </Hotkeys>
    );
  }
}

ShowVideo.displayName = 'ShowVideo';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ShowVideo));

export const query = graphql`
  query VideoChallenge($id: String!) {
    challengeNode(id: { eq: $id }) {
      challenge {
        videoId
        videoLocaleIds {
          espanol
          italian
          portuguese
        }
        bilibiliIds {
          aid
          bvid
          cid
        }
        title
        description
        challengeType
        helpCategory
        superBlock
        block
        fields {
          blockName
          slug
          tests {
            text
            testString
          }
        }
        question {
          text
          answers {
            answer
            feedback
          }
          solution
        }
        translationPending
      }
    }
  }
`;
