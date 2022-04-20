import React from 'react';
import { Link } from '../../../components/atoms/Link/Link';

import styles from './List.module.scss';

type ListElement = {
  name: React.ReactNode;
  to: string;
  meta: React.ReactNode;
  isExternalLink?: boolean;
};

interface ListProps {
  onLinkClick?: () => void;
  elements: ListElement[];
}

export const List: React.FC<ListProps> = ({ onLinkClick, elements }) => {
  return (
    <ul className={styles.list}>
      {elements.map((element) => (
        <li className={styles.element} key={element.to}>
          {element.isExternalLink ? (
            <a
              href={element.to}
              className={styles.link}
              onClick={onLinkClick}
              target="_blank"
              rel="noopener noreferrer"
            >
              {element.name}
            </a>
          ) : (
            <Link to={element.to} onClick={onLinkClick}>
              {element.name}
            </Link>
          )}

          <span className={styles.meta}>{element.meta}</span>
        </li>
      ))}
    </ul>
  );
};
