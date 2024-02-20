import React from 'react';

export const getPortalWrapperTestId = (id: string) =>
  `${id}-portal-wrapper-test-id`;
export const getPortalWrapperId = (id: string) => `${id}-portal-wrapper-id`;

export function usePortalWrapper({
  compId,
  containerId,
  shouldMount,
  className,
}: {
  compId: string;
  containerId?: string;
  shouldMount?: boolean;
  className?: string;
}) {
  const [wrapperEl, setWrapperEl] = React.useState<HTMLElement | null>();

  const mountPortalWrapper = React.useCallback(
    () => initWrapperEl(compId, setWrapperEl, containerId, className),
    [className, compId, containerId],
  );
  const unMountPortalWrapper = React.useCallback(() => {
    const wrapperElement = document.getElementById(getPortalWrapperId(compId));

    if (wrapperElement) {
      removeFromDOM(wrapperElement);
    }
  }, [compId]);

  React.useEffect(() => {
    if (shouldMount) {
      mountPortalWrapper();
    }

    return unMountPortalWrapper;
  }, [shouldMount, unMountPortalWrapper, mountPortalWrapper]);
  React.useEffect(() => () => unMountPortalWrapper(), [unMountPortalWrapper]);

  return {
    wrapperEl,
    mountPortalWrapper,
    unMountPortalWrapper,
  };
}

const createWrapperEl = (id: string, className?: string) => {
  const el = document.createElement('div');

  el.setAttribute('data-testid', getPortalWrapperTestId(id));
  el.setAttribute('id', getPortalWrapperId(id));

  if (className) {
    const classesArray = className.split(' ');
    classesArray.forEach(singleClassName => el.classList.add(singleClassName));
  }

  return el;
};

const initWrapperEl = (
  id: string,
  setWrapperEl: React.Dispatch<
    React.SetStateAction<HTMLElement | null | undefined>
  >,
  containerId?: string,
  className?: string,
) => {
  let wrapperElement = document.getElementById(getPortalWrapperId(id));

  if (!wrapperElement) {
    wrapperElement = createWrapperEl(id, className);

    let portalContainer = document.body;

    if (containerId) {
      portalContainer = document.getElementById(containerId) || document.body;
    }

    portalContainer.appendChild(wrapperElement);
  }

  setWrapperEl(wrapperElement);
};

const removeFromDOM = (el: HTMLElement) => el?.remove();
