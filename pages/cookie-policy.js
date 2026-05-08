import Head from "next/head";
import { useRouter } from "next/router";
import LegalDocumentPage, {
  LegalSection,
} from "../components/legal/LegalDocumentPage";
import { openCookiePreferences } from "../utils/cookieConsent";

const CONTENT = {
  it: {
    eyebrow: "Area legale",
    title: "Cookie Policy",
    updated: "Ultimo aggiornamento: 8 maggio 2026",
    summaryTitle: "Documento",
    indexTitle: "In questa pagina",
    intro:
      "Una spiegazione ordinata dei cookie e degli strumenti simili usati dal sito, con categorie, servizi e pulsante per modificare il consenso in ogni momento.",
    facts: [
      { label: "Cookie tecnici", value: "Sempre attivi" },
      { label: "Statistiche", value: "Solo con consenso" },
      { label: "Contenuti esterni", value: "Solo con consenso" },
      { label: "Preferenze", value: "Modificabili in ogni momento" },
    ],
    manage: "Gestisci preferenze",
    otherPolicy: "Vai alla Privacy Policy",
    sections: [
      {
        id: "cosa-sono",
        icon: "hugeicons:cookie",
        title: "Cosa sono cookie e strumenti simili",
        body: [
          "I cookie sono piccoli file salvati sul dispositivo dell'utente. Tecnologie simili, come localStorage, pixel e identificatori, possono memorizzare o leggere informazioni dal dispositivo.",
          "Alcuni strumenti sono necessari al funzionamento del sito; altri, come statistiche e contenuti esterni, vengono usati solo dopo consenso.",
        ],
      },
      {
        id: "categorie",
        icon: "hugeicons:sliders-horizontal",
        title: "Categorie usate dal sito",
        body: [
          "Il banner consente di accettare tutto, rifiutare tutto o scegliere singole categorie. La chiusura senza consenso mantiene attivi solo gli strumenti necessari.",
        ],
        table: {
          columns: ["Categoria", "Stato", "A cosa serve"],
          columnsTemplate: "0.9fr 0.85fr 1.6fr",
          rows: [
            [
              "Necessari",
              "Sempre attivi",
              "Funzionamento del sito, sicurezza, preferenze essenziali, checkout e gestione prenotazioni.",
            ],
            [
              "Statistiche",
              "Solo con consenso",
              "Misurare visite e interazioni aggregate con Google Analytics.",
            ],
            [
              "Contenuti esterni",
              "Solo con consenso",
              "Mostrare widget, recensioni o embed di servizi terzi come Elfsight e Instagram.",
            ],
          ],
        },
      },
      {
        id: "servizi",
        icon: "hugeicons:connect",
        title: "Servizi che possono usare cookie o identificatori",
        body: [
          "Di seguito trovi i principali servizi collegati al sito. I servizi non necessari vengono caricati soltanto dopo la scelta dell'utente.",
        ],
        table: {
          columns: ["Servizio", "Categoria", "Quando viene caricato"],
          columnsTemplate: "0.9fr 1fr 1.55fr",
          rows: [
            ["Preferenze sito", "Necessari", "Sempre, per ricordare lingua e scelte cookie"],
            ["Vercel", "Necessari", "Sempre, per hosting, sicurezza, log tecnici e distribuzione del sito"],
            ["IONOS", "Necessari", "Quando coinvolto in dominio, DNS, email o servizi infrastrutturali collegati"],
            ["Stripe", "Necessari", "Quando l'utente avvia o completa un pagamento"],
            ["Supabase", "Necessari", "Quando il sito legge o salva dati necessari a eventi, admin o prenotazioni"],
            ["Mailchimp", "Newsletter", "Quando l'utente invia volontariamente il modulo newsletter"],
            ["Google Analytics", "Statistiche", "Solo dopo consenso statistiche"],
            ["Elfsight / Instagram", "Contenuti esterni", "Solo dopo consenso contenuti esterni"],
          ],
        },
      },
      {
        id: "analytics",
        icon: "hugeicons:analytics-01",
        title: "Google Analytics",
        body: [
          "Google Analytics aiuta a capire quali pagine vengono visitate e come migliorare il sito. Lo script viene caricato solo dopo il consenso alla categoria Statistiche.",
          "L'implementazione usa l'anonimizzazione IP dove supportata e non avvia il tracciamento prima della scelta dell'utente.",
        ],
      },
      {
        id: "contenuti-esterni",
        icon: "hugeicons:image-02",
        title: "Contenuti esterni",
        body: [
          "Widget, recensioni, social embed e contenuti incorporati possono comportare richieste verso piattaforme esterne. Per questo vengono bloccati finche non viene dato il consenso alla categoria Contenuti esterni.",
        ],
      },
      {
        id: "gestione",
        icon: "hugeicons:settings-02",
        title: "Come modificare il consenso",
        body: [
          "Puoi modificare le scelte in qualsiasi momento dal pulsante in alto in questa pagina o dal link Cookie nel footer. Le preferenze vengono salvate nel browser e valgono per le visite successive dallo stesso dispositivo.",
        ],
        bullets: [
          "Accetta tutto: abilita statistiche e contenuti esterni.",
          "Rifiuta: mantiene solo gli strumenti necessari.",
          "Personalizza: consente di attivare o disattivare le singole categorie.",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Legal area",
    title: "Cookie Policy",
    updated: "Last updated: May 8, 2026",
    summaryTitle: "Document",
    indexTitle: "On this page",
    intro:
      "A clear overview of cookies and similar tools used by the website, with categories, services and a button to change consent at any time.",
    facts: [
      { label: "Technical cookies", value: "Always active" },
      { label: "Analytics", value: "Consent only" },
      { label: "External content", value: "Consent only" },
      { label: "Preferences", value: "Editable at any time" },
    ],
    manage: "Manage preferences",
    otherPolicy: "Go to Privacy Policy",
    sections: [
      {
        id: "what-they-are",
        icon: "hugeicons:cookie",
        title: "What cookies and similar tools are",
        body: [
          "Cookies are small files stored on the user's device. Similar technologies, such as localStorage, pixels and identifiers, may store or read information from the device.",
          "Some tools are required for the website to work; others, such as analytics and external content, are used only after consent.",
        ],
      },
      {
        id: "categories",
        icon: "hugeicons:sliders-horizontal",
        title: "Categories used by the website",
        body: [
          "The banner allows users to accept all, reject all or choose individual categories. Closing without consent keeps only necessary tools active.",
        ],
        table: {
          columns: ["Category", "Status", "Purpose"],
          columnsTemplate: "0.9fr 0.85fr 1.6fr",
          rows: [
            ["Necessary", "Always active", "Website operation, security, essential preferences, checkout and booking management."],
            ["Analytics", "Consent only", "Measure visits and aggregate interactions with Google Analytics."],
            ["External content", "Consent only", "Display widgets, reviews or third-party embeds such as Elfsight and Instagram."],
          ],
        },
      },
      {
        id: "services",
        icon: "hugeicons:connect",
        title: "Services that may use cookies or identifiers",
        body: [
          "Below are the main services connected to the website. Non-essential services are loaded only after the user's choice.",
        ],
        table: {
          columns: ["Service", "Category", "When it loads"],
          columnsTemplate: "0.9fr 1fr 1.55fr",
          rows: [
            ["Website preferences", "Necessary", "Always, to remember language and cookie choices"],
            ["Vercel", "Necessary", "Always, for hosting, security, technical logs and website delivery"],
            ["IONOS", "Necessary", "When involved in domain, DNS, email or connected infrastructure services"],
            ["Stripe", "Necessary", "When the user starts or completes a payment"],
            ["Supabase", "Necessary", "When the website reads or saves data required for events, admin or bookings"],
            ["Mailchimp", "Newsletter", "When the user voluntarily submits the newsletter form"],
            ["Google Analytics", "Analytics", "Only after analytics consent"],
            ["Elfsight / Instagram", "External content", "Only after external content consent"],
          ],
        },
      },
      {
        id: "analytics",
        icon: "hugeicons:analytics-01",
        title: "Google Analytics",
        body: [
          "Google Analytics helps understand which pages are visited and how to improve the website. The script loads only after consent to the Analytics category.",
          "The implementation uses IP anonymisation where supported and does not start tracking before the user's choice.",
        ],
      },
      {
        id: "external-content",
        icon: "hugeicons:image-02",
        title: "External content",
        body: [
          "Widgets, reviews, social embeds and embedded content may involve requests to external platforms. For this reason they are blocked until the user consents to the External content category.",
        ],
      },
      {
        id: "management",
        icon: "hugeicons:settings-02",
        title: "How to change consent",
        body: [
          "You can change your choices at any time using the button at the top of this page or the Cookie link in the footer. Preferences are stored in the browser and apply to later visits from the same device.",
        ],
        bullets: [
          "Accept all: enables analytics and external content.",
          "Reject: keeps only necessary tools active.",
          "Customize: allows each category to be enabled or disabled.",
        ],
      },
    ],
  },
};

export default function CookiePolicy() {
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
        primaryAction={{
          label: content.manage,
          icon: "hugeicons:settings-02",
          onClick: openCookiePreferences,
        }}
        secondaryLink={{
          href: "/privacy-policy",
          label: content.otherPolicy,
          icon: "hugeicons:document-validation",
        }}
      >
        {content.sections.map((section) => (
          <LegalSection key={section.id} section={section} />
        ))}
      </LegalDocumentPage>
    </>
  );
}
