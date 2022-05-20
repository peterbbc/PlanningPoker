import React from 'react';

import disconected from './disconected.svg';
import happyCable from './happy-cable.svg';
import happyRobot from './happy-robot.svg';
import notFound from './404.svg';

interface RobotImageProps {
  className?: string;
  alt?: string;
  image: 'disconected' | 'happy-cable' | 'happy-robot' | '404';
}

const srcs = {
  disconected,
  'happy-cable': happyCable,
  'happy-robot': happyRobot,
  '404': notFound,
};

export const RobotImage = ({ image, className, alt }: RobotImageProps) => {
  return <img className={className} alt={alt || image} src={srcs[image]} />;
};
