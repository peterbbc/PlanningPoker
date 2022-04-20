// Reference: https://github.com/stripe-samples/subscription-use-cases/tree/master/fixed-price-subscriptions

import React, { FormEvent } from 'react';
import {
  InputNumber,
  Paragraph,
  VerticalSpacing,
} from '@we-agile-you/react-base';

interface FacilitatorsProps {
  facilitatorsQuanitity: number | null;
  onSubmit: () => void;
  onFacilitatorsQuanitityChange: (quantity: number | null) => void;
}

export const Facilitators = ({
  facilitatorsQuanitity,
  onSubmit,
  onFacilitatorsQuanitityChange,
}: FacilitatorsProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form id="facilitators-form" onSubmit={handleSubmit}>
      <Paragraph fontWeight="bold">Adjust facilitators</Paragraph>
      <VerticalSpacing spacing="spacing-xl" />
      <Paragraph size="small">
        Facilitators are the users who can create premium games (invited players
        can always join for free).
      </Paragraph>
      <VerticalSpacing spacing="spacing-l" />
      <Paragraph size="small">
        One facilitator is usually enough for small organitzations, big ones
        might want <b>one facilitator for each scrum master</b> in the
        organitzation.
      </Paragraph>
      <VerticalSpacing spacing="spacing-xxl" />
      <InputNumber
        value={facilitatorsQuanitity}
        required
        min={1}
        onChange={(val) =>
          onFacilitatorsQuanitityChange(val ? Number(val) : null)
        }
      />
      <VerticalSpacing spacing="spacing-s" />
      <Paragraph color="grey500" size="small">
        (You can change this later)
      </Paragraph>
    </form>
  );
};
