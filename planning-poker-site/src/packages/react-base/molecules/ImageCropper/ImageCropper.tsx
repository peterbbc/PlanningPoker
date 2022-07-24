import React, { useState, useEffect, useCallback } from 'react';
import Slider from '@material-ui/core/Slider';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';

import styles from './ImageCropper.module.scss';
import { FlexBox } from '../../atoms/FlexBox/FlexBox';
import { Span } from '../../atoms/text/Span/Span';
import { VerticalSpacing } from '../../atoms/spacings/VerticalSpacing/VerticalSpacing';
import { SubmitRow } from '../SubmitRow/SubmitRow';

import getCroppedImg from './cropImage';
// import { updateCurrentUserPicture } from '../../../../../apps/planning-poker-app/src/spaces/auth/data/user';

interface ImageCropperProps {
  image: File;
  onSaved: () => void;
  onCancel: () => void;
}

export const ImageCropper = ({
  image,
  onSaved,
  onCancel,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );
  const showCroppedImage = useCallback(async () => {
    setIsLoading(true);

    if (!imageDataUrl) {
      return;
    }
    try {
      const croppedImage = await getCroppedImg(imageDataUrl, croppedAreaPixels);

      if (!croppedImage) {
        return;
      }

      // await updateCurrentUserPicture(croppedImage, onSaved);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  }, [croppedAreaPixels]);

  useEffect(() => {
    readFile(image)
      .then(setImageDataUrl)
      .catch((e) => console.error('error laoding image', e?.message));
  }, [image]);

  if (!imageDataUrl) return null;

  return (
    <div>
      <div className={styles['crop-container']}>
        <Cropper
          image={imageDataUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <VerticalSpacing spacing="spacing-m" />
      <div className={styles['controls']}>
        <FlexBox justifyContent="space-between">
          <Span color="grey500">Zoom</Span>
          <Span color="grey500">{`${zoom?.toFixed(2)} %`}</Span>
        </FlexBox>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(_e, zoom) => setZoom(Number(zoom))}
          classes={{ root: styles['slider'] }}
        />
      </div>
      <VerticalSpacing spacing="spacing-xl" />
      <SubmitRow
        confirmLabel="Save"
        cancelLabel="Cancel"
        onCancel={onCancel}
        onConfirm={showCroppedImage}
        align="strech"
        isLoading={isLoading}
      />
    </div>
  );
};

function readFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => resolve(reader.result as string | null),
      false,
    );
    reader.readAsDataURL(file);
  });
}
