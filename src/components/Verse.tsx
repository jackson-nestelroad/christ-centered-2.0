import React, { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchVerse } from '../store/slices/verse';
import { startOfDay } from '../util/time';
import ShowAppError from './ShowAppError';
import './Verse.scss';

function Verse() {
  const ref = useRef<HTMLDivElement>(null);

  const { config, lastFetchedAt, status, error, verse } = useAppSelector(state => state.verse);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if ((!config.search && lastFetchedAt !== startOfDay()) || status !== 'fulfilled' || error) {
      dispatch(fetchVerse());
    }
  }, []);

  if (status === 'rejected') {
    return <ShowAppError error={error!} />;
  }
  if (status === 'idle' || status === 'loading' || !verse) {
    return null;
  }

  let maxHeight = '100%';
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const parentRect = ref.current.parentElement!.getBoundingClientRect();

    if (rect.bottom > parentRect.bottom) {
      maxHeight = `${parentRect.height}px`;
    }
  }

  document.title = verse.reference;

  return (
    <>
      <div className="verse-container fade-in">
        <div className="verse" ref={ref} style={{ maxHeight }}>
          <p className="text">{verse.text}</p>
        </div>
      </div>
      <div className="reference-container fade-in">
        <p className="reference">
          <a href={verse.url}>{verse.reference}</a>
        </p>
      </div>
    </>
  );
}

export default Verse;
