import Head from "next/head";
import { useRouter } from "next/router";
import LegalDocumentPage, {
  LegalSection,
} from "../components/legal/LegalDocumentPage";

const CONTENT = {
  it: {
    eyebrow: "Area legale",
    title: "Termini e condizioni",
    updated: "Ultimo aggiornamento: 8 maggio 2026",
    summaryTitle: "Acquisti e prenotazioni",
    indexTitle: "In questa pagina",
    intro:
      "Queste condizioni regolano la prenotazione e l'acquisto online dei tour e degli eventi proposti da Luisa Quaglia Tour Guide.",
    facts: [
      { label: "Professionista", value: "Luisa Quaglia Tour Guide" },
      { label: "Partita IVA", value: "02436070508" },
      { label: "Contatto", value: "luisaquaglia.tourguide@gmail.com" },
      { label: "Pagamenti", value: "Stripe" },
    ],
    otherPolicy: "Vai alla Privacy Policy",
    sections: [
      {
        id: "oggetto",
        icon: "hugeicons:ticket-01",
        title: "Oggetto del servizio",
        body: [
          "I servizi offerti consistono in visite guidate, tour culturali, eventi e attivita correlate, secondo le descrizioni pubblicate nelle relative pagine del sito.",
          "Le caratteristiche essenziali del servizio, durata, luogo di incontro, lingua, prezzo, disponibilita e data sono indicate nella pagina dell'evento o del tour prima dell'acquisto.",
        ],
      },
      {
        id: "prenotazione",
        icon: "hugeicons:calendar-03",
        title: "Prenotazione e conferma",
        body: [
          "La prenotazione online si considera ricevuta quando il pagamento viene completato correttamente tramite Stripe e il sistema registra la sessione di pagamento.",
          "Dopo il pagamento, l'utente ricevera le informazioni operative disponibili per partecipare al tour. In caso di problemi tecnici o dati incompleti, Luisa Quaglia Tour Guide potra contattare l'utente all'email indicata in fase di pagamento.",
        ],
      },
      {
        id: "prezzi",
        icon: "hugeicons:credit-card",
        title: "Prezzi e pagamenti",
        body: [
          "I prezzi sono indicati in euro, salvo diversa indicazione nella pagina dell'evento. Il pagamento online e gestito da Stripe; il sito non conserva i dati completi della carta.",
          "Eventuali commissioni, imposte o costi specifici sono indicati quando applicabili prima della conclusione dell'acquisto.",
        ],
      },
      {
        id: "recesso",
        icon: "hugeicons:refund-02",
        title: "Cancellazioni, recesso e rimborsi",
        body: [
          "Per servizi legati a una data o a un periodo specifico, come tour ed eventi programmati, il diritto di recesso puo essere escluso nei casi previsti dalla normativa applicabile.",
          "Eventuali richieste di modifica, cancellazione o rimborso devono essere inviate a luisaquaglia.tourguide@gmail.com. Quando possibile, le richieste saranno gestite tenendo conto della data del tour, dei posti disponibili e delle spese gia sostenute.",
          "Se un tour viene annullato dall'organizzazione, l'utente ricevera una proposta di nuova data o il rimborso dell'importo pagato, salvo diversi accordi.",
        ],
      },
      {
        id: "partecipazione",
        icon: "hugeicons:user-group",
        title: "Partecipazione al tour",
        body: [
          "Il partecipante deve presentarsi puntuale nel luogo di incontro indicato e seguire le istruzioni organizzative ricevute.",
          "Ritardi, mancata presentazione o informazioni errate fornite dall'utente possono impedire la partecipazione senza diritto automatico al rimborso.",
        ],
      },
      {
        id: "responsabilita",
        icon: "hugeicons:shield-01",
        title: "Responsabilita",
        body: [
          "Luisa Quaglia Tour Guide si impegna a svolgere il servizio con professionalita e cura. L'utente resta responsabile dei propri effetti personali, della propria condotta e del rispetto delle regole dei luoghi visitati.",
          "Il programma puo subire variazioni per cause organizzative, meteo, sicurezza, accessibilita dei luoghi o eventi indipendenti dalla volonta dell'organizzazione.",
        ],
      },
      {
        id: "legge",
        icon: "hugeicons:legal-01",
        title: "Legge applicabile e contatti",
        body: [
          "Le presenti condizioni sono regolate dalla legge italiana. Per qualsiasi richiesta relativa ad acquisti, prenotazioni o condizioni di servizio puoi scrivere a luisaquaglia.tourguide@gmail.com.",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Legal area",
    title: "Terms and conditions",
    updated: "Last updated: May 8, 2026",
    summaryTitle: "Purchases and bookings",
    indexTitle: "On this page",
    intro:
      "These terms govern online bookings and purchases for tours and events offered by Luisa Quaglia Tour Guide.",
    facts: [
      { label: "Professional", value: "Luisa Quaglia Tour Guide" },
      { label: "VAT no.", value: "02436070508" },
      { label: "Contact", value: "luisaquaglia.tourguide@gmail.com" },
      { label: "Payments", value: "Stripe" },
    ],
    otherPolicy: "Go to Privacy Policy",
    sections: [
      {
        id: "service",
        icon: "hugeicons:ticket-01",
        title: "Service",
        body: [
          "The services consist of guided visits, cultural tours, events and related activities, as described on the relevant website pages.",
          "The main service features, duration, meeting point, language, price, availability and date are shown on the event or tour page before purchase.",
        ],
      },
      {
        id: "booking",
        icon: "hugeicons:calendar-03",
        title: "Booking and confirmation",
        body: [
          "Online booking is considered received when payment is successfully completed through Stripe and the system records the payment session.",
          "After payment, the user will receive the available operational information to attend the tour. In case of technical issues or incomplete data, Luisa Quaglia Tour Guide may contact the user at the email address used during payment.",
        ],
      },
      {
        id: "prices",
        icon: "hugeicons:credit-card",
        title: "Prices and payments",
        body: [
          "Prices are shown in euros unless otherwise stated on the event page. Online payments are handled by Stripe; the website does not store full card details.",
          "Any applicable fees, taxes or specific costs are shown before purchase completion where relevant.",
        ],
      },
      {
        id: "withdrawal",
        icon: "hugeicons:refund-02",
        title: "Cancellations, withdrawal and refunds",
        body: [
          "For services connected to a specific date or period, such as scheduled tours and events, the right of withdrawal may be excluded where allowed by applicable law.",
          "Modification, cancellation or refund requests must be sent to luisaquaglia.tourguide@gmail.com. Where possible, requests will be handled considering the tour date, available seats and costs already incurred.",
          "If a tour is cancelled by the organiser, the user will be offered a new date or a refund of the amount paid, unless otherwise agreed.",
        ],
      },
      {
        id: "attendance",
        icon: "hugeicons:user-group",
        title: "Attendance",
        body: [
          "Participants must arrive on time at the indicated meeting point and follow the organisational instructions received.",
          "Delays, no-shows or incorrect information provided by the user may prevent participation without an automatic right to a refund.",
        ],
      },
      {
        id: "liability",
        icon: "hugeicons:shield-01",
        title: "Liability",
        body: [
          "Luisa Quaglia Tour Guide undertakes to provide the service professionally and carefully. Users remain responsible for their personal belongings, conduct and compliance with the rules of the places visited.",
          "The programme may change due to organisational reasons, weather, safety, accessibility of locations or events outside the organiser's control.",
        ],
      },
      {
        id: "law",
        icon: "hugeicons:legal-01",
        title: "Applicable law and contact",
        body: [
          "These terms are governed by Italian law. For any request concerning purchases, bookings or service terms, contact luisaquaglia.tourguide@gmail.com.",
        ],
      },
    ],
  },
};

export default function TermsPage() {
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
