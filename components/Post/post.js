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
    <article className="flex flex-col h-full gap-4">
      {/* IMAGE */}
      <Link href={`/posts/${post?.slug}`} title={post?.title?.rendered}>
        <figure>
          <Image
            src={featuredMedia?.media_details?.sizes?.full?.source_url}
            width={461}
            height={420}
            alt={featuredMedia?.alt_text || ""}
            className="w-full md:h-[50vw] lg:h-[260px] 3xl:h-[380px] object-cover"
            priority
            quality={70}
          />
        </figure>
      </Link>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow">
        {/* TITLE */}
        <Link href={`/posts/${post?.slug}`} title={post?.title?.rendered}>
          <h3
            className="
              font-bold text-white
              text-[5vw] md:text-[4vw] 2xl:text-xl 3xl:text-3xl
              line-clamp-2 min-h-[3em]
            "
            dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}
          />
        </Link>

        {/* DIVIDER */}
        <div className="w-full h-px my-3 bg-white/30" />

        {/* FOOTER */}
        <div className="flex items-center justify-between mt-auto">
          <small className="text-sm text-white 3xl:text-xl">
            {getDate(post?.date)}
          </small>

          <div className="flex items-center text-sm text-white 3xl:text-lg">
            <Icon icon="tabler:clock-hour-3" className="mr-2" />
            <span>{minutiLettura} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}
