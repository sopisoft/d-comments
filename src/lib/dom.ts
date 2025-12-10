const waitFor = <T>(fn: () => T | null, interval = 100): Promise<T> =>
  new Promise((resolve) => {
    const poll = () => {
      const result = fn();
      if (result) resolve(result);
      else setTimeout(poll, interval);
    };
    poll();
  });

export const findElement = <T extends HTMLElement>(selector: string): Promise<T> =>
  waitFor(() => document.querySelector<T>(selector));

export const findElements = <T extends HTMLElement>(selector: string): Promise<NodeListOf<T>> =>
  waitFor(() => {
    const els = document.querySelectorAll<T>(selector);
    return els.length > 0 ? els : null;
  });
