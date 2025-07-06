export async function find_element<T extends HTMLElement>(
  selector: string
): Promise<T | null> {
  let element: T | null = null;
  while (!element) {
    element = document.querySelector(selector);
    if (!element) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  return element;
}

export async function find_elements<T extends HTMLElement>(
  selector: string
): Promise<NodeListOf<T>> {
  let elements: NodeListOf<T> | null = null;
  while (!elements || elements.length === 0) {
    elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  return elements;
}
