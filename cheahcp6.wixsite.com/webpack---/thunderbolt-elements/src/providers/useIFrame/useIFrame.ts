/// <reference lib="dom" />
import { useRef, useEffect, useCallback } from 'react';
import { isBrowser } from '@wix/editor-elements-common-utils';

export type IFrameEvent = {
  type: 'load' | 'unload' | 'message';
  payload?:
    | string
    | {
        [key: string]: any;
      };
};

type ISendMessageArg =
  | string
  | number
  | boolean
  | Record<string, any>
  | Array<any>;

type ISendMessageArgOptions = {
  forceSend?: boolean;
};

export type IFrameEventType = IFrameEvent['type'];
export type ISendMessage = (
  message: ISendMessageArg,
  options?: ISendMessageArgOptions,
) => void;
export type IIFrameReducer = (
  event: IFrameEvent,
  sendMessage: ISendMessage,
) => void;

/**
 * Hook to interact with iframe - subscribe to events/postMessages and send postMessages
 * @param options - {reducer: IIFrameReducer, iframeLoaded: boolean} includes reducer parameter (used for handling messages from the iframe) and iframeLoaded parameter to
 * tell hook that iframe is already loaded and ready to accept messages
 * @returns {(node: HTMLIFrameElement) => void, ISendMessage]} - tuple containing ref and function to send messages to iframe
 */
export function useIFrame({
  reducer = () => ({}),
  iframeLoaded,
}: {
  reducer?: IIFrameReducer;
  iframeLoaded?: boolean;
}): [(node: HTMLIFrameElement) => void, ISendMessage] {
  const prerenderMessages = useRef<Array<any>>([]);
  const iframe = useRef<HTMLIFrameElement | undefined>(undefined);
  const loaded = useRef<boolean | undefined>(undefined);
  const iframeCleanupFunction = useRef<(() => void) | undefined>(undefined);

  const sendMessage: ISendMessage = useCallback(
    (message: ISendMessageArg, options?: ISendMessageArgOptions) => {
      if ((iframe.current && iframeLoaded) || options?.forceSend) {
        const iFrameWindow = iframe.current?.contentWindow;
        iFrameWindow?.postMessage(message, '*');
        return;
      }

      /**
       * iframeLoaded is an optional parameter so we have to
       * rely on explicit values likes false or true.
       */
      if (!iframe.current || !loaded.current || iframeLoaded === false) {
        /**
         * User could send messages before iframe is loaded
         * so we need to queue those messages to be sent iframe load
         */
        prerenderMessages.current.push(message);
        return;
      }

      const iFrameWindow = iframe.current.contentWindow;
      iFrameWindow?.postMessage(message, '*');
    },
    [iframeLoaded],
  );

  const sendBufferedMessages = useCallback(() => {
    if (prerenderMessages.current.length !== 0 && iframeLoaded !== false) {
      prerenderMessages.current.forEach(message => sendMessage(message));
      prerenderMessages.current = [];
    }
  }, [sendMessage, iframeLoaded]);

  const ref = useCallback(
    (node: HTMLIFrameElement) => {
      if (iframeCleanupFunction.current) {
        iframeCleanupFunction.current();
        iframeCleanupFunction.current = undefined;
      }

      if (!node) {
        return;
      }

      const loadListener = () => {
        loaded.current = true;
        sendBufferedMessages();
        reducer({ type: 'load' }, sendMessage);
      };

      node.addEventListener('load', loadListener);

      iframe.current = node;

      iframeCleanupFunction.current = () => {
        node.removeEventListener('load', loadListener);
      };
    },
    [reducer, sendMessage, sendBufferedMessages],
  );

  useEffect(() => {
    if (iframeLoaded) {
      sendBufferedMessages();
    }
  }, [iframeLoaded, sendBufferedMessages]);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const messageListener = (message: MessageEvent) => {
      // !message.source if for ie11 fallback
      if (!message.source || message.source === iframe.current?.contentWindow) {
        reducer({ type: 'message', payload: message.data }, sendMessage);
      }
    };

    window.addEventListener('message', messageListener);

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, [reducer, sendMessage]);

  return [ref, sendMessage];
}
