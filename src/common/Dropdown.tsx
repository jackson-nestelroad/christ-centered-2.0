import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Key, useLayoutEffect, useRef, useState } from 'react';

import { StateRefReactHooks, defaultSetStateRef } from '../hooks';
import { getPathToRoot, inOffsetView, pixelsAboveScreenBottom, scrollContainerToViewWholeChild } from '../util/dom';
import './Dropdown.scss';

export interface DropdownOption<T extends Key> {
  name: string;
  value: T;
}

export type DropdownOptions<T extends Key> = DropdownOption<T>[];

type DropdownCallback<T> = (value: T) => void;

interface DropdownProps<T extends Key> {
  id?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  options: DropdownOptions<T>;
  value?: T;
  disabled?: boolean;
  placeholder?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  onSelect: DropdownCallback<T>;
}

interface DropdownState {
  active: boolean;
  top: boolean;
  usingArrowKeys: boolean;
  lastSelected: number;
}

type DropdownHooks = StateRefReactHooks<DropdownState, 'setStateRef'> & {
  dropdown: React.RefObject<HTMLElement>;
};

const maxHeight = 224;

function checkPosition({ stateRef, setStateRef, dropdown }: DropdownHooks) {
  const state = stateRef.current;
  if (!dropdown.current) {
    return;
  }

  if (pixelsAboveScreenBottom(dropdown.current) <= maxHeight) {
    setStateRef({ ...state, top: true });
  } else {
    setStateRef({ ...state, top: false });
  }
}

function onClickOption<T extends Key>(
  { stateRef, setStateRef }: DropdownHooks,
  { onSelect, options }: DropdownProps<T>,
  index: number,
) {
  const state = stateRef.current;
  setStateRef({ ...state, lastSelected: index });
  onSelect(options[index].value);
}

function createOptionElements<T extends Key>({ stateRef }: DropdownHooks, { options, value }: DropdownProps<T>) {
  const state = stateRef.current;
  return options.map(({ name, value: optionValue }, index) => (
    <li
      key={optionValue}
      data-index={index}
      className={`option ${optionValue === value ? 'selected' : ''} ${
        state.usingArrowKeys && index === state.lastSelected ? 'hover' : ''
      }`}
    >
      {name}
    </li>
  ));
}

function onDocumentClick<T extends Key>(hooks: DropdownHooks, props: DropdownProps<T>, event: MouseEvent) {
  const { dropdown, stateRef, setStateRef } = hooks;
  const state = stateRef.current;
  if (props.disabled) {
    return;
  }

  const target = event.target as Element;
  const path = getPathToRoot(target);
  if (path.indexOf(dropdown.current as Element) === -1) {
    setStateRef({ ...state, active: false });
  } else {
    const index = parseInt(target.getAttribute('data-index') ?? 'NaN');
    if (target.tagName === 'LI' && target.classList.contains('option') && !Number.isNaN(index)) {
      onClickOption(hooks, props, index);
    } else {
      setStateRef({ ...state, active: !state.active });
    }
  }
}

function moveIndex(current: number, max: number, diff: number): number {
  const next = current + diff;
  return ((next % max) + max) % max;
}

function moveArrowSelection<T extends Key>(
  { stateRef, setStateRef }: DropdownHooks,
  { options }: DropdownProps<T>,
  diff: number,
) {
  const state = stateRef.current;
  if (state.lastSelected === -1) {
    setStateRef({ ...state, lastSelected: 0, usingArrowKeys: true });
    return;
  }

  const selected = state.usingArrowKeys ? moveIndex(state.lastSelected, options.length, diff) : state.lastSelected;
  setStateRef({ ...state, lastSelected: selected, usingArrowKeys: true });
}

function onKeyDown<T extends Key>(hooks: DropdownHooks, props: DropdownProps<T>, event: KeyboardEvent) {
  const { dropdown, stateRef, setStateRef } = hooks;
  const state = stateRef.current;
  if (props.disabled) {
    return;
  }

  if (event.code === 'Space') {
    const path = getPathToRoot(document.activeElement!);
    if (path.indexOf(dropdown.current as Element) !== -1) {
      if (state.active && state.usingArrowKeys && state.lastSelected !== -1) {
        onClickOption(hooks, props, state.lastSelected);
      }
      setStateRef({ ...state, active: !state.active });
      event.preventDefault();
      event.stopPropagation();
    }
  } else if (state.active) {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
      moveArrowSelection(hooks, props, -1);
      event.preventDefault();
      event.stopPropagation();
    } else if (event.code === 'ArrowRight' || event.code === 'ArrowDown') {
      moveArrowSelection(hooks, props, 1);
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

function onMouseOver<T extends Key>({ stateRef, setStateRef }: DropdownHooks, { disabled }: DropdownProps<T>) {
  const state = stateRef.current;
  if (disabled) {
    return;
  }

  if (state.lastSelected !== -1) {
    setStateRef({ ...state, usingArrowKeys: false });
  }
}

function onBlur<T extends Key>({ stateRef, setStateRef }: DropdownHooks, { disabled }: DropdownProps<T>) {
  const state = stateRef.current;
  if (disabled) {
    return;
  }

  setStateRef({ ...state, active: false });
}

function Dropdown<T extends Key>(props: DropdownProps<T>) {
  const dropdown = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuOptions = useRef<HTMLUListElement>(null);

  const { id, options, value, disabled, placeholder } = props;

  const selectedOptionIndex = options.findIndex(({ value: optionValue }) => optionValue === value);
  const selectedOption = options[selectedOptionIndex];
  const hasValue = !!selectedOption;

  const [state, setState] = useState<DropdownState>({
    active: false,
    top: false,
    usingArrowKeys: false,
    lastSelected: selectedOptionIndex,
  });
  const stateRef = useRef(state);
  const setStateRef = defaultSetStateRef(stateRef, setState);

  const hooks: DropdownHooks = { stateRef, setStateRef, dropdown };

  useLayoutEffect(() => {
    checkPosition(hooks);

    const clickHandler = (event: MouseEvent) => onDocumentClick(hooks, props, event);
    const keyDownHandler = (event: KeyboardEvent) => onKeyDown(hooks, props, event);
    const mouseOverHandler = () => onMouseOver(hooks, props);
    const blurHandler = () => onBlur(hooks, props);
    const scrollHandler = () => checkPosition(hooks);

    document.addEventListener('click', clickHandler, { passive: true });
    document.addEventListener('keydown', keyDownHandler, { passive: false });
    menuOptions.current!.addEventListener('mouseover', mouseOverHandler, { passive: true });
    dropdown.current!.addEventListener('blur', blurHandler, { passive: true });
    document.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keydown', keyDownHandler);
      menuOptions.current!.removeEventListener('mouseover', mouseOverHandler);
      dropdown.current!.removeEventListener('blur', blurHandler);
      document.removeEventListener('scroll', scrollHandler);
    };
  }, [props]);

  if (state.usingArrowKeys && state.lastSelected !== -1 && menu.current && menuOptions.current) {
    const lastSelectedElement = menuOptions.current.children[state.lastSelected] as HTMLElement;
    if (lastSelectedElement && !inOffsetView(lastSelectedElement, { ignoreX: true, whole: true })) {
      scrollContainerToViewWholeChild(menu.current, lastSelectedElement, { ignoreX: true, smooth: true });
    }
  }

  return (
    <div
      className={`dropdown ${state.top ? 'top' : 'bottom'} ${state.active ? 'active' : 'inactive'} ${
        disabled ? 'disabled' : ''
      }`}
      tabIndex={0}
      ref={dropdown}
    >
      <input id={id} type="text" value={value} readOnly disabled={disabled} placeholder={placeholder} tabIndex={-1} />
      <div className="selected">
        <FontAwesomeIcon icon={['fas', 'caret-down']} className="arrow" />
        <div className={`display ${hasValue ? '' : 'placeholder'}`}>
          {hasValue ? selectedOption.name : placeholder ?? '_____'}
        </div>
      </div>
      <div className="dropdown-menu" ref={menu} style={{ maxHeight }}>
        <ul className="options" ref={menuOptions}>
          {createOptionElements(hooks, props)}
        </ul>
      </div>
    </div>
  );
}

Dropdown.defaultProps = {
  id: undefined,
  value: undefined,
  disabled: false,
  placeholder: undefined,
};

export default Dropdown;
