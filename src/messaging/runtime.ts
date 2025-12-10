import { err, ok, type Result, toError } from "@/lib/types";
import type { MaybePromise, Message, MessagePayload, MessageResponse, MessageType, ProtocolMap } from "./types";

type RuntimeSender = Pick<typeof browser.runtime, "sendMessage" | "onMessage">;

type TabsApi = Pick<typeof browser.tabs, "query" | "sendMessage">;

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
  try {
    if (tab) {
      if (!env.tabs) {
        throw new Error("Tabs API is not available in the current context");
      }
      const tabs = await env.tabs.query({ active: true, currentWindow: true });
      const id = tabs[0]?.id;
      if (id === undefined) {
        throw new Error("Failed to determine active tab id");
      }
      return (await env.tabs.sendMessage(id, { type, payload })) as Awaited<MessageResponse<TType>>;
    }
    return (await env.runtime.sendMessage({ type, payload })) as Awaited<MessageResponse<TType>>;
  } catch (rawError) {
    throw toError(rawError);
  }
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
  const listener: Parameters<RuntimeSender["onMessage"]["addListener"]>[0] = (
    message: Message<TType>,
    sender: Browser.runtime.MessageSender,
    sendResponse: (response: Awaited<MessageResponse<TType>>) => void
  ) => {
    if (message.type !== type) return;

    try {
      const result = handler(message.payload, sender);
      if (result instanceof Promise) {
        result
          .then((res) => sendResponse(res as Awaited<MessageResponse<TType>>))
          .catch((err) => {
            const normalized = toError(err);
            sendResponse({ error: normalized.message } as Awaited<MessageResponse<TType>>);
          });
        return true;
      }
      sendResponse(result as Awaited<MessageResponse<TType>>);
    } catch (err) {
      const normalized = toError(err);
      sendResponse({ error: normalized.message } as Awaited<MessageResponse<TType>>);
    }

    return undefined;
  };

  env.runtime.onMessage.addListener(listener);
  return () => env.runtime.onMessage.removeListener(listener);
};

const normalizeResponse = <TType extends MessageType>(
  res: Awaited<MessageResponse<TType>> | { error?: string } | null
): Result<Awaited<ReturnType<ProtocolMap[TType]>>, Error> => {
  if (!res) return err(new Error("No message response from runtime"));
  if (typeof res === "object" && "error" in res) return err(new Error(res.error ?? "Unknown error"));
  return ok(res as Awaited<ReturnType<ProtocolMap[TType]>>);
};

export const requestMessageResult = async <TType extends MessageType>(
  type: TType,
  payload?: MessagePayload<TType>,
  tab?: boolean,
  envOverride?: Partial<RuntimeEnvironment>
): Promise<Result<Awaited<ReturnType<ProtocolMap[TType]>>, Error>> =>
  sendMessage(type, payload, tab, envOverride)
    .then((res) => normalizeResponse(res))
    .catch((e) => err(toError(e)));

export const getActiveTabId = async (envOverride?: Partial<RuntimeEnvironment>): Promise<number | null> => {
  const env = resolveEnv(envOverride);
  if (!env.tabs) return null;
  const tabs = await env.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id ?? null;
};
