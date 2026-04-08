import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  getPost,
  getPosts,
  getSlugs,
  getTagId,
  getTagNameList,
  getCategories,
} from "../../utils/wordpress";
import { getDate } from "../../utils/utils";

import Head from "next/head";
import { parse } from "dom-parser-react";
import CarouselParser from "../../components/carouselParser/carouselParser";
import RecentPostCol from "../../components/Post/recentPostCol";
import { Icon } from "@iconify/react/dist/iconify.js";
export default function PostPage({
  post,
  modifiedContent,
  recent,
  tags,
  nextPrevPost,
  postCategories,
}) {
  const contents = parse(post.title.rendered, {
    createElement: React.createElement,
    Fragment: React.Fragment,
  });

  const [minutiLettura, setMinutiLettura] = useState(0);
  function calcolaMinutiLettura(testo, velocitaLetturaMedia) {
    const parole = testo.split(" ");
    const paroleLette = parole.filter((parola) => parola.trim() !== "").length;
    const minuti = Math.ceil(paroleLette / velocitaLetturaMedia);
    return minuti;
  }

  useEffect(() => {
    const testoSenzaTag = modifiedContent.replace(/(<([^>]+)>)/gi, ""); // Rimuove i tag HTML dal testo
    const minuti = calcolaMinutiLettura(testoSenzaTag, 250); // Utilizza la velocità di lettura media di 250 parole al minuto
    setMinutiLettura(minuti);
  }, [modifiedContent]);

  const recentPostCol = recent.map((p, i) => {
    const featuredMedia = p?.["_embedded"]?.["wp:featuredmedia"][0];
    return (
      <RecentPostCol
        post={p}
        featuredMedia={featuredMedia}
        key={i}
        id={p?.id}
        minutiLettura={minutiLettura}
      />
    );
  });
  return (
    <>
      <Head>
        <title>Luisa Quaglia - Tuscany Experience - {contents}</title>
        <meta
          property="og:image"
          content={post?.yoast_head_json?.og_image?.url}
        />
        <meta property="og:image:width" content="1200" />

        <meta property="og:image:height" content="630" />
        <meta
          property="og:description"
          content={post?.yoast_head_json?.description}
        />
      </Head>
      <div className="grid w-11/12 grid-cols-1 gap-10 py-10 mx-auto lg:py-20 lg:px-10 ">
        <div className="flex flex-col gap-6 paragrafo lg:w-full lg:gap-12">
          <div className="flex flex-col gap-4 mb-10 lg:items-center">
            <div className="mb-20">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-xl text-principle"
              >
                <Icon icon="lets-icons:refund-back" /> Back to blog
              </Link>
            </div>
            <h2 className="text-principle max-w-max font-bold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full lg:max-w-max tracking-wide text-xs lg:text-sm">
              {postCategories[0]?.name}
            </h2>

            <h1
              className="py-4 text-3xl font-bold lg:text-center 2xl:text-5xl text-principle"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            ></h1>
            <div className="flex flex-col items-start pb-10 md:flex-row md:items-center">
              {" "}
              <div className="flex md:items-center">
                <Icon icon="fa6-solid:user-pen" className="mr-2 text-para" />
                <Link href={post?.["_embedded"].author[0]?.url}>
                  <span className="flex text-base text-para fxl:text-lg">
                    {post?.["_embedded"].author[0]?.name}
                  </span>
                </Link>
              </div>
              <div className="flex items-center mt-4 md:mt-0 md:ml-8">
                <Icon icon="clarity:date-line" className="mr-2 text-para" />
                <span className="flex text-base text-para fxl:text-lg">
                  {" "}
                  {getDate(post?.date)}
                </span>
                <div className=" text-para md:text-lg flex ml-6 font-[400] items-center">
                  <Icon icon="tabler:clock-hour-3" className="mr-2 text-para" />
                  <span className="flex text-base text-para fxl:text-lg">
                    {minutiLettura} min read
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 mx-auto text-lg text-para ">
            <CarouselParser post={modifiedContent} />
          </div>
        </div>
        <div className="">
          <div className="grid w-full grid-cols-3 gap-6 mt-48">
            <h2 className="text-4xl font-bold fxl:text-5xl text-principle ">
              Last recents
            </h2>
            {recentPostCol}
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-2 mt-8 btn-group">
        <button className="flex flex-col btn btn-outline ">
          {!!nextPrevPost?.prevSlug ? (
            <Link href={`/posts/${nextPrevPost?.prevSlug}`}>
              <div className="mb-2 capitalize">{"< "}prev</div>
            </Link>
          ) : (
            ""
          )}
        </button>

        <button className="flex flex-col btn btn-outline">
          <Link href={`/posts/${nextPrevPost?.nextSlug}`}>
            <div className="mb-2 capitalize">next{" >"}</div>
          </Link>
        </button>
      </div> */}
    </>
  );
}

//hey Next, these are the possible slugs
export async function getStaticPaths() {
  const paths = await getSlugs("posts");

  return {
    paths,
    //this option below renders in the server (at request time) pages that were not rendered at build time
    //e.g when a new blogpost is added to the app
    fallback: "blocking",
  };
}

//access the router, get the id, and get the data for that post
export async function getStaticProps({ params, locale }) {
  const post = await getPost(params?.slug);
  const idLocale = await getTagId(locale); // recupera id della lingua attuale
  const allPosts = await getPosts(idLocale);
  const category = await getCategories(locale);
  const postArrayIndex = allPosts?.findIndex((el) => el.id === post?.id);
  const nextPrevPost = {
    prevTitle: allPosts[postArrayIndex - 1]?.title?.rendered || null,
    nexTitle: allPosts[postArrayIndex + 1]?.title?.rendered || null,
    prevSlug: allPosts[postArrayIndex - 1]?.slug || null,
    nextSlug: allPosts[postArrayIndex + 1]?.slug || null,
  };

  const postCategories = category?.filter(
    (el) => post?.categories?.includes(el?.id) || "Blog",
  );

  const modifiedContent = post?.content?.rendered?.replace(
    "data-src-fg",
    "src",
  );
  const featuredMedia = post?.["_embedded"]?.["wp:featuredmedia"][0];
  const tags = await getTagNameList(post?.tags);

  return {
    props: {
      post,
      modifiedContent: modifiedContent,
      recent: allPosts
        ?.filter((el) => el.id !== post.id)
        .sort((a, b) => a?.date > b?.date)
        .filter((el, i) => i < 4),
      featuredMedia: featuredMedia,
      tags: tags,
      nextPrevPost: nextPrevPost,
      postCategories: postCategories,
    },
    revalidate: 10, // In seconds
  };
}
