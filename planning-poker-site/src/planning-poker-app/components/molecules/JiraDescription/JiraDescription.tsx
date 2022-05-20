import './JiraDescription.scss';

import React from 'react';

interface JiraDescriptionProps {
  description: string;
}

export const JiraDescription = ({ description }: JiraDescriptionProps) => {
  return (
    <div
      className="jira-description"
      dangerouslySetInnerHTML={{ __html: `${description}` }}
    />
  );
};
