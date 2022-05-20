import {
  getHumanMoneyFromStripeMoney,
  getMonthWithDayInLocalTime,
} from '../../../packages/js-base';
import {
  FlexBox,
  Modal,
  ModalTitle,
  VerticalSpacing,
} from '../../../packages/react-base';
import React, { useEffect, useState } from 'react';
import { Loader } from '../../components/molecules/Loader/Loader';
import { getCurrentUserInvoices } from '../../spaces/premium/data/getCurrentUserInvoices';
import { List } from './List/List';

import styles from './MyInvoicesModal.module.scss';

interface MyInvoicesModalProps {
  onClose: () => void;
}

type Invoice = {
  created: number;
  hosted_invoice_url: string;
  total: number;
};

export const MyInvoicesModal = ({ onClose }: MyInvoicesModalProps) => {
  const [invoices, setInovices] = useState<Invoice[] | null>(null);

  useEffect(() => {
    getCurrentUserInvoices().then((invoices) => setInovices(invoices));
  }, []);

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Invoices</ModalTitle>
      <div>
        {invoices === null ? (
          <div>
            <VerticalSpacing spacing="spacing-m" />
            <FlexBox alignItems="center" justifyContent="center">
              <Loader message="Loading invoices..." />
            </FlexBox>
            <VerticalSpacing spacing="spacing-xxl" />
          </div>
        ) : invoices && invoices.length > 0 ? (
          <List
            elements={invoices.map((invoice) => ({
              name: getMonthWithDayInLocalTime(
                new Date(invoice.created * 1000),
              ),
              to: invoice.hosted_invoice_url,
              isExternalLink: true,
              meta: getHumanMoneyFromStripeMoney(invoice.total),
            }))}
          />
        ) : (
          <div className={styles['empty-message']}>
            You still haven´t created any game, when you do it will appear here.
          </div>
        )}
      </div>
    </Modal>
  );
};
