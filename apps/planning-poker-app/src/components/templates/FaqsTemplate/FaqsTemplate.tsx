import React from 'react';
import {
  BackToTopButton,
  Container,
  Header1,
  Header4,
  Paragraph,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import { Navigation } from '../../organisms/Navigation/Navigation';
import { Link } from '../../atoms/Link/Link';
import styles from './FaqsTemplate.module.scss';

const FAQS = [
  {
    id: 'non-profit',
    title: 'Do you offer discounts for non-profit organizations?',
    content: (
      <>
        <Paragraph>
          Yes we do. Please contact us explaining your case at{' '}
          <a href="mailto:info@weagileyou.com">info@weagileyou.com</a>.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'jira-integration',
    title: 'How does Jira integration work?',
    content: (
      <>
        <Paragraph>
          Integration with Jira allows you to import issues into a game and save
          the estimations back to Jira when the team finishes voting.
        </Paragraph>
        <VerticalSpacing spacing="spacing-m" />
        <Paragraph>Setting up the integration is quick and easy:</Paragraph>
        <ol>
          <li>
            {`Inside a game, click on the "import from JIRA" option at the right sidebar menu.`}
          </li>
          <li>
            Follow the wizard to allow access to your JIRA account (this will
            generate an auth token that will be valid for 1 hour and will give
            us access to see and manage your issues in JIRA)
          </li>
          <li>
            Select the field you use for story points (each JIRA account is
            different so you need to manually select this in order to sync story
            points to your issues in JIRA.You can change this later from the
            Jira settings)
          </li>
          <li>
            Then you are good to go! Search for the issues you want to vote for
            and import them into the game.
          </li>
          <li>
            When voting has finished, click on the save button at the right
            sidebar to save issues back to JIRA.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: 'free-version-limits',
    title: 'What are the limits of the free plan?',
    content: (
      <>
        <Paragraph>Currently free games are limited to:</Paragraph>
        <ul>
          <li>9 votings per game</li>
          <li>5 voted issues per game</li>
          <li>
            Players that play for more than 6 weeks will trigger a blocking
            message when they join a free game.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'players-limit',
    title: 'Is there a limit of players in the game?',
    content: (
      <>
        <Paragraph>
          No. There is no limit on the number of players that can join a game
          for all plans.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'resellers',
    title: 'What are the recommendations for resellers?',
    content: (
      <>
        <Paragraph>
          If you need to purchase a premium account for someone else we
          recommend following these steps:
        </Paragraph>
        <ol>
          <li>
            Create a new premium account by selecting the number of facilitators
            that your client will need. One is usually enough for small
            companies, whereas larger ones might want one facilitator per scrum
            master.
          </li>
          <li>
            When the premium account is activated, go to "manage facilitators"
            and invite your client as a facilitator, they will receive an
            invitation link on their email. You can set them as "Facilitators
            manager" so they will be able to invite other facilitators.
          </li>
          <li>
            Optionally you can remove yourself as facilitator so they will have
            another empty seat.
          </li>
        </ol>
        <Paragraph>
          We recommend creating different premium accounts for each client so
          you have different invoices per client and you don't mix facilitators
          from different clients.
        </Paragraph>
        <VerticalSpacing spacing="spacing-m" />
        <Paragraph>
          Please see our{' '}
          <a
            href="https://planningpokeronline.com/reseller-terms/"
            target="_blank"
          >
            RESELLER TERMS AND CONDITIONS
          </a>{' '}
          for legal information.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'game-not-loading',
    title: 'Game is not loading (network problems)?',
    content: (
      <>
        <Paragraph>
          {`Some users may face problems with games not loading properly. This is usually caused by a security firewall on their organization’s network or on their computers. The problem may also be caused by a browser extension.`}
        </Paragraph>
        <VerticalSpacing spacing="spacing-m" />
        <Paragraph>
          If you believe that this is not the case and you still are facing
          issues remember that you can always contact us. We are always happy to
          help.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'turn-off-auto-renew',
    title: 'Can I turn off auto-renew for my premium account?',
    content: (
      <>
        <Paragraph>
          {`Yes, just cancel your subscription. If you cancel the subscription you won’t get any more invoices and the premium plan will remain active until the end of the already paid period.`}
        </Paragraph>
      </>
    ),
  },
  {
    id: 'invoices',
    title: 'Where can I find the invoices?',
    content: (
      <>
        <Paragraph>
          {`All invoices are automatically sent to the billing email address specified in "My account".`}
        </Paragraph>
        <VerticalSpacing spacing="spacing-m" />
        <Paragraph>
          {`You can also download them from "My account" > "View all invoices".`}
        </Paragraph>
      </>
    ),
  },
  {
    id: 'delegate',
    title: 'Can I delegate the right to create premium games to another user?',
    content: (
      <>
        <Paragraph>
          {`Yes. If you have a premium account, remove yourself from "facilitators" (from "user menu" > "manage facilitators") and then invite another user as facilitator.`}
        </Paragraph>
      </>
    ),
  },
  {
    id: 'trial-cancel',
    title: 'Can I cancel the trial period without being charged?',
    content: (
      <>
        <Paragraph>
          Yes. If you cancel the subscription during the trial period you will
          not be charged. Also, your premium account will remain active until
          the end of the trial period.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'still-asking-for-premium',
    title:
      'The game is still asking to go premium even if we are already premium?',
    content: (
      <>
        <Paragraph>
          Usually this happens because the game was not created by the premium
          account. You can set yourself as the facilitator of the game (if you
          are the premium account) to make it premium and unlimited.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'integrations',
    title:
      'Do you have integration with Azure Devops or any other issue management tool?',
    content: (
      <>
        <Paragraph>
          We only have Jira integration at the moment. Please contact us if you
          would like us to integrate other tools.
        </Paragraph>
        <VerticalSpacing spacing="spacing-m" />
        <Paragraph>
          We do have integration via CSV file. This allows you to import issues
          from any issue management tool that can export to CSV.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'billing-address',
    title:
      'Can I choose a different billing email address than the account one?',
    content: (
      <>
        <Paragraph>
          {`Yes. From "user menu" > "manage account" > "billing details" you can set the email address where the invoices will be sent to.`}
        </Paragraph>
      </>
    ),
  },
];

export const FaqsTemplate = () => {
  return (
    <>
      <Navigation title="FAQs" isShowShadowOnScrolled />

      <VerticalSpacing spacing="spacing-xxl-4" />
      <VerticalSpacing spacing="spacing-xxl-4" />

      <Container size="medium" className={styles['faqs']}>
        <Header1>FAQs</Header1>
        <VerticalSpacing spacing="spacing-xxl-4" />
        <VerticalSpacing spacing="spacing-xl" />
        <ul className={styles['index']}>
          {FAQS.map(({ id, title }) => (
            <li key={id}>
              <Link to={`#${id}`}>{title}</Link>
            </li>
          ))}
        </ul>
        <VerticalSpacing spacing="spacing-xxl-4" />
        <VerticalSpacing spacing="spacing-xl" />
        {FAQS.map(({ id, title, content }) => (
          <>
            <div key={id} className={styles['faq']}>
              <div id={id} className={styles.anchor} />
              <Header4>{title}</Header4>
              <VerticalSpacing spacing="spacing-l" />
              {content}
            </div>

            <VerticalSpacing spacing="spacing-xxl-4" />
          </>
        ))}
        <VerticalSpacing spacing="spacing-xxl-4" />
        <VerticalSpacing spacing="spacing-xxl-4" />
      </Container>
      <BackToTopButton />
    </>
  );
};
