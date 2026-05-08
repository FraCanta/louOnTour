import Link from "next/link";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";

export default function LegalDocumentPage({
  content,
  children,
  primaryAction,
  secondaryLink,
}) {
  const { locale, asPath } = useRouter();
  const pathWithoutLocale = asPath.replace(/^\/en(?=\/|$)/, "") || "/";
  const isExternalSecondaryLink = /^(https?:|mailto:|tel:)/.test(
    secondaryLink?.href || ""
  );

  return (
    <div className="w-full overflow-x-hidden bg-[#fffaf7] text-[#232f37]">
      <section className="relative z-0 border-b border-[#c9573c]/10 bg-[linear-gradient(180deg,#fffaf7_0%,#ffffff_100%)]">
        <div className="mx-auto grid w-11/12 max-w-6xl grid-cols-1 gap-8 py-12 md:py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:py-20">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9573c]">
              {content.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#232f37] md:text-6xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#526066]">
              {content.intro}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {primaryAction ? (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  className="inline-flex items-center gap-2 rounded-[2px] bg-[#c9573c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b74d33]"
                >
                  {primaryAction.icon ? (
                    <Icon icon={primaryAction.icon} width="18" height="18" />
                  ) : null}
                  {primaryAction.label}
                </button>
              ) : null}

              {secondaryLink ? (
                isExternalSecondaryLink ? (
                  <a
                    href={secondaryLink.href}
                    className="inline-flex items-center gap-2 rounded-[2px] border border-[#c9573c]/25 bg-white px-5 py-3 text-sm font-semibold text-[#c9573c] transition hover:bg-[#fff4ef]"
                  >
                    {secondaryLink.icon ? (
                      <Icon icon={secondaryLink.icon} width="18" height="18" />
                    ) : null}
                    {secondaryLink.label}
                  </a>
                ) : (
                  <Link
                    href={secondaryLink.href}
                    className="inline-flex items-center gap-2 rounded-[2px] border border-[#c9573c]/25 bg-white px-5 py-3 text-sm font-semibold text-[#c9573c] transition hover:bg-[#fff4ef]"
                  >
                    {secondaryLink.icon ? (
                      <Icon icon={secondaryLink.icon} width="18" height="18" />
                    ) : null}
                    {secondaryLink.label}
                  </Link>
                )
              ) : null}
            </div>
          </div>

          <aside className="min-w-0 rounded-md border border-[#c9573c]/12 bg-white p-5 shadow-[0_18px_50px_rgba(35,47,55,0.06)]">
            <div className="flex items-start gap-3 border-b border-[#c9573c]/10 pb-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c9573c]/10 text-[#c9573c]">
                <Icon icon="hugeicons:document-validation" width="20" height="20" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9573c]">
                  {content.summaryTitle}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#526066]">
                  {content.updated}
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-4">
              {content.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#77674E]">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 break-words text-sm leading-6 text-[#232f37]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex gap-2 border-t border-[#c9573c]/10 pt-4">
              <Link
                href={pathWithoutLocale}
                locale="it"
                className={`rounded-[2px] px-3 py-2 text-xs font-semibold ${
                  locale === "en"
                    ? "border border-[#c9573c]/20 text-[#c9573c]"
                    : "bg-[#c9573c] text-white"
                }`}
              >
                IT
              </Link>
              <Link
                href={pathWithoutLocale}
                locale="en"
                className={`rounded-[2px] px-3 py-2 text-xs font-semibold ${
                  locale === "en"
                    ? "bg-[#c9573c] text-white"
                    : "border border-[#c9573c]/20 text-[#c9573c]"
                }`}
              >
                EN
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-11/12 max-w-6xl grid-cols-1 gap-8 py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:py-14">
        <aside className="self-start lg:sticky lg:top-24">
          <nav className="rounded-md border border-[#c9573c]/10 bg-white p-4 shadow-[0_16px_40px_rgba(35,47,55,0.04)]">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9573c]">
              {content.indexTitle}
            </p>
            <div className="space-y-1">
              {content.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-[2px] px-3 py-2 text-sm font-medium text-[#526066] transition hover:bg-[#fff4ef] hover:text-[#c9573c]"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <article className="min-w-0 rounded-md border border-[#c9573c]/10 bg-white px-4 py-7 shadow-[0_18px_55px_rgba(35,47,55,0.05)] sm:px-5 md:px-8 md:py-9">
          {children}
        </article>
      </section>
    </div>
  );
}

export function LegalSection({ section }) {
  return (
    <section
      id={section.id}
      className="scroll-mt-28 border-b border-[#c9573c]/10 py-8 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#c9573c]/10 text-[#c9573c]">
          <Icon icon={section.icon || "hugeicons:information-circle"} width="17" height="17" />
        </span>
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold leading-tight text-[#232f37] md:text-3xl">
            {section.title}
          </h2>
          {section.body?.length ? (
            <div className="mt-4 space-y-3 text-base leading-8 text-[#526066]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {section.bullets?.length ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {section.bullets.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-4 text-sm leading-6 text-[#435257]"
            >
              <Icon
                icon="hugeicons:checkmark-circle-02"
                width="18"
                height="18"
                className="mt-1 flex-shrink-0 text-[#c9573c]"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      ) : null}

      {section.table ? <LegalTable table={section.table} /> : null}
    </section>
  );
}

function LegalTable({ table }) {
  return (
    <div className="mt-6 overflow-hidden rounded-md border border-[#c9573c]/10">
      <div
        className="hidden bg-[#232f37] text-xs font-semibold uppercase tracking-[0.16em] text-white md:grid md:[grid-template-columns:var(--legal-table-cols)]"
        style={{ "--legal-table-cols": table.columnsTemplate }}
      >
        {table.columns.map((column) => (
          <div key={column} className="px-4 py-3">
            {column}
          </div>
        ))}
      </div>

      <div className="divide-y divide-[#c9573c]/10">
        {table.rows.map((row) => (
          <div
            key={row.join("-")}
            className="grid grid-cols-1 gap-3 bg-white px-4 py-4 text-sm leading-6 text-[#435257] md:gap-0 md:px-0 md:py-0 md:[grid-template-columns:var(--legal-table-cols)]"
            style={{ "--legal-table-cols": table.columnsTemplate }}
          >
            {row.map((cell, index) => (
              <div
                key={`${cell}-${index}`}
                className="min-w-0 break-words md:border-r md:border-[#c9573c]/10 md:px-4 md:py-4 md:last:border-r-0"
              >
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[#c9573c] md:hidden">
                  {table.columns[index]}
                </span>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
