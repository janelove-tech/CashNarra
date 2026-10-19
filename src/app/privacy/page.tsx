import Link from "next/link";
import s from "@/components/app.module.css";
export default function Privacy() {
  return (
    <main className={s.landing}>
      <Link href="/">
        <img
          className={s.logo}
          src="/brand/cashnarra-lockup.svg"
          alt="CashNarra"
        />
      </Link>
      <article className={s.flow} style={{ paddingTop: 48 }}>
        <h1>Your money story is personal.</h1>
        <p>
          This is a local development build. The synthetic demo is for fictional
          data only. The operating company and privacy contact have not yet been
          supplied; real customer onboarding is not launch-ready.
        </p>
        <h2>What we use</h2>
        <p>
          Your sign-in details, money stories, names you enter and changes you
          make help us organise your records. Do not enter payment PINs, bank
          credentials, identity documents or unnecessary sensitive details.
        </p>
        <p>
          Supabase handles sign-in and stores your records. If AI is switched
          on, OpenAI receives your story and the account or debt details needed
          to suggest records. You check those suggestions before saving. We ask
          OpenAI not to save the response for later use, but that does not mean
          it keeps no data at all. The service providers’ storage locations and
          data policies must be confirmed before this app is opened to real
          customers.
        </p>
        <h2>Device drafts and exports</h2>
        <p>
          Keeping unfinished drafts on this device is optional and off by
          default. Shared-device mode keeps them only in this tab. Your browser
          can remove stored drafts, so they are not a backup. Before signing
          out, copy or finish anything you have not saved. Only public images
          and fonts are kept for faster loading. Downloaded reports are private
          files; anyone you send them to can redistribute them.
        </p>
        <h2>How long your words stay</h2>
        <p>
          Your original words are kept for 30 days by default in this
          development version. You can choose a shorter time in Settings. Saved
          amounts and correction history are kept separately. You can also
          record a request to access or delete your data. That request needs
          review; it does not delete anything immediately. Some records may need
          to be kept by law. There is no support team handling these requests
          yet, and no promised response date.
        </p>
        <h2>What CashNarra does</h2>
        <p>
          CashNarra records and explains money; it does not hold funds, connect
          bank feeds, make payments, offer credit, recommend investments or file
          taxes. Recorded balances are manual and unverified. Goals are
          estimates based on amounts you choose, not promises or a check that
          you can afford them.
        </p>
        <details>
          <summary>Before CashNarra opens to the public</summary>
          <p>
            The company responsible for your data, its privacy contact, provider
            arrangements and applicable Ghanaian registration and record-keeping
            requirements still need to be confirmed. Building the app does not
            mean it has regulatory approval or accessibility certification.
          </p>
        </details>
        <Link href="/">Back to CashNarra</Link>
      </article>
    </main>
  );
}
