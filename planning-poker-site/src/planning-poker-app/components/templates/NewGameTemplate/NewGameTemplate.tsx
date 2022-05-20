import {
  Container,
  Grid,
  Paragraph,
  useLocation,
  VerticalSpacing,
  FlexBox,
} from '../../../../packages/react-base';
import { CustomDeck } from '../../../../packages/types-planning-poker';
import { navigate } from '@reach/router';
import React, { useRef, useState } from 'react';
import { CreateDeckModal } from '../../../containers/CreateDeckModal/CreateDeckModal';
import SettingsForm from '../../../containers/poker/SettingsForm/SettingsForm';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { Loader } from '../../molecules/Loader/Loader';
import { Navigation } from '../../organisms/Navigation/Navigation';

export const NewGameTemplate = () => {
  const location = useLocation();
  const { user } = useCurrentUser();
  const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false);
  const settingsFormRef = useRef<{
    setSelectedDeck: (deck: CustomDeck) => void;
  }>({
    setSelectedDeck: () => ({}),
  });

  const onCreated = (pokerTableId: string) => {
    navigate(`/${pokerTableId}`, { state: { from: location } });
  };

  const title = 'Create game';

  const handleDeckCreated = (deck: CustomDeck) => {
    setIsCreateDeckModalOpen(false);
    settingsFormRef.current.setSelectedDeck(deck);
  };

  return (
    <>
      <Navigation title={title} isMinimal />

      <Container isCenteredInPage>
        {!!user ? (
          <Grid container justify="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <VerticalSpacing spacing="spacing-xxl-4" />
              <VerticalSpacing spacing="spacing-l" />
              <Paragraph align="center">
                Choose a name and a voting system for your game.
              </Paragraph>
              <VerticalSpacing spacing="spacing-xl" />
              <SettingsForm
                ref={settingsFormRef}
                isCreateForm
                onCreated={onCreated}
                onSelectCustomDeck={() => setIsCreateDeckModalOpen(true)}
              />
            </Grid>
          </Grid>
        ) : (
          <FlexBox justifyContent="center">
            <Loader message="Just a second..." />
          </FlexBox>
        )}
      </Container>
      {isCreateDeckModalOpen && (
        <CreateDeckModal
          onCreated={handleDeckCreated}
          onClose={() => setIsCreateDeckModalOpen(false)}
        />
      )}
    </>
  );
};
