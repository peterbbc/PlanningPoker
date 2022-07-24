import {
  FormTextarea,
  SubmitRow,
  VerticalSpacing,
} from '../../../../packages/react-base';
import React, { FormEvent, useState } from 'react';
import { useIssueActions } from '../../../spaces/poker-table/hooks/useIssueActions';

import styles from './AddBatchOfUrls.module.scss';

interface AddIssueFormProps {
  onAdded: () => void;
  onCancel: () => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}
export const AddBatchOfUrls = ({
  onAdded,
  onCancel,
  textareaRef,
}: AddIssueFormProps) => {
  const [urls, setUrls] = useState<string>('');
  const [issueList, setIssueList] = useState<null | string[]>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { addFromUrlBatch } = useIssueActions();

  const handleUrlsChange = (urls: string) => {
    setUrls(urls);

    setIssueList(urls.split('\n').filter((url) => !!url && validURL(url)));
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!urls || !issueList?.length) {
      alert('Please add urls');

      return;
    }

    setIsAdding(true);

    addFromUrlBatch(issueList).then(() => {
      onAdded();
      setIsAdding(false);
    });
  };
  return (
    <div className={styles.container}>
      <p>Paste your issues´ urls in the box below to add them into the game.</p>
      <p>Each valid url will create a new ticket.</p>
      <p>Please paste each url in a new line.</p>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <FormTextarea
          ref={textareaRef}
          value={urls}
          label="Issues' urls"
          onChange={handleUrlsChange}
        />
        <VerticalSpacing spacing="spacing-m" />
        <SubmitRow
          cancelLabel="Cancel"
          confirmLabel={`Add ${issueList?.length || 0} issue(s)`}
          onCancel={onCancel}
          isLoading={isAdding}
          isDisabled={!issueList?.length}
          align="right"
        />
      </form>
    </div>
  );
};

function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}
