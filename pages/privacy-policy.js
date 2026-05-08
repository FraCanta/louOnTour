import Head from "next/head";
import { useRouter } from "next/router";
import LegalDocumentPage, {
  LegalSection,
} from "../components/legal/LegalDocumentPage";

const CONTENT = {
  it: {
    eyebrow: "Area legale",
    title: "Privacy Policy",
    updated: "Ultimo aggiornamento: 8 maggio 2026",
    summaryTitle: "Documento",
    indexTitle: "In questa pagina",
    intro:
      "Qui trovi, in modo chiaro, come vengono trattati i dati personali quando navighi il sito, chiedi informazioni, ti iscrivi alla newsletter o prenoti un tour.",
    facts: [
      { label: "Titolare", value: "Luisa Quaglia Tour Guide" },
      { label: "Partita IVA", value: "02436070508" },
      { label: "Contatto", value: "luisaquaglia.tourguide@gmail.com" },
      { label: "Sito", value: "luisaquaglia-tourguide.com" },
    ],
    otherPolicy: "Vai alla Cookie Policy",
    sections: [
      {
        id: "titolare",
        icon: "hugeicons:user-account",
        title: "Titolare del trattamento",
        body: [
          "Il titolare del trattamento e Luisa Quaglia Tour Guide, P. IVA 02436070508. Per domande, richieste o esercizio dei diritti puoi scrivere a luisaquaglia.tourguide@gmail.com.",
        ],
      },
      {
        id: "dati",
        icon: "hugeicons:database",
        title: "Quali dati trattiamo",
        body: [
          "Trattiamo solo i dati necessari per rispondere alle richieste, gestire prenotazioni, inviare comunicazioni richieste dall'utente e mantenere sicuro il sito.",
        ],
        bullets: [
          "Dati di contatto: nome, cognome, email, messaggi e preferenze indicate nei moduli.",
          "Dati di prenotazione: tour scelto, data, numero e nomi dei partecipanti, note operative.",
          "Dati tecnici: IP, log, preferenze cookie, dati di sicurezza e informazioni di navigazione.",
          "Dati di pagamento: riferimenti Stripe, importo, valuta, stato pagamento ed email cliente. I dati completi della carta non sono salvati sul sito.",
        ],
      },
      {
        id: "finalita",
        icon: "hugeicons:task-01",
        title: "Finalita e basi giuridiche",
        body: [
          "Ogni trattamento ha una finalita precisa e una base giuridica prevista dal GDPR.",
        ],
        table: {
          columns: ["Finalita", "Base giuridica", "Esempi"],
          columnsTemplate: "1.25fr 1fr 1.35fr",
          rows: [
            [
              "Rispondere a richieste e messaggi",
              "Misure precontrattuali o legittimo interesse",
              "Email, form contatto, richieste informazioni sui tour",
            ],
            [
              "Gestire prenotazioni e pagamenti",
              "Contratto o misure precontrattuali",
              "Checkout Stripe, conferme, disponibilita posti",
            ],
            [
              "Inviare newsletter",
              "Consenso",
              "Comunicazioni promozionali e aggiornamenti sui tour",
            ],
            [
              "Adempimenti fiscali e contabili",
              "Obbligo di legge",
              "Documentazione amministrativa e dati necessari alla contabilita",
            ],
            [
              "Statistiche e contenuti esterni",
              "Consenso",
              "Google Analytics, widget e contenuti incorporati non necessari",
            ],
          ],
        },
      },
      {
        id: "servizi",
        icon: "hugeicons:share-08",
        title: "Servizi esterni usati dal sito",
        body: [
          "Il sito usa fornitori tecnici e infrastrutturali per erogare servizi specifici. Alcuni agiscono come responsabili del trattamento, altri come autonomi titolari secondo le proprie informative.",
        ],
        table: {
          columns: ["Servizio", "Uso", "Dati coinvolti"],
          columnsTemplate: "0.85fr 1.25fr 1.45fr",
          rows: [
            ["Vercel", "Hosting, deploy e infrastruttura web", "Dati tecnici, log, indirizzo IP e informazioni necessarie alla sicurezza del sito"],
            ["IONOS", "Dominio, DNS, email o servizi infrastrutturali collegati", "Dati tecnici, dati di contatto e informazioni necessarie alla gestione del dominio o delle comunicazioni"],
            ["Supabase", "Database e backend", "Prenotazioni, dati tecnici, log applicativi"],
            ["Stripe", "Pagamenti online", "Sessione pagamento, importo, email cliente, stato pagamento"],
            ["Mailchimp", "Newsletter", "Email, nome, cognome e consenso marketing"],
            ["Google Analytics", "Statistiche sito", "Dati di navigazione aggregati, caricati solo dopo consenso"],
            ["Elfsight e Instagram", "Widget e contenuti incorporati", "Dati tecnici e identificatori secondo le informative dei servizi"],
            ["Gmail/Nodemailer", "Comunicazioni email", "Dati necessari a inviare e ricevere messaggi"],
          ],
        },
      },
      {
        id: "conservazione",
        icon: "hugeicons:archive-02",
        title: "Conservazione",
        body: [
          "I dati sono conservati per il tempo necessario alla finalita per cui sono raccolti e, quando applicabile, per rispettare obblighi fiscali, contabili o legali.",
        ],
        bullets: [
          "Richieste di contatto: per il tempo necessario a rispondere e gestire la conversazione.",
          "Prenotazioni e pagamenti: per la gestione del servizio e gli obblighi amministrativi.",
          "Newsletter: fino a revoca del consenso o cancellazione dalla lista.",
          "Preferenze cookie: salvate nel browser per ricordare le scelte dell'utente.",
        ],
      },
      {
        id: "trasferimenti",
        icon: "hugeicons:global",
        title: "Trasferimenti fuori dallo SEE",
        body: [
          "Alcuni fornitori possono trattare dati fuori dallo Spazio Economico Europeo. In questi casi il trasferimento avviene sulla base degli strumenti previsti dal GDPR, come decisioni di adeguatezza, clausole contrattuali standard o misure equivalenti adottate dai fornitori.",
        ],
      },
      {
        id: "diritti",
        icon: "hugeicons:legal-01",
        title: "Diritti dell'utente",
        body: [
          "Puoi chiedere accesso, rettifica, cancellazione, limitazione, opposizione, portabilita dei dati e revoca del consenso. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali.",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Legal area",
    title: "Privacy Policy",
    updated: "Last updated: May 8, 2026",
    summaryTitle: "Document",
    indexTitle: "On this page",
    intro:
      "This page explains how personal data is processed when you browse the website, send a request, join the newsletter or book a tour.",
    facts: [
      { label: "Controller", value: "Luisa Quaglia Tour Guide" },
      { label: "VAT no.", value: "02436070508" },
      { label: "Contact", value: "luisaquaglia.tourguide@gmail.com" },
      { label: "Website", value: "luisaquaglia-tourguide.com" },
    ],
    otherPolicy: "Go to Cookie Policy",
    sections: [
      {
        id: "controller",
        icon: "hugeicons:user-account",
        title: "Data controller",
        body: [
          "The data controller is Luisa Quaglia Tour Guide, VAT no. 02436070508. For questions, requests or to exercise your rights, contact luisaquaglia.tourguide@gmail.com.",
        ],
      },
      {
        id: "data",
        icon: "hugeicons:database",
        title: "Data we process",
        body: [
          "We process only the data needed to reply to requests, manage bookings, send requested communications and keep the website secure.",
        ],
        bullets: [
          "Contact data: name, surname, email, messages and preferences entered in forms.",
          "Booking data: selected tour, date, number and names of attendees, operational notes.",
          "Technical data: IP, logs, cookie preferences, security data and browsing information.",
          "Payment data: Stripe references, amount, currency, payment status and customer email. Full card details are not stored on the website.",
        ],
      },
      {
        id: "purposes",
        icon: "hugeicons:task-01",
        title: "Purposes and legal bases",
        body: [
          "Each processing activity has a specific purpose and a legal basis under the GDPR.",
        ],
        table: {
          columns: ["Purpose", "Legal basis", "Examples"],
          columnsTemplate: "1.25fr 1fr 1.35fr",
          rows: [
            ["Replying to requests", "Pre-contractual steps or legitimate interest", "Email, contact forms, tour enquiries"],
            ["Managing bookings and payments", "Contract or pre-contractual steps", "Stripe checkout, confirmations, seat availability"],
            ["Sending newsletters", "Consent", "Promotional messages and tour updates"],
            ["Tax and accounting duties", "Legal obligation", "Administrative documents and accounting data"],
            ["Analytics and external content", "Consent", "Google Analytics, widgets and non-essential embedded content"],
          ],
        },
      },
      {
        id: "services",
        icon: "hugeicons:share-08",
        title: "External services",
        body: [
          "The website uses technical and infrastructure providers for specific services. Some act as processors, others as independent controllers under their own notices.",
        ],
        table: {
          columns: ["Service", "Use", "Data involved"],
          columnsTemplate: "0.85fr 1.25fr 1.45fr",
          rows: [
            ["Vercel", "Hosting, deployment and web infrastructure", "Technical data, logs, IP address and information required for website security"],
            ["IONOS", "Domain, DNS, email or connected infrastructure services", "Technical data, contact data and information required to manage the domain or communications"],
            ["Supabase", "Database and backend", "Bookings, technical data, application logs"],
            ["Stripe", "Online payments", "Payment session, amount, customer email, payment status"],
            ["Mailchimp", "Newsletter", "Email, name, surname and marketing consent"],
            ["Google Analytics", "Website statistics", "Aggregate browsing data, loaded only after consent"],
            ["Elfsight and Instagram", "Widgets and embedded content", "Technical data and identifiers according to each service notice"],
            ["Gmail/Nodemailer", "Email communications", "Data required to send and receive messages"],
          ],
        },
      },
      {
        id: "retention",
        icon: "hugeicons:archive-02",
        title: "Retention",
        body: [
          "Data is kept for the time required by the purpose for which it was collected and, where applicable, to comply with tax, accounting or legal obligations.",
        ],
        bullets: [
          "Contact requests: for the time needed to reply and manage the conversation.",
          "Bookings and payments: for service management and administrative obligations.",
          "Newsletter: until consent is withdrawn or the user unsubscribes.",
          "Cookie preferences: stored in the browser to remember the user's choices.",
        ],
      },
      {
        id: "transfers",
        icon: "hugeicons:global",
        title: "Transfers outside the EEA",
        body: [
          "Some providers may process data outside the European Economic Area. In these cases, transfers rely on GDPR tools such as adequacy decisions, standard contractual clauses or equivalent safeguards adopted by the providers.",
        ],
      },
      {
        id: "rights",
        icon: "hugeicons:legal-01",
        title: "Your rights",
        body: [
          "You may request access, rectification, erasure, restriction, objection, portability and withdrawal of consent. You may also lodge a complaint with the Italian Data Protection Authority.",
        ],
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const { locale } = useRouter();
  const content = CONTENT[locale] || CONTENT.it;

  return (
    <>
      <Head>
        <title>{content.title} | Luisa Quaglia Tour Guide</title>
        <meta name="description" content={content.intro} />
      </Head>

      <LegalDocumentPage
        content={content}
        secondaryLink={{
          href: "/cookie-policy",
          label: content.otherPolicy,
          icon: "hugeicons:cookie",
        }}
      >
        {content.sections.map((section) => (
          <LegalSection key={section.id} section={section} />
        ))}
      </LegalDocumentPage>
    </>
  );
}
