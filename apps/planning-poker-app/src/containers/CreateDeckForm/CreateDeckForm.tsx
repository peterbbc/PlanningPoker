import {
  FormInput,
  InlineAlert,
  Paragraph,
  SubmitRow,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import { CustomDeck } from '@we-agile-you/types-planning-poker';
import React, { useCallback, useEffect, useState } from 'react';

import { CardSelector } from '../../components/organisms/CardSelector/CardSelector';
import { addCustomDeckToUser } from '../../spaces/auth/data/user';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../vendors/hotjar/identify';

interface CreateDeckFormProps {
  onCancel: () => void;
  onCreated: (deck: CustomDeck) => void;
}

const getDeckFromValue = (value: string) =>
  value.split(',').filter((value) => !!value && value.length < 4);
export const CreateDeckForm = ({
  onCancel,
  onCreated,
}: CreateDeckFormProps) => {
  const [nameInputValue, setNameInputValue] = useState('My custom deck');
  const [inputValue, setInputValue] = useState('1,2,3,5,8,13');
  const [selectedCard, setSelectedCard] = useState<string | null>('3');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useCurrentUser();

  const deck: string[] = getDeckFromValue(inputValue);

  useEffect(() => {
    hotjarIdentify(HOTJAR_IDENTIFY_KEYS.OPENED_CREATE_DECK_FORM);
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      const deck = getDeckFromValue(value);

      if (selectedCard && !deck.find((value) => value === selectedCard)) {
        setSelectedCard(null);
      }

      setInputValue(value);
    },
    [selectedCard],
  );

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = () => {
    setError(null);
    setIsLoading(true);

    if (!deck || deck.length <= 0) {
      setError('Deck must have at least one card');
      setIsLoading(false);

      return;
    }

    if (deck.length > 20) {
      setError('Deck must have less than 20 elements');
      setIsLoading(false);

      return;
    }

    if (!nameInputValue) {
      setError('Please set a name to the deck');
      setIsLoading(false);

      return;
    }

    if (!user) {
      setError('No signed user found');
      setIsLoading(false);

      return;
    }

    // Ensure the value has a nice format
    const deckValue = deck.join(', ');

    addCustomDeckToUser(user, {
      name: nameInputValue,
      value: deckValue,
    })
      .then(() => {
        setIsLoading(false);
        onCreated({
          name: nameInputValue,
          value: deckValue,
        });
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e?.message || 'An error happened saving your deck');
      });
  };

  return (
    <div>
      <FormInput
        label="Deck name"
        value={nameInputValue}
        onChange={setNameInputValue}
      />
      <FormInput
        label="Deck values"
        value={inputValue}
        onChange={handleInputChange}
        inlineHint="Enter up to 3 characters per value, separated by commas."
      />
      <VerticalSpacing spacing="spacing-l" />
      <Paragraph fontWeight="bold" color="grey600">
        Preview
      </Paragraph>
      <Paragraph color="grey600">
        This is a preview of how your deck will look like.
      </Paragraph>
      <VerticalSpacing spacing="spacing-l" />
      <CardSelector
        cards={deck}
        onChange={setSelectedCard}
        value={selectedCard}
      />
      {error && (
        <>
          <InlineAlert content={error} style="danger" />
          <VerticalSpacing spacing="spacing-xl" />
        </>
      )}
      <VerticalSpacing spacing="spacing-xl" />
      <SubmitRow
        cancelLabel="Cancel"
        confirmLabel="Save deck"
        onCancel={handleCancel}
        onConfirm={handleSubmit}
        align="strech"
        isLoading={isLoading}
      />
    </div>
  );
};
