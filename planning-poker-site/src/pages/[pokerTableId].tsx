import React from 'react';
import { Layout } from '@we-agile-you/planning-poker-app';
import { PokerTableTemplate } from '@we-agile-you/planning-poker-app';

// @ts-ignore
export default function PokerTablePage({ params }) {
  const tableId = params.pokerTableId;

  return (
    <Layout>
      <PokerTableTemplate tableId={tableId} />
    </Layout>
  );
}
