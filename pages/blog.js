import React, { useState, useEffect } from "react";
import router, { useRouter } from "next/router";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";

import { getPosts, getCategories, getTagId } from "../utils/wordpress";
import Head from "next/head";
import Post2 from "../components/Post/post2";
import LastPost from "../components/Post/lastPost";
import { MaskText } from "../components/UI/MaskText";

const Blog = ({ post, category, pages, currentP, lastPost }) => {
  const myRouter = useRouter();
  const [jsxPosts, setJsxPosts] = useState([]);
  const [filterObj, setFilterObj] = useState({});

  const handlePagination = (page) => {
    router.push({
      pathname: "/blog",
      query: {
        page: page,
      },
    });
  };

  useEffect(() => {
    setFilterObj({
      currentPage: parseInt(myRouter?.query?.page) || 1,
    });
  }, []);

  useEffect(() => {
    setJsxPosts(
      post.map((p, i) => {
        const featuredMedia = p?._embedded?.["wp:featuredmedia"]?.[0];
        return <Post2 post={p} featuredMedia={featuredMedia} key={i} />;
      }),
    );
  }, [post]);

  useEffect(() => {
    setFilterObj((prevData) => {
      return { ...prevData, paginationArray: new Array(pages).fill(1) };
    });
  }, [pages]);

  return (
    <div>
      <Head>
        <title>Luisa Quaglia Tour Guide | Tuscany Experience | Blog</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-11/12 py-10 mx-auto lg:py-20 lg:px-10">
        <div className="relative  flex flex-col md:flex-row lg:items-center gap-6 lg:gap-20 min-h-[calc(100svh_-_60px)] xl:min-h-[calc(100svh_-_100px)] ">
          <div className="flex flex-col w-full gap-6">
            <MaskText>
              <h4 className="text-principle text-[8vw] leading-[1.2] md:leading-none lg:text-[6vw] xl:text-[5vw] 2xl:text-[3vw] font-extrabold  ">
                Recent blog posts
              </h4>
            </MaskText>

            <div className="relative w-full">
              <LastPost lastPost={lastPost} category={category} />{" "}
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-[30px] md:my-48">
          <h2 className="mb-10 text-4xl font-semibold text-principle">
            All blog posts
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 ">
            {jsxPosts}
          </div>
          <div className="container flex justify-center ">
            {filterObj?.paginationArray?.length > 1 && (
              <div className="flex justify-center gap-4 my-10">
                <div className="btn-group">
                  <button
                    className="btn"
                    style={
                      parseInt(currentP) - 1 === 0
                        ? { opacity: 0.6, pointerEvents: "none" }
                        : {}
                    }
                    onClick={() => handlePagination(currentP - 1)}
                  >
                    «
                  </button>

                  {filterObj?.paginationArray?.map((el, i) => (
                    <button
                      className={`btn ${
                        parseInt(currentP) - i === el && "btn-active"
                      }`}
                      key={i}
                      onClick={() => handlePagination(el + i)}
                    >
                      {el + i}
                    </button>
                  ))}

                  <button
                    className="btn"
                    style={
                      parseInt(currentP) + 1 > pages
                        ? { opacity: 0.6, pointerEvents: "none" }
                        : {}
                    }
                    onClick={() => handlePagination(parseInt(currentP) + 1)}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

export async function getServerSideProps(context) {
  const { locale, query, res } = context;

  // Cache header
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate",
  );

  let { page } = query;
  page === undefined && (page = 1);

  const itemPerPage = 6;

  // Recupera tag lingua
  const idLocale = await getTagId(locale);

  // Recupera tutti i post filtrati per lingua
  const post = await getPosts(idLocale);

  // Normalizza categories dei post (sempre array)
  const normalizedPosts = post.map((p) => ({
    ...p,
    categories: Array.isArray(p.categories)
      ? p.categories
      : p.categories
        ? [p.categories]
        : [],
  }));

  // Recupera tutte le categorie della lingua (non filtrare per count)
  const category = await getCategories(locale, false);

  const lastPostsCount = 4;

  // Ordina per data decrescente
  const sortedPosts = [...normalizedPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // Ultimi 4 post
  const lastPost = sortedPosts.slice(0, lastPostsCount);

  // Post rimanenti per Post2
  const remainingPosts = sortedPosts.slice(lastPostsCount);

  // Paginazione
  const paginationTrim = remainingPosts.slice(
    (page - 1) * itemPerPage,
    itemPerPage * page,
  );

  // Aggiungi categories valide direttamente ai post (oggetti {id, name})
  const attachPostCategories = (posts) =>
    posts.map((p) => {
      // prendi le categorie valide dal DB
      const cats = category.filter((c) => p.categories.includes(c.id));
      return {
        ...p,
        // se non ci sono categorie valide, metti BLOG
        postCategories: cats.length > 0 ? cats : [{ id: 0, name: "BLOG" }],
      };
    });

  const lastPostWithCategories = attachPostCategories(lastPost);
  const paginationTrimWithCategories = attachPostCategories(paginationTrim);

  // Traduzioni
  let obj;
  switch (locale) {
    case "it":
      obj = translationIT;
      break;
    case "en":
      obj = translationEN;
      break;
    default:
      obj = translationIT;
      break;
  }

  return {
    props: {
      post: paginationTrimWithCategories, // post per Post2 (dal 5° in poi)
      lastPost: lastPostWithCategories, // ultimi 4 post
      pages: Math.ceil(remainingPosts.length / itemPerPage), // pagine
      category: category || ["Blog"], // tutte le categorie della lingua
      currentP: page, // pagina corrente
      blog: obj?.blog, // traduzioni
    },
  };
}
