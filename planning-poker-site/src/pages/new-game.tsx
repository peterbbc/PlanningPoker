import React from 'react';
import { Helmet } from 'react-helmet';
import { NewGameTemplate } from '../planning-poker-app';
import { Layout } from '../planning-poker-app';

export default function NewGame() {
  return (
    <Layout>
      <Helmet title="Create game" />
      <NewGameTemplate />
    </Layout>
  );
}
