import { Button, ButtonLink } from '../../../../packages/react-base';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { throttle } from 'lodash';
import { Link } from '../../atoms/Link/Link';
import { LogoWay } from '../../atoms/LogoWay/LogoWay';

import { AuthButton } from '../../../containers/AuthButton/AuthButton';
import styles from './Header.module.scss';
import { LogoIcon } from '../../atoms/LogoIcon/LogoIcon';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { BurgerButtonDropdown } from '../../molecules/BurgerButtonDropdown/BurgerButtonDropdown';

interface HeaderProps {
  title?: React.ReactNode;
  isHome?: boolean;
  isMinimal?: boolean;
  isShowShadowOnScrolled?: boolean;
}

export const Header = ({
  title,
  isHome,
  isMinimal,
  isShowShadowOnScrolled,
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBurgerMenu, setIsBurgerMenu] = useState(false);
  const { isAnonymous, user } = useCurrentUser();

  const setIsOpenPricingModal = useAppContext().pricingModal[1];

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      setIsScrolled(
        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20,
      );
    }, 50);

    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  useEffect(() => {
    const handleWindowResize = throttle(() => {
      setIsBurgerMenu(document.body.clientWidth < 920);
    }, 50);

    handleWindowResize();

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const className = cx(styles['header'], {
    [styles['header--home']]: isHome,
    [styles['header--minimal']]: isMinimal,
    [styles['header--shadow-on-scroll']]: isShowShadowOnScrolled,
    [styles['header--scrolled']]: isScrolled,
  });

  const handleHeaderClick = () => {
    if (isShowShadowOnScrolled) {
      window.scroll({ top: 0 });
    }
  };

  const isShowingAuthDropdown = !isAnonymous || user?.displayName;

  return (
    <>
      <header className={className}>
        <div className={styles['left']}>
          {isHome ? (
            <Link
              to="/"
              className={styles['logo-way-link']}
              title="Planning Poker Online"
              onClick={() => window.scroll({ top: 0 })}
            >
              <LogoWay />
            </Link>
          ) : (
            <>
              <Link to="/" className={styles['logo-link']}>
                <LogoIcon color="primary" className={styles['logo-icon']} />
              </Link>
              <h1
                className={cx(
                  styles.title,
                  'notranslate',
                  isShowShadowOnScrolled && styles['title--anchor'],
                )}
                translate="no"
                onClick={handleHeaderClick}
              >
                {title || 'Planning Poker Online'}{' '}
              </h1>
            </>
          )}
        </div>
        <div className={styles['right']}>
          {isHome && (
            <div
              className={cx(
                styles['cta-pricing'],
                isShowingAuthDropdown &&
                  styles['cta-pricing--next-to-dropdown'],
              )}
            >
              <ButtonLink onClick={() => setIsOpenPricingModal(true)}>
                Pricing
              </ButtonLink>
            </div>
          )}
          {!isMinimal && (
            <>
              <div className={styles['auth-button']}>
                <AuthButton buttonColor="primary" />
              </div>
              {isBurgerMenu && (
                <div className={styles['burger-button']}>
                  <BurgerButtonDropdown />
                </div>
              )}
            </>
          )}
          {isHome && (
            <Link to="/new-game" className={styles['cta']}>
              <Button>Start new game</Button>
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
