import Link from "next/link";
import { useRouter } from "next/router";
import { MaskText } from "../UI/MaskText";

const MAILCHIMP_ACTION =
  "https://luisaquaglia-tourguide.us14.list-manage.com/subscribe/post?u=23d6ce9b211aa205189c78058&id=5f51338f71&v_id=4764&f_id=0050b7e5f0";

const COPY = {
  it: {
    eyebrow: "Newsletter",
    title: "Iscriviti alla newsletter",
    description:
      "Iscriviti alla newsletter per partecipare ai tour esclusivi dedicati alla mia community più affezionata!",
    emailLabel: "Email Address",
    firstNameLabel: "Nome",
    lastNameLabel: "Cognome",
    gdprTitle: "Informativa GDPR",
    gdprPrompt: "Seleziona per confermare il tuo consenso",
    gdprConsentBeforeLink: "Ho preso visione e accetto",
    gdprConsentLink: "l'informativa sulla privacy",
    gdprConsentAfterLink:
      "e autorizzo il trattamento dei miei dati personali ai sensi del D.Lgs. 196/2003 e del GDPR 679/2016.",
    unsubscribeNotice:
      "Puoi disiscriverti in qualsiasi momento facendo clic sul link nel piè di pagina delle email.",
    mailchimpNotice:
      "Usiamo Mailchimp come piattaforma di marketing. Cliccando su Iscriviti, accetti che i tuoi dati vengano trasferiti a Mailchimp per l'elaborazione.",
    mailchimpLink: "Scopri di più",
    submit: "Iscriviti",
    externalNote:
      "Dopo l'invio si aprirà Mailchimp in una nuova scheda per completare l'iscrizione.",
    required: "campo obbligatorio",
  },
  en: {
    eyebrow: "Newsletter",
    title: "Join the newsletter",
    description:
      "Subscribe to the newsletter to participate in exclusive tours dedicated to my most loyal community!",
    emailLabel: "Email Address",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    gdprTitle: "GDPR notice",
    gdprPrompt: "Select to confirm your consent",
    gdprConsentBeforeLink: "I have read and accept",
    gdprConsentLink: "the privacy policy",
    gdprConsentAfterLink:
      "and I authorize the processing of my personal data under GDPR 679/2016.",
    unsubscribeNotice:
      "You can unsubscribe at any time by clicking the link in the footer of our emails.",
    mailchimpNotice:
      "We use Mailchimp as our marketing platform. By clicking Subscribe, you acknowledge that your information will be transferred to Mailchimp for processing.",
    mailchimpLink: "Learn more",
    submit: "Subscribe",
    externalNote:
      "Mailchimp will open in a new tab after submit so the signup can be completed.",
    required: "required field",
  },
};

const Subscribe = ({ translation, variant = "default" }) => {
  const { locale } = useRouter();
  const content = COPY[locale] || COPY.it;
  const isPageVariant = variant === "page";
  const isFooterVariant = variant === "footer";
  const showIntro = variant !== "footer";

  return (
    <section
      className={`w-full ${
        isFooterVariant
          ? "max-w-3xl p-0"
          : "rounded-xl  bg-[#fffaf6] p-6 shadow-[0_20px_60px_rgba(35,47,55,0.08)] md:p-10"
      } ${isPageVariant ? "max-w-4xl" : ""}`}
    >
      {showIntro ? (
        <div className={isPageVariant ? "mb-8" : "mb-6"}>
          <h1 className="text-sm lg:text-base font-semibold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full lg:max-w-max lg:tracking-wide">
            {content.eyebrow}
          </h1>
          <MaskText>
            <h2
              className={`mb-3 font-semibold leading-tight text-[#c9573c] ${
                isPageVariant ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
              }`}
            >
              {content.title}
            </h2>
          </MaskText>
          <p className="max-w-2xl text-base leading-relaxed text-[#6d7b80] md:text-lg">
            {translation?.paragrafo || content.description}
          </p>
        </div>
      ) : null}

      <form
        action={MAILCHIMP_ACTION}
        method="post"
        target="_blank"
        acceptCharset="UTF-8"
        className={isFooterVariant ? "space-y-4" : "space-y-5"}
      >
        <div
          className={`grid gap-4 ${isFooterVariant ? "" : "md:grid-cols-2"}`}
        >
          <div className={isFooterVariant ? "" : "md:col-span-2"}>
            <label
              htmlFor={`mce-EMAIL-${variant}`}
              className="mb-2 block text-sm font-semibold text-[#2c395b]"
            >
              {content.emailLabel} <span className="text-[#c9573c]">*</span>
            </label>
            <input
              id={`mce-EMAIL-${variant}`}
              type="email"
              name="EMAIL"
              required
              autoComplete="email"
              placeholder="name@email.com"
              className={`w-full px-4 py-3 text-base text-[#232f37] outline-none transition ${
                isFooterVariant
                  ? "rounded-none border-0 border-b border-[#c9573c]/30 bg-transparent px-0 focus:border-[#c9573c] focus:ring-0"
                  : "rounded-lg border border-[#c9573c]/20 bg-white focus:border-[#c9573c] focus:ring-2 focus:ring-[#c9573c]/10"
              }`}
            />
          </div>

          {!isFooterVariant ? (
            <>
              <div>
                <label
                  htmlFor={`mce-FNAME-${variant}`}
                  className="mb-2 block text-sm font-semibold text-[#2c395b]"
                >
                  {content.firstNameLabel}
                </label>
                <input
                  id={`mce-FNAME-${variant}`}
                  type="text"
                  name="FNAME"
                  autoComplete="given-name"
                  className="w-full rounded-lg border border-[#c9573c]/20 bg-white px-4 py-3 text-base text-[#232f37] outline-none transition focus:border-[#c9573c] focus:ring-2 focus:ring-[#c9573c]/10"
                />
              </div>

              <div>
                <label
                  htmlFor={`mce-LNAME-${variant}`}
                  className="mb-2 block text-sm font-semibold text-[#2c395b]"
                >
                  {content.lastNameLabel}
                </label>
                <input
                  id={`mce-LNAME-${variant}`}
                  type="text"
                  name="LNAME"
                  autoComplete="family-name"
                  className="w-full rounded-lg border border-[#c9573c]/20 bg-white px-4 py-3 text-base text-[#232f37] outline-none transition focus:border-[#c9573c] focus:ring-2 focus:ring-[#c9573c]/10"
                />
              </div>
            </>
          ) : null}
        </div>

        <div
          className={`${
            isFooterVariant
              ? "border-0 bg-transparent p-0"
              : "rounded-xl border border-[#c9573c]/10 bg-white/80 p-5"
          }`}
        >
          {!isFooterVariant ? (
            <>
              <p className="mb-1 text-sm font-semibold text-[#2c395b]">
                {content.gdprTitle}
              </p>
              <p className="mb-4 text-sm text-[#6d7b80]">
                {content.gdprPrompt}
              </p>
            </>
          ) : null}

          <label className="flex items-start gap-3 text-sm leading-relaxed text-[#232f37]">
            <input
              type="checkbox"
              id={`gdpr_341504_${variant}`}
              name="gdpr[341504]"
              value="Y"
              required
              className="mt-1 h-4 w-4 rounded border-[#c9573c]/40 text-[#c9573c] focus:ring-[#c9573c]"
            />
            <span>
              {content.gdprConsentBeforeLink}{" "}
              <Link
                href="https://www.iubenda.com/privacy-policy/15052201"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#c9573c] underline underline-offset-4"
              >
                {content.gdprConsentLink}
              </Link>{" "}
              {content.gdprConsentAfterLink}
            </span>
          </label>

          {isFooterVariant ? (
            <p className="mt-3 text-xs leading-relaxed text-[#6d7b80]">
              {content.mailchimpNotice}{" "}
              <Link
                href="https://mailchimp.com/legal/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#c9573c] underline underline-offset-4"
              >
                {content.mailchimpLink}
              </Link>
              .
            </p>
          ) : (
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-[#6d7b80]">
              <p>{content.unsubscribeNotice}</p>
              <p>
                {content.mailchimpNotice}{" "}
                <Link
                  href="https://mailchimp.com/legal/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#c9573c] underline underline-offset-4"
                >
                  {content.mailchimpLink}
                </Link>
                .
              </p>
            </div>
          )}
        </div>

        <div className="hidden">
          <input type="hidden" name="tags" value="40219751" />
        </div>

        <div aria-hidden="true" className="absolute left-[-5000px]">
          <label htmlFor={`b_23d6ce9b211aa205189c78058_5f51338f71_${variant}`}>
            Hidden field
          </label>
          <input
            id={`b_23d6ce9b211aa205189c78058_5f51338f71_${variant}`}
            type="text"
            name="b_23d6ce9b211aa205189c78058_5f51338f71"
            tabIndex={-1}
            defaultValue=""
          />
        </div>

        {isFooterVariant ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-[2px] bg-[#c9573c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b74d33] sm:w-auto"
            >
              {content.submit}
            </button>
            <p className="text-xs leading-relaxed text-[#6d7b80]">
              <span className="font-semibold text-[#c9573c]">*</span>{" "}
              {content.externalNote}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-relaxed text-[#6d7b80]">
              <span className="font-semibold text-[#c9573c]">*</span>{" "}
              {content.required}. {content.externalNote}
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-[2px] bg-[#c9573c] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#b74d33]"
            >
              {content.submit}
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default Subscribe;
