import React from 'react';
import { Helmet } from 'react-helmet';
import { HomeTemplate } from '@we-agile-you/planning-poker-app';
import { Layout } from '@we-agile-you/planning-poker-app';

export default function Home() {
  return (
    <Layout>
      <Helmet title="Scrum poker | We Agile You" />
      <HomeTemplate />
    </Layout>
  );
}
