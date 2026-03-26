import { formatPassageReference, parsePassageReferences } from 'daily-bread/build/src/reference';
import React, { useEffect, useRef, useState } from 'react';

import { ReactHooks } from '../hooks';
import { fetchVerseForSearch } from '../lib/verse';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { DailyBreadConfig, fetchVerse } from '../store/slices/verse';
import { BibleVerse, VerseConfig } from '../types/bible-verse';
import { AppError, CreateAppError } from '../util/error';
import { startOfDay } from '../util/time';
import ShowAppError from './ShowAppError';
import './Verse.scss';

interface VerseDisplayState {
  fullChapter: boolean;
  chapter?: BibleVerse;
  error?: AppError;
}

type VerseHooks = ReactHooks<VerseDisplayState, 'setState'>;

function toggleFullChapter({ state, setState }: VerseHooks) {
  setState({ ...state, fullChapter: !state.fullChapter });
}

async function fetchFullChapterInternal(
  config: VerseConfig,
  dailyBreadConfig: DailyBreadConfig,
  verse: BibleVerse | undefined,
): Promise<BibleVerse> {
  if (!verse) {
    throw new Error('No verse is available for reading full chapter');
  }
  const references = parsePassageReferences(verse.reference);
  if (references.length !== 1) {
    throw new Error('Verse of the day did not produce one Bible reference');
  }
  const reference = references[0];
  if (reference.from) {
    delete reference.from.verse;
  }
  delete reference.to;
  return await fetchVerseForSearch(config, dailyBreadConfig, formatPassageReference(reference));
}

function fetchFullChapter(
  { state, setState }: VerseHooks,
  config: VerseConfig,
  dailyBreadConfig: DailyBreadConfig,
  verse: BibleVerse | undefined,
) {
  fetchFullChapterInternal(config, dailyBreadConfig, verse)
    .then(chapter => {
      setState({ ...state, chapter });
    })
    .catch(error => {
      setState({ ...state, error: CreateAppError(error) });
    });
}

const initialState: VerseDisplayState = { fullChapter: false, chapter: undefined, error: undefined };

function Verse() {
  const [state, setState] = useState<VerseDisplayState>(initialState);
  const hooks = { state, setState };

  const ref = useRef<HTMLDivElement>(null);

  const { config, dailyBreadConfig, lastFetchedAt, status, error, verse } = useAppSelector(state => state.verse);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Need new Verse of the Day.
    if ((!config.search && lastFetchedAt !== startOfDay()) || status !== 'fulfilled' || error) {
      if (status === 'loading') {
        return;
      }
      dispatch(fetchVerse());
      setState(initialState);
      return;
    }

    // User put in a custom search while in full chapter mode, reset the state.
    if (config.search && state.fullChapter) {
      setState(initialState);
      return;
    }

    // User requests to read the full chapter, look it up.
    if (state.fullChapter && !state.chapter) {
      fetchFullChapter(hooks, config, dailyBreadConfig, verse);
      return;
    }
  }, [state, config, status, error, verse]);

  // Verse state error.
  if (status === 'rejected') {
    return <ShowAppError error={error!} />;
  }
  if (status === 'idle' || status === 'loading' || !verse) {
    return null;
  }

  // Local error (when attempting to read full chapter).
  if (state.error) {
    return <ShowAppError error={state.error} />;
  }

  // Resize container for the verse.
  let maxHeight = '100%';
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const parentRect = ref.current.parentElement!.getBoundingClientRect();

    if (rect.bottom > parentRect.bottom) {
      maxHeight = `${parentRect.height}px`;
    }
  }

  const displayVerse = (state.fullChapter ? state.chapter : null) ?? verse;
  const canReadFullChapter = !config.search;

  document.title = displayVerse.reference;

  return (
    <>
      <div className="verse-container fade-in">
        <div className="verse" ref={ref} style={{ maxHeight }}>
          <p className="text">{displayVerse.text}</p>
        </div>
      </div>
      <div className="reference-container fade-in">
        <p className="reference">
          <a href={displayVerse.url}>{displayVerse.reference}</a>
        </p>
        {!canReadFullChapter ? null : (
          <button type="button" className="full-chapter" onClick={() => toggleFullChapter(hooks)}>
            {state.fullChapter ? 'Hide' : 'Read'} full chapter
          </button>
        )}
      </div>
    </>
  );
}

export default Verse;
