export async function find_element(
  selector: string,
  trials = 100,
  interval = 100
) {
  for (let i = 0; i < trials; i++) {
    const element = document.querySelector(selector);
    if (element !== null) return element;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

export async function find_elements(
  selector: string,
  trials = 100,
  interval = 100
): Promise<NodeListOf<Element>> {
  for (let i = 0; i < trials; i++) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0)
      await new Promise((resolve) => setTimeout(resolve, interval));
    else break;
  }
  return document.querySelectorAll(selector);
}
