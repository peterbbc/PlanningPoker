import { ButtonLink, Paragraph } from '../../../packages/react-base';
import React from 'react';
import { removeDeckFromUser } from '../../spaces/auth/data/user';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';

import styles from './ManageDecksForm.module.scss';

export const ManageDecksForm = () => {
  const { user } = useCurrentUser();

  return (
    <ul className={styles.decks}>
      {user?.customDecks?.length ? (
        user?.customDecks.map((deck, i) => (
          <li key={i}>
            <div>{`${deck.name} (${deck.value})`}</div>
            <div className={styles.deleteButton}>
              <ButtonLink
                buttonColor="danger"
                onClick={() => removeDeckFromUser(user, i)}
              >
                Delete deck
              </ButtonLink>
            </div>
          </li>
        ))
      ) : (
        <Paragraph color="grey500">
          {"You don't have any custom deck defined"}
        </Paragraph>
      )}
    </ul>
  );
};
