export const metadata = {
  title: "You’re offline — CashNarra",
};

/**
 * The service worker stores this document and the logo, not the app
 * stylesheet. These rules travel with the document so the page stays readable
 * when the network is down.
 */
const offlineCss = `
  html, body { margin: 0; background: #f7f7fa; color: #29263d; }
  main { max-width: 40rem; margin: 0 auto; padding: 28px 20px 48px;
    font-family: system-ui, "Segoe UI", sans-serif; line-height: 1.5; }
  img { width: 140px; height: auto; }
  h1 { font-size: 28px; line-height: 36px; margin: 40px 0 12px; }
  p { margin: 0 0 16px; }
  a { display: inline-flex; align-items: center; min-height: 44px;
    padding: 10px 18px; border-radius: 12px; background: #5b49c7;
    color: #ffffff; font-weight: 600; text-decoration: none; }
`;

/** Served by the service worker when a page cannot be reached. */
export default function Offline() {
  return (
    <main>
      <style>{offlineCss}</style>
      <img src="/brand/cashnarra-logo.svg" alt="CashNarra" />
      <h1>You’re offline right now.</h1>
      <p>
        CashNarra needs a connection to read a story, turn a recording into
        words, or save records. Words you typed with Draft backup turned on
        are kept on this device and will be here when you reconnect.
      </p>
      <p>
        Nothing has been saved or lost by going offline. Reconnect, then open
        your records again.
      </p>
      <p>
        <a href="/app">Try again</a>
      </p>
    </main>
  );
}
