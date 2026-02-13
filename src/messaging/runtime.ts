import { err, toError } from '@/lib/types';
import type { MaybePromise, Message, MessagePayload, MessageResponse, MessageType, ProtocolMap } from './types';

type RuntimeSender = Pick<typeof browser.runtime, 'sendMessage' | 'onMessage'>;

type TabsApi = Pick<typeof browser.tabs, 'query' | 'sendMessage'>;

type RuntimeEnvironment = {
  runtime: RuntimeSender;
  tabs?: TabsApi;
};

const defaultEnvironment: RuntimeEnvironment = {
  runtime: browser.runtime,
  tabs: browser.tabs,
};

const resolveEnv = (env?: Partial<RuntimeEnvironment>): RuntimeEnvironment => ({
  runtime: env?.runtime ?? defaultEnvironment.runtime,
  tabs: env?.tabs ?? defaultEnvironment.tabs,
});

export const sendMessage = async <TType extends MessageType>(
  type: TType,
  payload?: MessagePayload<TType>,
  tab?: boolean,
  envOverride?: Partial<RuntimeEnvironment>
): Promise<Awaited<MessageResponse<TType>>> => {
  const env = resolveEnv(envOverride);
  if (tab) {
    if (!env.tabs) {
      return err(new Error('Tabs API is not available in the current context')) as unknown as Awaited<
        MessageResponse<TType>
      >;
    }
    const tabs = await env.tabs.query({ active: true, currentWindow: true });
    const id = tabs[0]?.id;
    if (id === undefined) {
      return err(new Error('Failed to determine active tab id')) as unknown as Awaited<MessageResponse<TType>>;
    }
    return (await env.tabs.sendMessage(id, { payload, type })) as Awaited<MessageResponse<TType>>;
  }
  return (await env.runtime.sendMessage({ payload, type })) as Awaited<MessageResponse<TType>>;
};

export const onMessage = <TType extends MessageType>(
  type: TType,
  handler: (
    payload: MessagePayload<TType>,
    sender: Browser.runtime.MessageSender
  ) => MaybePromise<MessageResponse<TType>>,
  envOverride?: Partial<RuntimeEnvironment>
): (() => void) => {
  const env = resolveEnv(envOverride);
  const listener: Parameters<RuntimeSender['onMessage']['addListener']>[0] = (
    message: Message<TType>,
    sender: Browser.runtime.MessageSender,
    sendResponse: (response: Awaited<MessageResponse<TType>>) => void
  ) => {
    if (message.type !== type) return;
    const result = handler(message.payload, sender);
    Promise.resolve(result).then(
      (res) => sendResponse(res as Awaited<MessageResponse<TType>>),
      (errReason) => sendResponse(err(toError(errReason)) as unknown as Awaited<MessageResponse<TType>>)
    );
    return true;
  };

  env.runtime.onMessage.addListener(listener);
  return () => env.runtime.onMessage.removeListener(listener);
};

export const requestMessageResult = async <TType extends MessageType>(
  type: TType,
  payload?: MessagePayload<TType>,
  tab?: boolean,
  envOverride?: Partial<RuntimeEnvironment>
): Promise<Awaited<ReturnType<ProtocolMap[TType]>>> =>
  sendMessage(type, payload, tab, envOverride).then(
    (res) => res as Awaited<ReturnType<ProtocolMap[TType]>>,
    (e) => err(toError(e)) as Awaited<ReturnType<ProtocolMap[TType]>>
  );

export const getActiveTabId = async (envOverride?: Partial<RuntimeEnvironment>): Promise<number | null> => {
  const env = resolveEnv(envOverride);
  if (!env.tabs) return null;
  const tabs = await env.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id ?? null;
};
