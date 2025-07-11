import { Container } from "@mantine/core";

function make_iframe() {
  const version = browser.runtime.getManifest().version;

  const iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "720px";
  const url = new URL("https://forms.office.com/Pages/ResponsePage.aspx");
  url.searchParams.append(
    "id",
    "DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAABWTsPtUNkUyNzMwSFkyNEVENTExTVdINUNBUDBFNC4u"
  );
  url.searchParams.append("r4fc5e3af4be04561a824b6564847f811", version);
  url.searchParams.append("embed", "true");

  iframe.src = url.toString();
  iframe.allowFullscreen = true;
  iframe.style.border = "none";
  return iframe.outerHTML;
}

function Form() {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: anyway
  return <Container dangerouslySetInnerHTML={{ __html: make_iframe() }} />;
}

export default Form;
