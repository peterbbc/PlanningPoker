import {
  Button,
  FormGroup,
  FormInput,
  FormTextarea,
  Modal,
  ModalTitle,
} from '../../../packages/react-base';
import React, { FormEvent, useState } from 'react';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { createContactMessage } from '../../spaces/contact/data';
import { useNotification } from '../../spaces/notifications/useNotification';

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal = ({ onClose }: ContactModalProps) => {
  const { email: userEmail } = useCurrentUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    if (!message) {
      alert('please write a message');

      return;
    }

    setIsLoading(true);

    createContactMessage({
      name,
      email,
      message,
    })
      .then(() => {
        showNotification({
          title: 'Thank you for contacting us',
          content:
            'We have received your message, we will contact you as soon as possible.',
        });
        onClose();
      })
      .catch(() => setIsLoading(false));
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Contact us / feedback</ModalTitle>
      <form onSubmit={handleFormSubmit}>
        <FormInput
          label="Your name (optional)"
          id="name"
          value={name}
          onChange={(value) => setName(value)}
        />
        <FormInput
          label="Your email (optional)"
          id="name"
          value={email}
          type="email"
          onChange={(value) => setEmail(value)}
        />
        <FormTextarea
          label="Message ✍️"
          id="message"
          value={message}
          onChange={(value) => setMessage(value)}
        />
        <FormGroup isSubmit>
          <Button isBlock buttonType="submit" isLoading={isLoading}>
            Send message
          </Button>
        </FormGroup>
      </form>
    </Modal>
  );
};
