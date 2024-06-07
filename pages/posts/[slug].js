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
      <div className="grid grid-cols-1 lg:grid-cols-3 w-11/12 mx-auto gap-6">
        <div className="pt-5 text-[#2C395B] col-span-2 paragrafo">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link href="/" className="text-[#2C395B]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#2C395B]">
                  Blog
                </Link>
              </li>
              <li
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                className="font-bold underline text-[#2C395B]"
              ></li>
            </ul>
          </div>

          <h2 className=" text-second text-xl md:text-2xl 3xl:text-5xl font-medium   mt-10">
            {postCategories[0]?.name}
          </h2>

          <h1
            className="py-4 text-3xl 2xl:text-5xl text-principle font-bold"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          ></h1>
          <div className="flex flex-col md:flex-row   items-start  md:items-center pb-10">
            {" "}
            <div className="flex  md:items-center">
              <Icon
                icon="fa6-solid:user-pen"
                className="mr-2 fxl:w-8 fxl:h-8 text-second"
              />
              <Link href={post?.["_embedded"].author[0]?.url}>
                <span className=" text-para text-base flex fxl:text-2xl">
                  {post?.["_embedded"].author[0]?.name}
                </span>
              </Link>
            </div>
            <div className="flex items-center mt-4 md:mt-0 md:ml-8">
              <Icon
                icon="clarity:date-line"
                className="mr-2 fxl:w-8 fxl:h-8 text-second"
              />
              <span className=" text-para text-base flex fxl:text-2xl">
                {" "}
                {getDate(post?.date)}
              </span>
              <div className=" text-para md:text-lg flex ml-6 font-[400] items-center">
                <Icon
                  icon="tabler:clock-hour-3"
                  className="mr-2 fxl:w-8 fxl:h-8 text-second"
                />
                <span className=" text-para text-base flex fxl:text-2xl">
                  {minutiLettura} min read
                </span>
              </div>
            </div>
          </div>

          <CarouselParser post={modifiedContent} />
          <div className="w-full py-12">
            <h6>Tags</h6>
            {tags.map((el, i) => (
              <div className="badge badge-warning mr-2 text-white" key={i}>
                {el}
              </div>
            ))}
          </div>
        </div>
        <div className="h-full flex justi flex-col gap-6">
          <h2 className="text-[26px] fxl:text-4xl font-bold uppercase text-principle underline">
            Last recents
          </h2>
          {recentPostCol}
        </div>
      </div>

      <div className="btn-group grid grid-cols-2 mt-8">
        <button className="btn btn-outline flex flex-col ">
          {!!nextPrevPost?.prevSlug ? (
            <Link href={`/posts/${nextPrevPost?.prevSlug}`}>
              <div className="mb-2 capitalize">{"< "}prev</div>
            </Link>
          ) : (
            ""
          )}
        </button>

        <button className="btn btn-outline  flex flex-col">
          <Link href={`/posts/${nextPrevPost?.nextSlug}`}>
            <div className="mb-2 capitalize">next{" >"}</div>
          </Link>
        </button>
      </div>
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

  const postCategories = category?.filter((el) =>
    post?.categories?.includes(el?.id)
  );

  const modifiedContent = post?.content?.rendered?.replace(
    "data-src-fg",
    "src"
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
        .filter((el, i) => i < 6),
      featuredMedia: featuredMedia,
      tags: tags,
      nextPrevPost: nextPrevPost,
      postCategories: postCategories,
    },
    revalidate: 10, // In seconds
  };
}
