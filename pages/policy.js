import Link from "next/link";
import Script from "next/script";
import React from "react";
import { useRouter } from "next/router";

const Policy = () => {
  const router = useRouter();
  const { locale } = router;

  return (
    <>
      {locale === "it" ? (
        <div className="container mx-auto pt-5 p-2 xl:p-8 text-black">
          <h1>Informativa sulla privacy</h1>
          <p>Data di entrata in vigore: 07-02-2023</p>
          <p>Ultimo aggiornamento: 07-02-2023</p>
          <p>
            La presente Informativa sulla privacy spiega le politiche di Luisa
            sulla raccolta e l&apos;uso delle informazioni che raccogliamo
            quando accedi a https://www.louontour.it/ (il &apos;Servizio&apos;).
            La presente Informativa sulla privacy descrive i tuoi diritti e in
            che maniera sei protetto dalle leggi sulla privacy.
          </p>
          <p>
            Utilizzando il nostro Servizio, acconsenti alla raccolta e
            all&apos;utilizzo delle tue informazioni in conformità con la
            presente Informativa sulla privacy. Ti preghiamo di non accedere o
            utilizzare il nostro Servizio se non acconsenti alla raccolta e
            all&apos;utilizzo delle informazioni come indicato nella presente
            Informativa sulla privacy. La presente Informativa sulla privacy è
            stata creata con l&apos;aiuto del{" "}
            <Link
              target="_blank"
              href="https://cookie-script.com/privacy-policy-generator"
            >
              Generatore di informative sulla privacy di CookieScript
            </Link>
            .
          </p>
          <p>
            Luisa è autorizzata a modificare la presente Informativa sulla
            privacy in qualsiasi momento. Questo può avvenire senza preavviso.
          </p>
          <p>
            Luisa pubblicherà l&apos;Informativa sulla privacy modificata sul
            sito web https://www.louontour.it/.
          </p>

          <h3>Raccolta e utilizzo delle tue informazioni personali</h3>
          <h4>Informazioni raccolte</h4>
          <p>
            Quando utilizzi il nostro Servizio, ti verrà richiesto di fornirci
            delle informazioni personali utilizzate per contattarti o
            identificarti. https://www.louontour.it/ raccoglie le seguenti
            informazioni:{" "}
          </p>

          <ul>
            <li>Dati di utilizzo</li>
            <li>Nome</li>
            <li>E-mail</li>
          </ul>

          <p>I dati di utilizzo includono quanto segue:</p>
          <ul>
            <li>
              Indirizzo Protocollo Internet (IP) dei computer che accedono al
              sito
            </li>
            <li>Richieste di pagine web</li>
            <li>Pagine web di riferimento</li>
            <li>Browser utilizzato per accedere al sito</li>
            <li>Ora e data di accesso</li>
          </ul>

          <h4>Come raccogliamo le informazioni</h4>
          <p>
            https://www.louontour.it/ raccoglie e riceve informazioni da parte
            tua nelle seguenti modalità:{" "}
          </p>
          <ul>
            <li>
              Quando compili un modulo di registrazione o invii le tue
              informazioni personali in altro modo.
            </li>
          </ul>
          <p>
            Le tue informazioni saranno conservate per un massimo di 60 giorni
            dopo la chiusura del tuo account. Le tue informazioni possono essere
            conservate per periodi più lunghi per il reporting o per scopi di
            registrazione in conformità con le leggi applicabili. Le
            informazioni che non ti identificano personalmente possono essere
            conservate a tempo indeterminato.{" "}
          </p>

          <h4>Come usiamo le tue informazioni</h4>
          <p>
            https://www.louontour.it/ può utilizzare le tue informazioni per i
            seguenti scopi:{" "}
          </p>
          <ul>
            <li>
              <b>Fornire e mantenere il nostro Servizio,</b> così come
              monitorare l&apos;utilizzo del nostro Servizio.
            </li>
            <li>
              <b>Per altri scopi.</b> Luisa userà le tue informazioni per
              l&apos;analisi dei dati per identificare le tendenze di utilizzo o
              determinare l&apos;efficacia delle nostre campagne di marketing,
              quando ragionevole. Useremo le tue informazioni per valutare e
              migliorare il nostro Servizio, i prodotti, i servizi e le attività
              di marketing.
            </li>
          </ul>

          <h4>Come condividiamo le tue informazioni</h4>
          <p>
            Luisa condividerà le tue informazioni, se del caso, nelle seguenti
            situazioni:{" "}
          </p>
          <ul>
            <li>
              <b>Con il tuo consenso.</b> Luisa condividerà le tue informazioni
              per qualsiasi scopo con il tuo esplicito consenso.
            </li>
          </ul>

          <h4>Condivisione con terze parti</h4>
          <p>
            Qualsiasi terza parte con cui condividiamo le tue informazioni deve
            rivelare lo scopo per cui intende utilizzare le tue informazioni.
            Deve conservare le tue informazioni solo per la durata rivelata al
            momento della richiesta o della ricezione di tali informazioni. Il
            terzo fornitore di servizi non deve raccogliere, vendere o
            utilizzare ulteriormente le tue informazioni personali se non nella
            misura necessaria per eseguire lo scopo specificato.{" "}
          </p>
          <p>
            Le tue informazioni possono essere condivise con una terza parte per
            ragioni che includono:
          </p>
          <ul>
            <li>youtube</li>
          </ul>
          <p>
            Se scegli di fornire tali informazioni durante la registrazione o in
            altro modo, stai dando a Luisa il permesso di utilizzare,
            condividere e memorizzare tali informazioni in conformità con questa
            Informativa sulla privacy.{" "}
          </p>

          <p>
            Le tue informazioni possono essere divulgate per altri motivi, tra
            cui:
          </p>
          <ul>
            <li>
              Conformità con le normative, i regolamenti o le ingiunzioni
              applicabili.
            </li>
            <li>
              Risposta a reclami sul tuo uso del nostro Servizio violando
              diritti di terzi.
            </li>
            <li>
              Rispetto degli accordi stipulati con noi, compresa la presente
              Informativa sulla privacy.
            </li>
          </ul>

          <h4>Cookie</h4>
          <p>
            I cookie sono piccoli file di testo che vengono collocati sul tuo
            computer dai siti web che visiti. I siti web utilizzano i cookie per
            aiutare gli utenti a navigare in modo efficiente ed eseguire
            determinate funzioni. I cookie che sono necessari per il corretto
            funzionamento del sito web possono essere impostati senza il tuo
            permesso. Tutti gli altri cookie devono essere approvati prima di
            essere impostati nel browser.{" "}
          </p>
          <ul>
            <li>
              <b>Cookie strettamente necessari.</b> I cookie strettamente
              necessari consentono le funzionalità principali del sito web come
              l&apos;accesso dell&apos;utente e la gestione dell&apos;account.
              Il sito web non può essere utilizzato correttamente senza i cookie
              strettamente necessari.
            </li>
          </ul>

          <div className="cookie-report-container">
            <p data-cookiereport="true">
              Puoi modificare il tuo consenso all&apos;uso dei cookie qui sotto.{" "}
            </p>
            <Script
              type="text/javascript"
              charset="UTF-8"
              data-cookiescriptreport="report"
              data-cs-lang="it"
              src="//report.cookie-script.com/r/952906ba33559231ca8c72a6268c0ddb.js"
            />
          </div>

          <h4>Sicurezza</h4>
          <p>
            La sicurezza delle tue informazioni è importante per noi.
            https://www.louontour.it/ utilizza una serie di misure di sicurezza
            per prevenire l&apos;uso improprio, la perdita o l&apos;alterazione
            delle informazioni che ci hai fornito. Tuttavia, poiché non possiamo
            garantire la sicurezza delle informazioni che ci fornisci, stai
            eseguendo l&apos;accesso al nostro servizio a tuo rischio e
            pericolo.{" "}
          </p>
          <p>
            Luisa non è responsabile delle prestazioni dei siti web gestiti da
            terzi o delle tue interazioni con essi. Quando abbandoni questo sito
            web, ti consigliamo di rivedere le pratiche in materia di privacy
            degli altri siti web con cui interagisci e determinare
            l&apos;adeguatezza di tali pratiche.{" "}
          </p>

          <h4>Contatti</h4>
          <p>
            Per qualsiasi domanda, puoi contattarci attraverso i seguenti
            canali:
          </p>
          <p>Nome: Luisa Quaglia</p>
          <p>Indirizzo: via Podere Segarelli 6, 56045 Pomarance (PI)</p>
          <p>E-mail: luisaquaglia.tourguide@gmail.com</p>
          <p>Sito web: https://www.louontour.it/</p>
        </div>
      ) : (
        <div className="container mx-auto pt-5 p-2 xl:p-8 text-black">
          <h1>Privacy Policy</h1>
          <p>Effective date: 2023-02-07</p>
          <p>Updated on: 2023-02-07</p>
          <p>
            This Privacy Policy explains the policies of Luisa on the collection
            and use of the information we collect when you access
            https://www.louontour.it/ (the “Service”). This Privacy Policy
            describes your privacy rights and how you are protected under
            privacy laws.
          </p>
          <p>
            By using our Service, you are consenting to the collection and use
            of your information in accordance with this Privacy Policy. Please
            do not access or use our Service if you do not consent to the
            collection and use of your information as outlined in this Privacy
            Policy. This Privacy Policy has been created with the help of{" "}
            <Link
              target="_blank"
              href="https://cookie-script.com/privacy-policy-generator"
            >
              CookieScript Privacy Policy Generator
            </Link>
            .
          </p>
          <p>
            Luisa is authorized to modify this Privacy Policy at any time. This
            may occur without prior notice.
          </p>
          <p>
            Luisa will post the revised Privacy Policy on the
            https://www.louontour.it/ website
          </p>

          <h3>Collection and Use of Your Personal Information</h3>
          <h4>Information We Collect</h4>
          <p>
            When using our Service, you will be prompted to provide us with
            personal information used to contact or identify you.
            https://www.louontour.it/ collects the following information:{" "}
          </p>

          <ul>
            <li>Usage Data</li>
            <li>Name</li>
            <li>Email</li>
          </ul>

          <p>Usage Data includes the following:</p>
          <ul>
            <li>
              Internet Protocol (IP) address of computers accessing the site
            </li>
            <li>Web page requests</li>
            <li>Referring web pages</li>
            <li>Browser used to access site</li>
            <li>Time and date of access</li>
          </ul>

          <h4>How We Collect Information</h4>
          <p>
            https://www.louontour.it/ collects and receives information from you
            in the following manner:{" "}
          </p>
          <ul>
            <li>
              When you fill a registration form or otherwise submit your
              personal information.
            </li>
          </ul>
          <p>
            Your information will be stored for up to 60 days after it is no
            longer required to provide you the services. Your information may be
            retained for longer periods for reporting or record- keeping in
            accordance with applicable laws. Information which does not identify
            you personally may be stored indefinitely.{" "}
          </p>

          <h4>How We Use Your Information</h4>
          <p>
            https://www.louontour.it/ may use your information for the following
            purposes:{" "}
          </p>
          <ul>
            <li>
              <b>Providing and maintaining our Service,</b> as well as
              monitoring the usage of our Service.
            </li>
            <li>
              <b>For other purposes.</b> Luisa will use your information for
              data analysis to identify usage trends or determine the effective
              of our marketing campaigns when reasonable. We will use your
              information to evaluate and improve our Service, products,
              services, and marketing efforts.
            </li>
          </ul>

          <h4>How We Share Your Information</h4>
          <p>
            Luisa will share your information, when applicable, in the following
            situations:{" "}
          </p>
          <ul>
            <li>
              <b>With your consent.</b> Luisa will share your information for
              any purpose with your explicit consent.
            </li>
          </ul>

          <h4>Third-party Sharing</h4>
          <p>
            Any third party we share your information with must disclose the
            purpose for which they intend to use your information. They must
            retain your information only for the duration disclosed when
            requesting or receiving said information. The third-party service
            provider must not further collect, sell, or use your personal
            information except as necessary to perform the specified purpose.{" "}
          </p>
          <p>
            Your information may be shared to a third-party for reasons
            including:
          </p>
          <ul>
            <li>youtube</li>
          </ul>
          <p>
            If you choose to provide such information during registration or
            otherwise, you are giving Luisa permission to use, share, and store
            that information in a manner consistent with this Privacy Policy.{" "}
          </p>

          <p>
            Your information may be disclosed for additional reasons, including:
          </p>
          <ul>
            <li>
              Complying with applicable laws, regulations, or court orders.
            </li>
            <li>
              Responding to claims that your use of our Service violates
              third-party rights.
            </li>
            <li>
              Enforcing agreements you make with us, including this Privacy
              Policy.
            </li>
          </ul>

          <h4>Cookies</h4>
          <p>
            Cookies are small text files that are placed on your computer by
            websites that you visit. Websites use cookies to help users navigate
            efficiently and perform certain functions. Cookies that are required
            for the website to operate properly are allowed to be set without
            your permission. All other cookies need to be approved before they
            can be set in the browser.{" "}
          </p>
          <ul>
            <li>
              <b>Strictly necessary cookies.</b> Strictly necessary cookies
              allow core website functionality such as user login and account
              management. The website cannot be used properly without strictly
              necessary cookies.
            </li>
          </ul>

          <div className="cookie-report-container">
            <p data-cookiereport="true">
              You can change your consent to cookie usage below.{" "}
            </p>
            <Script
              type="text/javascript"
              charset="UTF-8"
              data-cookiescriptreport="report"
              data-cs-lang="en"
              src="//report.cookie-script.com/r/952906ba33559231ca8c72a6268c0ddb.js"
            />
          </div>

          <h4>Security</h4>
          <p>
            Your information’s security is important to us.
            https://www.louontour.it/ utilizes a range of security measures to
            prevent the misuse, loss, or alteration of the information you have
            given us. However, because we cannot guarantee the security of the
            information you provide us, you must access our service at your own
            risk.{" "}
          </p>
          <p>
            Luisa is not responsible for the performance of websites operated by
            third parties or your interactions with them. When you leave this
            website, we recommend you review the privacy practices of other
            websites you interact with and determine the adequacy of those
            practices.{" "}
          </p>

          <h4>Contact Us</h4>
          <p>
            For any questions, please contact us through the following methods:
          </p>
          <p>Name: Luisa Quaglia</p>
          <p>Address: via Podere Segarelli 6, 56045 Pomarance (PI)</p>
          <p>Email: luisaquaglia.tourguide@gmail.com</p>
          <p>Website: https://www.louontour.it/</p>
        </div>
      )}
    </>
  );
};

export default Policy;
