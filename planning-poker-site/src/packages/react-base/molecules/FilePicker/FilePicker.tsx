import React from 'react';
import { useDropzone } from 'react-dropzone';
import { ButtonLink } from '../../atoms/ButtonLink/ButtonLink';
import { FlexBox } from '../../atoms/FlexBox/FlexBox';
import { VerticalSpacing } from '../../atoms/spacings/VerticalSpacing/VerticalSpacing';
import { Paragraph } from '../../atoms/text/Paragraph/Paragraph';

import styles from './FilePicker.module.scss';

interface FilePickerProps {
  onDrop: (acceptedFiles: File[]) => void;
}

export const FilePicker = ({ onDrop }: FilePickerProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className={styles['dropzone']}>
      <input {...getInputProps()} />
      <div>
        <FlexBox justifyContent="center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4C10.8954 4 10 4.89543 10 6V40C10 41.1046 10.8954 42 12 42H22C23.1046 42 24 42.8954 24 44C24 45.1046 23.1046 46 22 46H12C8.68629 46 6 43.3137 6 40V6C6 2.68629 8.68629 0 12 0H26C26.5304 0 27.0391 0.210714 27.4142 0.585786L41.4142 14.5858C41.7893 14.9609 42 15.4696 42 16V24C42 25.1046 41.1046 26 40 26C38.8954 26 38 25.1046 38 24V18H30C26.6863 18 24 15.3137 24 12V4H12ZM28 6.82843L35.1716 14H30C28.8954 14 28 13.1046 28 12V6.82843ZM29.4145 36.4142L31 34.8288V44C31 45.1046 31.8954 46 33 46C34.1046 46 35 45.1046 35 44V34.8281L36.5861 36.4142C37.3672 37.1953 38.6335 37.1953 39.4145 36.4142C40.1956 35.6332 40.1956 34.3668 39.4145 33.5858L34.4145 28.5858C34.0395 28.2107 33.5308 28 33.0003 28C32.4699 28 31.9612 28.2107 31.5861 28.5858L26.5861 33.5858C25.8051 34.3669 25.8051 35.6332 26.5861 36.4142C27.3672 37.1953 28.6335 37.1953 29.4145 36.4142Z"
              fill="#D1D4D7"
            />
          </svg>
        </FlexBox>
        <VerticalSpacing spacing="spacing-m" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <Paragraph fontWeight="bold">
            Drag 'n' drop some files here, or{' '}
            <ButtonLink>choose file</ButtonLink>
          </Paragraph>
        )}
      </div>
    </div>
  );
};
