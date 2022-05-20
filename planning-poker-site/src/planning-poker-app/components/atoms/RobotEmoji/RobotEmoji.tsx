import React from 'react';

import styles from './RobotEmoji.module.scss';

import robotConfused from './robot-confused.svg';
import robotHappy from './robot-happy.svg';
import robotNeutral from './robot-neutral.svg';
import robotParty from './robot-party.svg';
import robotSuperHappy from './robot-super-happy.svg';

interface RobotEmojiProps {
  robot: 'party' | 'super-happy' | 'happy' | 'neutral' | 'confused';
}

const ROBOTS = {
  party: robotParty,
  'super-happy': robotSuperHappy,
  happy: robotHappy,
  neutral: robotNeutral,
  confused: robotConfused,
};

export const RobotEmoji = ({ robot }: RobotEmojiProps) => {
  return (
    <img
      className={styles['robot-emoji']}
      src={ROBOTS[robot]}
      alt={`robot ${robot}`}
    />
  );
};
