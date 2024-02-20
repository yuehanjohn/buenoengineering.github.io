import { usePopper, CustomPopperProps } from '../usePopper/usePopper';
import { usePortalWrapper } from '../usePortalWrapper';

export function usePortalPopper<
  RefElementType extends HTMLElement = HTMLElement,
  PopperElementType extends HTMLElement = HTMLElement,
>({
  id,
  containerId,
  shouldMountWrapper,
  popperOptions = {},
  className,
}: {
  id: string;
  containerId?: string;
  shouldMountWrapper?: boolean;
  popperOptions?: CustomPopperProps;
  className?: string;
}) {
  const {
    mountPortalWrapper: mountPortalPoppersWrapper,
    unMountPortalWrapper: unMountPortalPoppersWrapper,
    wrapperEl: poppersWrapper,
  } = usePortalWrapper({
    compId: id,
    shouldMount: shouldMountWrapper,
    containerId,
    className,
  });

  const popperReturnVal = usePopper<RefElementType, PopperElementType>(
    popperOptions,
  );

  return {
    ...popperReturnVal,
    poppersWrapper,
    mountPortalPoppersWrapper,
    unMountPortalPoppersWrapper,
  };
}
