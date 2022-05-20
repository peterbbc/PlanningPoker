import {
  Button,
  ButtonLink,
  FormGroup,
  FormInput,
  FormSelect,
  InlineAlert,
  Paragraph,
  SelectValue,
  Span,
  VerticalSpacing,
} from '../../../../packages/react-base';
import {
  CustomDeck,
  PokerTable,
  WhoCanEditIssuesType,
  WhoCanShowCardsType,
} from '../../../../packages/types-planning-poker';
import React, {
  FormEvent,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { createPokerTable } from '../../../spaces/poker-table/actions/creation';
import { changeSettings } from '../../../spaces/poker-table/actions/settings';
import { DEFAULT_CARD_LIST } from '../../../spaces/poker-table/constants';
import { AppState } from "../../../spaces/rootReducer";

import { SelectFacilitator } from './SelectFacilitator';
import { SelectWhoCanEditIssues } from './SelectWhoCanEditIssues';
import { SelectWhoCanShowCards } from './SelectWhoCanShowCards';
import styles from './SettingsForm.module.scss';

const CUSTOM_DECK = 'CUSTOM_DECK';

interface SettingsProps {
  isCreateForm?: boolean;
  onCreated?: (pokerTableId: string) => void;
  onSelectCustomDeck: () => void;
  onManageDecksClick?: () => void;
  onUpdated?: () => void;
}

interface DeckOption {
  label: ReactNode;
  value: string;
}

const SettingsForm = forwardRef(function SettingsForm(
  {
    onCreated,
    onSelectCustomDeck,
    onManageDecksClick,
    onUpdated,
    isCreateForm,
  }: SettingsProps,
  ref,
) {
  const dispatch = useDispatch();
  const pokerTable: PokerTable = useSelector(
    (state: AppState) => state.pokerTable,
  );
  const [selectedDeck, setSelectedDeck] =
    useState<SelectValue<DeckOption>>(null);
  const [name, setName] = useState<string>(pokerTable.name || '');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facilitator, setFacilitator] = useState<string | null>(null);

  const textInput = useRef<HTMLInputElement | null>(null);

  const [whoCanShowCards, setWhoCanShowCards] = useState(
    pokerTable.whoCanShowCards || null,
  );

  const [whoCanEditIssues, setWhoCanEditIssues] = useState(
    pokerTable.whoCanEditIssues || null,
  );
  const user = useCurrentUser();

  const customDecks = useMemo(
    () =>
      user.user?.customDecks
        ? user.user?.customDecks.map((deck) => ({
            label: `${deck.name} (${deck.value})`,
            value: deck.value,
          }))
        : [],
    [user.user?.customDecks],
  );

  const deckOptions: DeckOption[] = useMemo(
    () => [
      {
        label: 'Fibonacci ( 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ? )',
        value: '0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?',
      },
      {
        label: 'Modified Fibonacci ( 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, ? )',
        value: '0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?',
      },
      {
        label: 'T-shirts (xxs, xs, s, m, l, xl, xxl, ?)',
        value: 'XXS, XS, S, M, L, XL, XXL, ?',
      },
      {
        label: 'Powers of 2 ( 0, 1, 2, 4, 8, 16, 32, 64, ? )',
        value: '0, 1, 2, 4, 8, 16, 32, 64, ?',
      },
      ...customDecks,
      {
        label: (
          <Span spanStyle="bold" color="primary">
            Create custom deck...
          </Span>
        ),
        value: CUSTOM_DECK,
      },
    ],
    [customDecks],
  );

  useEffect(() => {
    if (textInput && textInput.current && isCreateForm) {
      textInput.current.focus();
    }
  }, [isCreateForm]);

  useImperativeHandle(ref, () => ({
    setSelectedDeck: (deck: CustomDeck) => {
      const selectedOption = deckOptions.find(
        (option) =>
          deck.value.replace(/\s/g, '') === option.value.replace(/\s/g, ''),
      );
      setSelectedDeck(selectedOption);
    },
  }));

  useEffect(() => {
    if (isCreateForm) {
      setSelectedDeck(deckOptions[0]);
      return;
    }
  }, [isCreateForm]);

  useEffect(() => {
    if (isCreateForm) {
      return;
    }

    const selectedOption =
      (pokerTable &&
        deckOptions.find(
          (option) =>
            pokerTable.deck.join(',').replace(/\s/g, '') ===
            option.value.replace(/\s/g, ''),
        )) ||
      deckOptions[0];

    setSelectedDeck(selectedOption);

    const name = pokerTable.name;

    if (name) {
      setName(name);
    }
  }, [pokerTable, isCreateForm]);

  const handleDeckChange = (selectedOption: SelectValue<DeckOption>) => {
    const selectedOptionO =
      Array.isArray(selectedOption) && selectedOption.length > 0
        ? selectedOption[0]
        : selectedOption;

    const value = selectedOptionO && selectedOptionO.value;

    if (value === CUSTOM_DECK) {
      onSelectCustomDeck();

      return;
    }

    setSelectedDeck(selectedOption);
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleWhoCanShowCardsChange = (value: WhoCanShowCardsType) => {
    setWhoCanShowCards(value);
  };

  const handleWhoCanEditIssuesChange = (value: WhoCanEditIssuesType) => {
    setWhoCanEditIssues(value);
  };

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    setIsLoading(true);

    if (!user.user) {
      setIsLoading(false);
      setError(new Error('No valid user is loged in.'));

      return;
    }

    const selectedOption =
      Array.isArray(selectedDeck) && selectedDeck.length > 0
        ? selectedDeck[0]
        : selectedDeck;

    const deck = selectedOption
      ? selectedOption.value
          .split(',')
          .map((card: string) =>
            typeof card === 'string' ? card.trim() : card,
          )
      : DEFAULT_CARD_LIST;

    if (isCreateForm) {
      createPokerTable(
        {
          name,
          deck,
          whoCanShowCards: null,
          whoCanEditIssues: null,
        },
        user.user,
        dispatch,
      )
        .then((pokerTableId) => {
          if (onCreated) {
            setIsLoading(false);
            onCreated(pokerTableId);
          }
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          setError(
            error.message
              ? error
              : { message: 'Unexpected error happened when creating game.' },
          );
        });
    } else if (pokerTable && pokerTable.id && pokerTable.ownerId) {
      changeSettings(pokerTable.id, {
        name,
        deck,
        whoCanShowCards,
        whoCanEditIssues,
        ownerId: facilitator || pokerTable.ownerId,
      }).then(() => {
        if (onUpdated) {
          setIsLoading(false);
          onUpdated();
        }
      });
    }
  }

  const submitLabel = isCreateForm ? 'Create game' : 'Update game settings';

  const showManageDecks = !isCreateForm && !!customDecks?.length;

  return (
    <div className={styles['settings']}>
      <form onSubmit={handleFormSubmit}>
        {!isCreateForm && pokerTable.ownerId && (
          <SelectFacilitator
            playersAll={pokerTable.playersAll}
            onChange={(uid) => setFacilitator(uid)}
            value={pokerTable.ownerId}
          />
        )}
        <FormInput
          label="Game's name"
          value={name}
          onChange={handleNameChange}
          maxLength={60}
          ref={textInput}
        />
        <FormSelect
          label="Voting system"
          // eslint-disable-next-line
          // @ts-ignore
          options={deckOptions}
          onChange={handleDeckChange}
          value={selectedDeck}
          id="deck"
          isSearchable={false}
          menuPortalTarget={document.body}
          isNoMargin={showManageDecks}
        />
        {showManageDecks && (
          <>
            <VerticalSpacing spacing="spacing-xs" />
            <Paragraph align="right">
              <ButtonLink onClick={onManageDecksClick}>
                Manage custom decks
              </ButtonLink>
            </Paragraph>
            <VerticalSpacing spacing="spacing-l" />
          </>
        )}
        {!isCreateForm && (
          <SelectWhoCanShowCards onChange={handleWhoCanShowCardsChange} />
        )}
        {!isCreateForm && (
          <SelectWhoCanEditIssues onChange={handleWhoCanEditIssuesChange} />
        )}
        {error?.message && (
          <InlineAlert
            title={error.message}
            content="Please sign out, sign in and try again."
          />
        )}
        <FormGroup isSubmit>
          <Button buttonType="submit" isLoading={isLoading} isBlock>
            {submitLabel}
          </Button>
        </FormGroup>
      </form>
    </div>
  );
});

export default SettingsForm;
