/**
 * Checks if the browser is Internet Explorer.
 * @returns Is the browser Internet Explorer?
 */
export function isIE(): boolean {
  return window.navigator.userAgent.match(/(MSIE|Trident)/) !== null;
}

/**
 * Gets the height and width of the viewport.
 * @returns
 */
export function getViewport(): { height: number; width: number } {
  return {
    height: Math.max(window.innerHeight, document.documentElement.clientHeight),
    width: Math.max(window.innerWidth, document.documentElement.clientWidth),
  };
}

/**
 * Returns how many pixels from the bottom of the viewport the element is.
 * @param element Element in the DOM.
 * @returns Number of pixels from the bottom of the viewport.
 */
export function pixelsAboveScreenBottom(element: Element): number {
  const { bottom } = element.getBoundingClientRect();
  const { height } = getViewport();
  return height - bottom;
}

/**
 * Creates and returns the path to the root of the DOM (up to `window`).
 * @param element Element in the DOM.
 * @returns Array of elements starting from the input element up to the window.
 */
export function getPathToRoot(element: Element): Array<Element | Document | Window> {
  const path: Array<Element | Document | Window> = [];
  let curr: Element | null = element;
  while (curr) {
    path.push(curr);
    curr = curr.parentElement;
  }

  if (path.indexOf(window) === -1 && path.indexOf(document) === -1) {
    path.push(document);
  }
  if (path.indexOf(window) === -1) {
    path.push(window);
  }

  return path;
}

/**
 * Creates the DOM name (local CSS selector) for an element.
 * @param element Element in the DOM/
 * @returns DOM name.
 */
export function getDOMName(element: Element): string {
  let name = element.tagName.toLowerCase();
  if (element.id) {
    name += `#${element.id}`;
  }
  if (element.className) {
    name += `.${element.className.replace(/ /g, '.')}`;
  }
  return name;
}

/**
 * Returns the DOM path to an element.
 * @param element Element in the DOM.
 * @returns Path to the element from the root.
 */
export function getDOMPath(element: Element): Element[] {
  if (!element) {
    return [];
  }

  const path: Element[] = [element];
  while (element.parentElement) {
    element = element.parentElement;
    if (element.tagName.toLowerCase() === 'html') {
      break;
    }
    path.unshift(element);
  }
  return path;
}

/**
 * Returns the DOM path to an element as an array of element names.
 * @param element Element in the DOM.
 * @returns DOM path.
 */
export function getDOMPathNames(element: Element): string[] {
  const path = getDOMPath(element);
  if (path.length === 0) {
    return [];
  }

  return path.map(element => getDOMName(element));
}

/**
 * Returns the CSS selector for an element.
 * @param element Element in the DOM.
 * @param condense Condense long names for debug strings?
 * @returns CSS selector.
 */
export function getCSSSelector(element: Element, condense: boolean = true): string {
  const names = getDOMPathNames(element);
  if (!condense || names.length <= 6) {
    return names.join(' > ');
  }

  const { length } = names;
  const begin = names.slice(0, 3);
  const end = names.slice(length - 3, length);
  return `${begin.join(' > ')} > ... > ${end.join(' > ')}`;
}

/**
 * // Returns the total `offsetTop`/`offsetLeft` pair for a child in a container up the DOM tree.
 * @param container Element in the DOM containing `child`.
 * @param child HTML element in the DOM.
 * @param caller Caller of this function for error debugging.
 * @returns Child offset position within container.
 */
export function getChildOffsetPositionForContainer(
  container: Element,
  child: HTMLElement,
  caller: string = '',
): { offsetTop: number; offsetLeft: number } {
  let offsetTop: number = 0;
  let offsetLeft: number = 0;

  // Iterate upwards to make sure container is valid and get proper scroll position.
  let curr: HTMLElement = child;
  while (curr && curr !== container) {
    offsetTop += curr.offsetTop;
    offsetLeft += curr.offsetLeft;
    curr = curr.offsetParent as HTMLElement;
  }
  if (!curr) {
    throw new Error(
      `${caller ? `${caller} => ` : ''}"${getCSSSelector(child)}" does not contain "${getCSSSelector(
        container,
      )}" as an offset parent. Check that the container has "position: relative" set or that it is in the DOM path.`,
    );
  }

  return { offsetTop, offsetLeft };
}

/**
 * Settings for controlling the behavior of `inOffsetView`.
 */
export interface ContainerViewSettings {
  xOffset?: number;
  yOffset?: number;
  ignoreX?: boolean;
  ignoreY?: boolean;
  whole?: boolean;
  container?: Element;
}

// Needed for a few validations
function boundingClientRectToObject(rect: DOMRect) {
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    x: rect.x ? rect.x : 0,
    y: rect.y ? rect.y : 0,
  };
}

/**
 * Generates line pairs in one direction (horizontal or vertical) for two rectangles.
 * @param top1
 * @param size1
 * @param top2
 * @param size2
 * @param offset
 * @returns
 */
function lines(
  top1: number,
  size1: number,
  top2: number,
  size2: number,
  offset: number,
): [number, number, number, number] {
  return [top1 - offset, top1 - offset + size1, top2, top2 + size2];
}

/**
 * Resolves offset settings by converting decimals to percentages of the width/height.
 * @param xOffset X offset.
 * @param yOffset Y offset.
 * @param width Total width.
 * @param height Total height;
 * @returns Resolves X and Y offsets.
 */
function xyOffset(
  xOffset: number,
  yOffset: number,
  width: number,
  height: number,
): { xOffset: number; yOffset: number } {
  if (xOffset && xOffset <= 1) {
    xOffset *= width;
  } else {
    xOffset = 0;
  }

  if (yOffset && yOffset <= 1) {
    yOffset *= height;
  } else {
    yOffset = 0;
  }

  return { xOffset, yOffset };
}

/**
 * Checks if the child element is in view for its offset container.
 *
 * Offset container is retrieved automatically via `child.offsetParent` unless a container is passed to the settings
 * object.
 * @param child HTML element in the DOM.
 * @param settings Settings.
 * @returns
 */
export function inOffsetView(child: HTMLElement, settings: ContainerViewSettings = {}): boolean {
  let container: Element;
  let offsetTop: number;
  let offsetLeft: number;

  // No container given, use immediate parent
  if (!settings.container) {
    if (!child.offsetParent) {
      throw new Error(
        // eslint-disable-next-line max-len
        'inOffsetView(child, ...) => child.offsetParent cannot be null. Check that it is in a container with "position: relative" set.',
      );
    }
    container = child.offsetParent;
    offsetTop = child.offsetTop;
    offsetLeft = child.offsetLeft;
  }
  // Container is given.
  else {
    const result = getChildOffsetPositionForContainer(settings.container, child, 'inOffsetView(child, ...)');
    container = settings.container;
    offsetTop = result.offsetTop;
    offsetLeft = result.offsetLeft;
  }

  const childRect = child.getBoundingClientRect();

  if (Object.values(boundingClientRectToObject(childRect)).every(val => val === 0)) {
    return false;
  }

  const containerRect = container.getBoundingClientRect();

  const { xOffset, yOffset } = xyOffset(
    settings.xOffset ?? 0,
    settings.yOffset ?? 0,
    containerRect.width,
    containerRect.height,
  );

  let x = true;
  let y = true;

  if (!settings.ignoreY) {
    const [containerTopLine, containerBottomLine, childTopLine, childBottomLine] = lines(
      container.scrollTop,
      containerRect.height,
      offsetTop,
      childRect.height,
      yOffset,
    );

    y = settings.whole
      ? childBottomLine < containerBottomLine && childTopLine > containerTopLine
      : childBottomLine > containerTopLine && childTopLine < containerBottomLine;
  }

  if (!settings.ignoreX) {
    const [containerLeftLine, containerRightLine, childLeftLine, childRightLine] = lines(
      container.scrollLeft,
      containerRect.width,
      offsetLeft,
      childRect.width,
      xOffset,
    );

    x = settings.whole
      ? childRightLine < containerRightLine && childLeftLine > containerLeftLine
      : childRightLine > containerLeftLine && childLeftLine < containerRightLine;
  }

  return x && y;
}

/**
 * Settings that control scroll behavior.
 */
export type ScrollSettings = ContainerViewSettings & {
  smooth?: boolean;
};

/**
 * Scrolls the element to the given position.
 * @param container Element in the DOM.
 * @param left Left position.
 * @param top Right position.
 * @param settings Scroll settings.
 */
function scrollTo(container: Element, left: number, top: number, settings: ScrollSettings = {}): void {
  if (isIE()) {
    container.scrollLeft = left;
    container.scrollTop = top;
  } else {
    container.scrollTo({
      left,
      top,
      behavior: settings.smooth ? 'smooth' : 'auto',
    });
  }
}

// Scrolls the container element until the child is completely visible in the container
// The child element must be in the container and be smaller than the container
export function scrollContainerToViewWholeChild(
  container: Element,
  child: HTMLElement,
  settings: ScrollSettings = {},
): void {
  const result = getChildOffsetPositionForContainer(container, child, 'scrollContainerToViewChildWhole(...)');
  const { offsetTop } = result;
  const { offsetLeft } = result;

  const containerRect = container.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  const { xOffset, yOffset } = xyOffset(
    settings.xOffset ?? 0,
    settings.yOffset ?? 0,
    containerRect.width,
    containerRect.height,
  );

  const [containerTopLine, containerBottomLine, childTopLine, childBottomLine] = lines(
    container.scrollTop,
    containerRect.height,
    offsetTop,
    childRect.height,
    yOffset,
  );

  const [containerLeftLine, containerRightLine, childLeftLine, childRightLine] = lines(
    container.scrollLeft,
    containerRect.width,
    offsetLeft,
    childRect.width,
    xOffset,
  );

  let x = container.scrollLeft;
  let y = container.scrollTop;

  if (!settings.ignoreY) {
    const above = childTopLine < containerTopLine;
    const below = childBottomLine > containerBottomLine;
    if (above && !below) {
      y = childTopLine;
    } else if (!above && below) {
      y += childBottomLine - containerBottomLine;
    }
  }

  if (!settings.ignoreX) {
    const left = childLeftLine < containerLeftLine;
    const right = childRightLine > containerRightLine;
    if (left && !right) {
      x = childLeftLine;
    } else if (!left && right) {
      x += childRightLine - containerRightLine;
    }
  }

  scrollTo(container, x, y, settings);
}
