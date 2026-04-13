import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getDate } from "../../utils/utils";
import { Icon } from "@iconify/react";

export default function Post({ post, featuredMedia }) {
  const [minutiLettura, setMinutiLettura] = useState(0);

  function calcolaMinutiLettura(testo, velocitaLetturaMedia) {
    const parole = testo.split(" ").filter(Boolean).length;
    return Math.ceil(parole / velocitaLetturaMedia);
  }

  useEffect(() => {
    const testoSenzaTag =
      post?.content?.rendered?.replace(/(<([^>]+)>)/gi, "") || "";
    setMinutiLettura(calcolaMinutiLettura(testoSenzaTag, 250));
  }, [post]);

  return (
    <Link href={`/posts/${post?.slug}`} title={post?.title?.rendered}>
      <article className="relative flex flex-col h-full gap-4">
        {/* IMAGE */}

        <figure>
          <Image
            src={featuredMedia?.media_details?.sizes?.full?.source_url}
            width={461}
            height={420}
            alt={featuredMedia?.alt_text || ""}
            className="object-cover rounded-sm aspect-square"
            priority
            quality={70}
          />
        </figure>

        {/* CONTENT */}
        <div className="absolute inset-0 bg-[linear-gradient(359.99deg,rgba(119,103,78,1)_1.62%,rgba(119,103,78,0)_65.37%)]"></div>
        {/* Titolo */}
        <div className="absolute left-0 flex items-center justify-center w-full p-4 bottom-6 lg:bottom-6">
          <h3
            className="text-2xl font-bold text-center text-white 2xl:text-4xl fxl:text-3xl"
            dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}
          />
        </div>
      </article>
    </Link>
  );
}
