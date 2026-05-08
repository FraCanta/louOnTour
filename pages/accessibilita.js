import Head from "next/head";
import { useRouter } from "next/router";
import LegalDocumentPage, {
  LegalSection,
} from "../components/legal/LegalDocumentPage";
import { openAccessibilityPreferences } from "../utils/accessibilityPreferences";

const CONTENT = {
  it: {
    eyebrow: "Area legale",
    title: "Accessibilita",
    updated: "Ultimo aggiornamento: 8 maggio 2026",
    summaryTitle: "Documento",
    indexTitle: "In questa pagina",
    intro:
      "Questa pagina raccoglie l'impegno del sito per rendere navigazione, contenuti, moduli e acquisti piu accessibili, con strumenti immediati e un canale di feedback.",
    facts: [
      { label: "Titolare", value: "Luisa Quaglia Tour Guide" },
      { label: "Riferimento tecnico", value: "WCAG 2.2, livello AA come obiettivo" },
      { label: "Normativa", value: "European Accessibility Act e D.Lgs. 82/2022" },
      { label: "Feedback", value: "luisaquaglia.tourguide@gmail.com" },
    ],
    openTools: "Apri strumenti",
    contact: "Segnala un problema",
    sections: [
      {
        id: "impegno",
        icon: "hugeicons:accessibility",
        title: "Impegno del sito",
        body: [
          "Il sito e stato aggiornato con l'obiettivo di migliorare l'accessibilita reale dell'esperienza: lettura dei contenuti, navigazione da tastiera, gestione del consenso, pagina legale e percorso di acquisto.",
          "Il pulsante di accessibilita e un supporto utile, ma non sostituisce il lavoro sul codice, sui contenuti e sui flussi. Per questo la pagina indica anche controlli e limiti noti.",
        ],
      },
      {
        id: "strumenti",
        icon: "hugeicons:settings-02",
        title: "Strumenti disponibili",
        body: [
          "Il sito include un pannello fisso di accessibilita, separato dal banner cookie, che consente di modificare alcune preferenze di visualizzazione e di salvarle nel browser.",
        ],
        bullets: [
          "Testo piu grande per rendere piu leggibili titoli, schede e pagine legali.",
          "Contrasto elevato per aumentare la distinzione tra testo, sfondi e controlli.",
          "Link sottolineati per riconoscere piu facilmente gli elementi cliccabili.",
          "Font piu leggibile per chi preferisce caratteri di sistema senza grazie.",
          "Riduzione delle animazioni, anche in combinazione con le preferenze del dispositivo.",
          "Link Salta al contenuto per raggiungere direttamente la pagina con la tastiera.",
        ],
      },
      {
        id: "aree",
        icon: "hugeicons:task-done-01",
        title: "Aree del sito controllate",
        body: [
          "Gli interventi sono pensati soprattutto per le parti che contano di piu per una persona che deve informarsi, contattare Luisa o acquistare un tour.",
        ],
        table: {
          columns: ["Area", "Cosa viene curato", "Stato"],
          columnsTemplate: "0.9fr 1.5fr 0.9fr",
          rows: [
            ["Navigazione", "Menu, footer, link legali, focus visibile e accesso da tastiera", "In miglioramento"],
            ["Privacy e cookie", "Banner consenso, preferenze modificabili e pagine leggibili su mobile", "Aggiornato"],
            ["Prenotazioni e acquisti", "Accettazione termini, errori chiari e checkout Stripe esterno", "Aggiornato"],
            ["Contenuti esterni", "Widget e contenuti social caricati solo dopo consenso", "Aggiornato"],
            ["Contenuti editoriali", "Testi, immagini e contenuti importati dal blog", "Da verificare nel tempo"],
          ],
        },
      },
      {
        id: "limiti",
        icon: "hugeicons:alert-02",
        title: "Limiti noti",
        body: [
          "Alcune parti possono dipendere da servizi esterni o da contenuti caricati nel tempo. In questi casi il sito prova a ridurre gli ostacoli, ma la piena accessibilita puo richiedere controlli manuali periodici.",
        ],
        bullets: [
          "Embed, recensioni e contenuti social possono avere comportamenti definiti dalle piattaforme terze.",
          "Immagini storiche e contenuti importati dal blog possono richiedere revisione dei testi alternativi.",
          "Eventuali documenti PDF o allegati devono essere controllati separatamente.",
          "Le impostazioni del pannello migliorano la fruizione, ma non certificano da sole la conformita normativa.",
        ],
      },
      {
        id: "feedback",
        icon: "hugeicons:mail-01",
        title: "Feedback e richieste",
        body: [
          "Se incontri una barriera, un testo non leggibile, un controllo non raggiungibile da tastiera o un problema durante una prenotazione, puoi scrivere a luisaquaglia.tourguide@gmail.com.",
          "Nel messaggio e utile indicare la pagina visitata, il dispositivo, il browser usato e una breve descrizione del problema. Le segnalazioni aiutano a correggere il sito con priorita.",
        ],
      },
      {
        id: "riferimenti",
        icon: "hugeicons:legal-01",
        title: "Riferimenti",
        body: [
          "Il lavoro prende come riferimento le WCAG e gli orientamenti pubblici su accessibilita digitale. Per aspetti legali specifici e opportuno validare il testo con un consulente o con un audit dedicato.",
        ],
        table: {
          columns: ["Riferimento", "Uso nel sito", "Nota"],
          columnsTemplate: "1fr 1.35fr 1.1fr",
          rows: [
            ["WCAG 2.2 AA", "Criteri tecnici per percepibilita, operabilita, comprensibilita e robustezza", "Obiettivo tecnico"],
            ["European Accessibility Act", "Contesto normativo europeo per prodotti e servizi accessibili", "In vigore dal 28 giugno 2025"],
            ["D.Lgs. 82/2022", "Recepimento italiano della direttiva europea", "Da valutare in base al servizio offerto"],
            ["AgID", "Linee guida e indicazioni per dichiarazioni e requisiti", "Fonte istituzionale italiana"],
          ],
        },
      },
    ],
  },
  en: {
    eyebrow: "Legal area",
    title: "Accessibility",
    updated: "Last updated: May 8, 2026",
    summaryTitle: "Document",
    indexTitle: "On this page",
    intro:
      "This page describes the website's commitment to making navigation, content, forms and purchases more accessible, with immediate tools and a feedback channel.",
    facts: [
      { label: "Owner", value: "Luisa Quaglia Tour Guide" },
      { label: "Technical reference", value: "WCAG 2.2, AA level as target" },
      { label: "Regulatory context", value: "European Accessibility Act and Italian Legislative Decree 82/2022" },
      { label: "Feedback", value: "luisaquaglia.tourguide@gmail.com" },
    ],
    openTools: "Open tools",
    contact: "Report an issue",
    sections: [
      {
        id: "commitment",
        icon: "hugeicons:accessibility",
        title: "Website commitment",
        body: [
          "The website has been updated with the aim of improving real accessibility across content reading, keyboard navigation, consent management, legal pages and the purchase flow.",
          "The accessibility button is a useful support, but it does not replace work on code, content and user flows. For this reason the page also lists checks and known limits.",
        ],
      },
      {
        id: "tools",
        icon: "hugeicons:settings-02",
        title: "Available tools",
        body: [
          "The website includes a fixed accessibility panel, separate from the cookie banner, that lets visitors change display preferences and save them in the browser.",
        ],
        bullets: [
          "Larger text to make headings, cards and legal pages easier to read.",
          "High contrast to improve separation between text, backgrounds and controls.",
          "Underlined links to make clickable elements easier to recognise.",
          "A more readable system font for visitors who prefer sans-serif text.",
          "Reduced motion, also combined with the device's motion preferences.",
          "Skip to content link for direct keyboard access to the page content.",
        ],
      },
      {
        id: "areas",
        icon: "hugeicons:task-done-01",
        title: "Checked website areas",
        body: [
          "The work focuses on the areas that matter most for someone who needs information, wants to contact Luisa or wants to book a tour.",
        ],
        table: {
          columns: ["Area", "What is covered", "Status"],
          columnsTemplate: "0.9fr 1.5fr 0.9fr",
          rows: [
            ["Navigation", "Menu, footer, legal links, visible focus and keyboard access", "Improving"],
            ["Privacy and cookies", "Consent banner, editable preferences and mobile-readable pages", "Updated"],
            ["Bookings and purchases", "Terms acceptance, clear errors and external Stripe checkout", "Updated"],
            ["External content", "Widgets and social content loaded only after consent", "Updated"],
            ["Editorial content", "Texts, images and content imported from the blog", "To review over time"],
          ],
        },
      },
      {
        id: "limits",
        icon: "hugeicons:alert-02",
        title: "Known limits",
        body: [
          "Some areas depend on external services or content added over time. In those cases the website tries to reduce barriers, but full accessibility may require periodic manual checks.",
        ],
        bullets: [
          "Embeds, reviews and social content may have behaviours defined by third-party platforms.",
          "Older images and blog imports may require review of alternative text.",
          "Any PDF documents or attachments should be checked separately.",
          "Panel settings improve use, but do not certify legal compliance by themselves.",
        ],
      },
      {
        id: "feedback",
        icon: "hugeicons:mail-01",
        title: "Feedback and requests",
        body: [
          "If you find a barrier, unreadable text, a control that cannot be reached by keyboard or an issue during booking, contact luisaquaglia.tourguide@gmail.com.",
          "Please include the page, device, browser and a short description of the issue. Reports help prioritise improvements.",
        ],
      },
      {
        id: "references",
        icon: "hugeicons:legal-01",
        title: "References",
        body: [
          "The work uses WCAG and public accessibility guidance as references. Specific legal aspects should be validated with a consultant or a dedicated accessibility audit.",
        ],
        table: {
          columns: ["Reference", "Use on the website", "Note"],
          columnsTemplate: "1fr 1.35fr 1.1fr",
          rows: [
            ["WCAG 2.2 AA", "Technical criteria for perceivable, operable, understandable and robust experiences", "Technical target"],
            ["European Accessibility Act", "European regulatory context for accessible products and services", "Applies from June 28, 2025"],
            ["Italian Legislative Decree 82/2022", "Italian implementation of the European directive", "To assess based on the offered service"],
            ["AgID", "Guidelines and information on statements and requirements", "Italian institutional source"],
          ],
        },
      },
    ],
  },
};

export default function AccessibilityPage() {
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
          label: content.openTools,
          icon: "hugeicons:settings-02",
          onClick: openAccessibilityPreferences,
        }}
        secondaryLink={{
          href: "mailto:luisaquaglia.tourguide@gmail.com",
          label: content.contact,
          icon: "hugeicons:mail-01",
        }}
      >
        {content.sections.map((section) => (
          <LegalSection key={section.id} section={section} />
        ))}
      </LegalDocumentPage>
    </>
  );
}
