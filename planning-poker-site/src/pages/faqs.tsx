import React from 'react';
import { Helmet } from 'react-helmet';
import { Layout } from '@we-agile-you/planning-poker-app';
import { FaqsTemplate } from '@we-agile-you/planning-poker-app';

export default function Faqs() {
  return (
    <Layout>
      <Helmet title="Scrum poker | We Agile You" />
      <FaqsTemplate />
    </Layout>
  );
}
