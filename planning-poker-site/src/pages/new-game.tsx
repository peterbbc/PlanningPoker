import React from 'react';
import { Helmet } from 'react-helmet';
import { NewGameTemplate } from '@we-agile-you/planning-poker-app';
import { Layout } from '@we-agile-you/planning-poker-app';

export default function NewGame() {
  return (
    <Layout>
      <Helmet title="Create game" />
      <NewGameTemplate />
    </Layout>
  );
}
