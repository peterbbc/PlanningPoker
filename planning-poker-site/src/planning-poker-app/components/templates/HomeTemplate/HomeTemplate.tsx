import React from 'react';
import cx from 'classnames';
import videoWebm from './video/planning-poker-voting.webm';
import videoMp4 from './video/planning-poker-voting.mp4';
import videoJpg from './video/planning-poker-voting.jpg';
// mockups
import voting from './images/mockups/voting.webp';
import results from './images/mockups/results.webp';
import issues from './images/mockups/issues.webp';
import jira from './images/mockups/jira.webp';
import iphone from './images/mockups/iphone.webp';
import csv from './images/mockups/csv.webp';
import facilitators from './images/mockups/facilitators.webp';
import votingJpg from './images/mockups/voting.jpg';
import resultsJpg from './images/mockups/results.jpg';
import issuesJpg from './images/mockups/issues.jpg';
import jiraJpg from './images/mockups/jira.jpg';
import iphonePng from './images/mockups/iphone.png';
import csvJpg from './images/mockups/csv.jpg';
import facilitatorsJpg from './images/mockups/facilitators.jpg';
import crew from './images/crew.svg';
import confusedWoman from './images/woman-confused.svg';
import howitworks_1 from './images/how-it-works/1.svg';
import howitworks_2 from './images/how-it-works/2.svg';
import howitworks_3 from './images/how-it-works/3.svg';
// logos
import microsoft from './images/logos/microsoft.svg';
import deloitte from './images/logos/deloitte.svg';
import ing from './images/logos/ing.svg';
import hpe from './images/logos/hpe.svg';
import mastercard from './images/logos/mastercard.svg';
// /mockups
import styles from './HomeTemplate.module.scss';
import {
  Button,
  ButtonLink,
  Container,
  FlexBox,
  Header1,
  Header2,
  Header3,
  HoritzontalSpacing,
  Paragraph,
  VerticalSpacing,
} from '../../../../packages/react-base';
import { Navigation } from '../../organisms/Navigation/Navigation';
import { HomeSection } from '../../molecules/HomeSection/HomeSection';
import { Wave } from '../../atoms/Wave/Wave';
import { Footer } from '../../organisms/Footer/Footer';
import { Link } from '../../atoms/Link/Link';
import { Plan } from '../../../containers/premium/PricingModal/Plan/Plan';
import { useProceedToPayment } from '../../../spaces/premium/hooks/useProceedToPayment';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';

const SECTIONS = [
  {
    title: 'Vote issues in real-time',
    text: 'Your team will be more engaged with our clear and useful interface.',
    mockupSrc: voting,
    mockupSrcFallback: votingJpg,
  },
  {
    title: 'Get visual results of each voting round',
    text: 'See all the useful data of the voting round in one quick look.',
    mockupSrc: results,
    mockupSrcFallback: resultsJpg,
  },
  {
    title: 'Create issues that you want to vote for',
    text: 'Use the sidebar to manage the issues that your team is voting on.',
    mockupSrc: issues,
    mockupSrcFallback: issuesJpg,
  },
  {
    title: 'JIRA Integration',
    text: 'Import issues from JIRA and then save back the results of the votes.',
    mockupSrc: jira,
    mockupSrcFallback: jiraJpg,
  },
  {
    title: `Import issues from CSV files or pasting issues' URLs`,
    text: 'Use CSV files to import your issues to any game, or import them directly by pasting a list of the issues’ urls.',
    mockupSrc: csv,
    mockupSrcFallback: csvJpg,
  },
  {
    title: 'One solution for any organization size',
    text: `Manage all the facilitators' licenses of your plan from a single account.`,
    mockupSrc: facilitators,
    mockupSrcFallback: facilitatorsJpg,
  },
  {
    title: 'On the way?',
    text: `No problem! The Planning Poker Online web app works on all devices so you can vote on your issues from anywhere and at any time.`,
    mockupSrc: iphone,
    mockupSrcFallback: iphonePng,
  },
];

export const HomeTemplate = () => {
  const setIsContactModalOpen = useAppContext().contactModal[1];
  // const setIsPricingModalOpen = useAppContext().pricingModal[1];

  const { handlePlansProceedClick, isLoading } = useProceedToPayment();

  return (
    <>
      <Navigation isHome />
      <main className={styles['home-container']}>
        <VerticalSpacing spacing="spacing-xxl" />
        <Container className={styles['first-section']}>
          <div className={styles['first-section__left']}>
            <div className={styles['first-section__headline']}>
              <Header1>Scrum Poker for agile development teams</Header1>
              <VerticalSpacing spacing="spacing-l" />
              <Paragraph color="grey600">
                Simple and engaging tool to make estimates.
              </Paragraph>
            </div>
            <VerticalSpacing spacing="spacing-l" />
            <div className={styles['first-section__cta']}>
              <Link to="/new-game">
                <Button isBlock>Start new game</Button>
              </Link>
            </div>
            <VerticalSpacing spacing="spacing-xxl-4" />
            <div className={styles['first-section__logos']}>
              <p className={styles['first-section__logos-label']}>
                Trusted by teams at
              </p>
              <VerticalSpacing spacing="spacing-l" />
              <ul className={styles['first-section__logos-list']}>
                <li
                  key="logo-Microsoft"
                  className={styles['first-section__logos-item']}
                >
                  <img src={microsoft} alt="Microsoft" />
                </li>
                <li
                  key="logo-HP"
                  className={styles['first-section__logos-item']}
                >
                  <img src={hpe} alt="HP" />
                </li>
                <li
                  key="logo-Mastercard"
                  className={styles['first-section__logos-item']}
                >
                  <img src={mastercard} alt="Mastercard" />
                </li>
                <li
                  key="logo-ING"
                  className={styles['first-section__logos-item']}
                >
                  <img src={ing} alt="ING" />
                </li>
                <li
                  key="logo-Deloitte"
                  className={styles['first-section__logos-item']}
                >
                  <img src={deloitte} alt="Deloitte" />
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className={styles['video-wrapper']}>
              <div className={styles['crew']}>
                <img src={crew} />
              </div>
              <div className={styles['video-container']}>
                <video
                  aria-describedby="bring-your-team-together-in-channels-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={videoJpg}
                >
                  <source src={videoMp4} type="video/mp4" />
                  <source src={videoWebm} type="video/webm" />
                </video>
              </div>
            </div>
          </div>
        </Container>
        <div
          className={cx(
            styles['sections-grey'],
            styles['sections-grey--first'],
          )}
        >
          <Wave color="grey100" className={styles['wave']} />
          <Container>
            <FlexBox justifyContent="center">
              <div className={styles['caption']}>
                <Header2>Stop boring plannings</Header2>
                <VerticalSpacing spacing="spacing-l" />
                <Paragraph color="grey600" align="center">
                  We give you the confidence that your team is connected and
                  stays productive.
                </Paragraph>
              </div>
            </FlexBox>
          </Container>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <VerticalSpacing spacing="spacing-xl" />
          {SECTIONS.map(
            ({ title, text, mockupSrc, mockupSrcFallback }, index) => {
              const isIphone = SECTIONS.length - 1 === index;
              return (
                <div key={index}>
                  <HomeSection
                    title={title}
                    text={text}
                    mockupSrc={mockupSrc}
                    mockupSrcFallback={mockupSrcFallback}
                    textPosition={index % 2 || isIphone ? 'right' : 'left'}
                    mockupAspectRatio={isIphone ? '737 / 588' : '1324 / 828'}
                    isIphone={isIphone}
                  />
                  {!isIphone && (
                    <>
                      <VerticalSpacing spacing="spacing-xxl-4" />
                      <VerticalSpacing spacing="spacing-xl" />
                    </>
                  )}
                </div>
              );
            },
          )}
        </div>
        <div className={styles['sections-white']}>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <VerticalSpacing spacing="spacing-xl" />
          <Container className={styles['how-it-works-section']}>
            <Header2>How it works</Header2>
            <VerticalSpacing spacing="spacing-l" />
            <Paragraph color="grey600" align="center">
              Get started with Planning Poker Online in just 3 steps.
            </Paragraph>
            <VerticalSpacing spacing="spacing-xxl-4" />
            <div className={styles['how-it-works-section__steps']}>
              <div>
                <div>
                  <img src={howitworks_1} />
                </div>
                <div>
                  <Header3>1. Start new game</Header3>
                  <VerticalSpacing spacing="spacing-l" spacingXL="spacing-s" />
                  <Paragraph color="grey600">
                    <Link to="/new-game">
                      <ButtonLink>Start new game</ButtonLink>
                    </Link>
                    . You can also add the issues you want to vote for.
                  </Paragraph>
                </div>
              </div>
              <div>
                <div>
                  <img src={howitworks_2} />
                </div>
                <div>
                  <Header3>2. Invite your team</Header3>
                  <VerticalSpacing spacing="spacing-l" spacingXL="spacing-s" />
                  <Paragraph color="grey600">
                    Send the game URL to your teammates.
                  </Paragraph>
                </div>
              </div>
              <div>
                <div>
                  <img src={howitworks_3} />
                </div>
                <div>
                  <Header3>3. Start voting</Header3>
                  <VerticalSpacing spacing="spacing-l" spacingXL="spacing-s" />
                  <Paragraph color="grey600">
                    You and your team can start the game!
                  </Paragraph>
                </div>
              </div>
            </div>
          </Container>
          <Container>
            <VerticalSpacing spacing="spacing-xxl-4" />
            <VerticalSpacing spacing="spacing-xl" />
            <FlexBox justifyContent="center">
              <div className={styles['caption']}>
                <Header2>
                  Find the plan that’s right for your organization
                </Header2>
              </div>
            </FlexBox>

            <VerticalSpacing spacing="spacing-xxl-4" />
            <VerticalSpacing spacing="spacing-xl" />
            <FlexBox
              className={styles.plans}
              justifyContent="center"
              alignItems="strech"
            >
              <Plan
                plan="basic"
                key="basic"
                onProceed={handlePlansProceedClick}
                onClose={() => {}}
              />
              <HoritzontalSpacing
                className={styles.spacing}
                spacing="spacing-l"
              />
              <Plan
                plan="premium"
                key="premium"
                onProceed={handlePlansProceedClick}
                onClose={() => {}}
                isLoading={!!isLoading}
              />
            </FlexBox>
          </Container>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <VerticalSpacing spacing="spacing-xl" />
        </div>
        <div className={styles['sections-grey']}>
          <Wave color="grey100" className={styles['wave']} />
          <VerticalSpacing spacing="spacing-xxl-4" />
          <VerticalSpacing spacing="spacing-xl" />
          <Container className={styles['section-faqs-contact']}>
            <div style={{ gridArea: 'text' }}>
              <Header2>Got any questions?</Header2>
              <VerticalSpacing spacing="spacing-l" />
              <Paragraph color="grey600">
                We are always willing to help. Go to the FAQs or get in touch
                with our support team for more information.
              </Paragraph>
              <VerticalSpacing spacing="spacing-l" />
              <Link to="/faqs">
                <Button buttonStyle="secondary">Go to the FAQs</Button>
              </Link>
              <HoritzontalSpacing spacing="spacing-l" />
              <div className={styles['section-faqs-contact__spacing-v']}>
                <VerticalSpacing spacing="spacing-l" />
              </div>
              <Button
                buttonStyle="secondary"
                onClick={() => setIsContactModalOpen(true)}
              >
                Contact us
              </Button>
            </div>
            <div
              className={styles['section-faqs-contact__img']}
              style={{ gridArea: 'image' }}
            >
              <img src={confusedWoman} alt="Confused woman" />
            </div>
          </Container>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <VerticalSpacing spacing="spacing-xl" />
          <VerticalSpacing spacing="spacing-xxl-4" />
          <VerticalSpacing spacing="spacing-xl" />
        </div>
      </main>
      <Footer />
    </>
  );
};
