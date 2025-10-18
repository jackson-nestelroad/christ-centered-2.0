import React, { useEffect, useState } from 'react';

import { BackgroundImage, BackgroundImages } from '../data/backgrounds';
import { ReactHooks } from '../hooks';
import { fetchImage } from '../lib/background';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearBackground } from '../store/slices/settings';
import './Background.scss';

interface BackgroundProps {
  children?: React.ReactNode;
}

type Image = BackgroundImage | string;

interface BackgroundState {
  image?: Image;
}

type BackgroundHooks = ReactHooks<BackgroundState, 'dispatch' | 'setState'>;

function randomImage(): BackgroundImage {
  return BackgroundImages[Math.floor(Math.random() * BackgroundImages.length)];
}

function backgroundImageURL(image: BackgroundImage): string {
  return `images/backgrounds/${image.file}`;
}

function imageURL(image: Image): string {
  return typeof image === 'string' ? image : backgroundImageURL(image);
}

function needImageUpdate(a: Image, b: Image): boolean {
  return imageURL(a) !== imageURL(b);
}

async function loadImage({ state, setState, dispatch }: BackgroundHooks, image: Image) {
  try {
    await fetchImage(imageURL(image));
    setState({ ...state, image });
  } catch {
    dispatch(clearBackground(undefined));
  }
}

function currentImage(background?: string | number): Image {
  if (typeof background === 'string') {
    return background;
  }
  if (typeof background === 'number' && background >= 0 && background < BackgroundImages.length) {
    return BackgroundImages[background];
  }
  return randomImage();
}

function Background({ children }: BackgroundProps) {
  const { background } = useAppSelector(state => state.settings);

  const [state, setState] = useState<BackgroundState>({
    image: undefined,
  });

  const dispatch = useAppDispatch();
  const hooks: BackgroundHooks = { state, setState, dispatch };

  useEffect(() => {
    const image = currentImage(background);
    if (!state.image || needImageUpdate(image, state.image)) {
      loadImage(hooks, image);
    }
  }, [background]);

  return (
    <div
      className={['background', state.image ? 'loaded' : 'unloaded'].join(' ')}
      style={{
        backgroundImage: state.image
          ? `linear-gradient(${[
              'to bottom',
              'rgba(0,0,0,0.1) 0%',
              'rgba(0,0,0,0.7) 40%',
              'rgba(0,0,0,0.75) 50%',
              'rgba(0,0,0,0.7) 60%',
              'rgba(0,0,0,0.1) 100%',
            ].join(', ')}),url(${imageURL(state.image)})`
          : undefined,
      }}
    >
      {children}
      {state.image && typeof state.image !== 'string' ? (
        <div className="source">
          <a href={state.image.url}>{state.image.credit}</a>
        </div>
      ) : undefined}
    </div>
  );
}

Background.defaultProps = {
  children: undefined,
};

export default Background;
