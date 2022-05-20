import React from 'react';
import { Layout } from '../planning-poker-app';
import { PokerTableTemplate } from '../planning-poker-app';

// @ts-ignore
export default function PokerTablePage({ params }) {
  const tableId = params.pokerTableId;

  return (
    <Layout>
      <PokerTableTemplate tableId={tableId} />
    </Layout>
  );
}
