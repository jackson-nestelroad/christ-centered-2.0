import React, { useEffect, useState } from 'react';

import { BackgroundImage, BackgroundImages } from '../data/backgrounds';
import { ReactHooks } from '../hooks';
import { useAppSelector } from '../store/hooks';
import './Background.scss';

interface BackgroundProps {
  children?: React.ReactNode;
}

interface BackgroundState {
  image: BackgroundImage;
  loaded: boolean;
}

type BackgroundHooks = ReactHooks<BackgroundState, 'setState'>;

function randomImage(): BackgroundImage {
  return BackgroundImages[Math.floor(Math.random() * BackgroundImages.length)];
}

function imageURL(image: BackgroundImage): string {
  return `images/backgrounds/${image.file}`;
}

async function fetchImage({ state, setState }: BackgroundHooks) {
  await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject();
    image.src = imageURL(state.image);
  });
  setState({ ...state, loaded: true });
}

function Background({ children }: BackgroundProps) {
  const background = useAppSelector(state => state.settings.background);
  const [state, setState] = useState<BackgroundState>({
    image:
      background !== undefined && background !== null && background >= 0 && background < BackgroundImages.length
        ? BackgroundImages[background]
        : randomImage(),
    loaded: false,
  });

  const hooks: BackgroundHooks = { state, setState };

  useEffect(() => {
    fetchImage(hooks);
  }, []);

  return (
    <div
      className={['background', state.loaded ? 'loaded' : 'unloaded'].join(' ')}
      style={{
        backgroundImage: state.loaded
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
      <div className="source">
        <a href={state.image.url}>{state.image.credit}</a>
      </div>
    </div>
  );
}

Background.defaultProps = {
  children: undefined,
};

export default Background;
