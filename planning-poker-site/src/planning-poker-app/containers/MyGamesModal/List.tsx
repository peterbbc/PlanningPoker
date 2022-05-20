import {
  ButtonIcon,
  FlexBox,
  HoritzontalSpacing,
  Icon,
  Paragraph,
  VerticalSpacing,
} from '../../../packages/react-base';
import React from 'react';
import { Link } from '../../components/atoms/Link/Link';

import styles from './List.module.scss';

export type ListElement = {
  id: string;
  name: string;
  to: string;
  meta: string;
  onDelete?: (game: ListElement) => void;
};

interface ListProps {
  onLinkClick?: () => void;
  elements: ListElement[];
}

export const List: React.FC<ListProps> = ({ onLinkClick, elements }) => {
  return (
    <ul className={styles.list}>
      {elements.map((element) => (
        <li className={styles.element} key={element.id}>
          <div>
            <Paragraph fontWeight="bold">{element.name}</Paragraph>
            <VerticalSpacing spacing="spacing-xs" />
            <Paragraph color="grey500">{element.meta}</Paragraph>
          </div>
          <div>
            <FlexBox alignItems="center">
              {!!element.onDelete && (
                <>
                  <ButtonIcon
                    onClick={() =>
                      element.onDelete && element.onDelete(element)
                    }
                    icon={<Icon icon="trash" />}
                  />
                  <HoritzontalSpacing spacing="spacing-l" />
                </>
              )}
              <Link to={element.to} onClick={onLinkClick}>
                Go to game
              </Link>
            </FlexBox>
          </div>
        </li>
      ))}
    </ul>
  );
};
