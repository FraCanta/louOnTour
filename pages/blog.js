import React, { useState, useEffect } from "react";
import router, { useRouter } from "next/router";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";

import { getPosts, getCategories, getTagId } from "../utils/wordpress";
import Head from "next/head";
import Post from "../components/Post/post";
import Post2 from "../components/Post/post2";
import { Icon } from "@iconify/react/dist/iconify.js";
import LastPost from "../components/Post/lastPost";
import { MaskText } from "../components/UI/MaskText";

const Blog = ({ post, category, pages, currentP, lastPost }) => {
  const myRouter = useRouter();
  const [jsxPosts, setJsxPosts] = useState([]);
  const [filterObj, setFilterObj] = useState({});

  const handlePagination = (page) => {
    router.push(
      {
        pathname: "/blog",
        query: {
          page: page,
          categories: filterObj?.categories || 0,
        },
      }
      // { shallow: true }
    );
  };
  useEffect(() => {
    setFilterObj({
      currentPage: parseInt(myRouter?.query?.page) || 1,
      categories: parseInt(myRouter?.query?.categories) || 0,
    });
  }, []); // aggiorna i filtri correnti dalla querystring

  useEffect(() => {
    setJsxPosts(
      post.map((p, i) => {
        const featuredMedia = p?.["_embedded"]?.["wp:featuredmedia"][0];
        return (
          <Post2 post={p} featuredMedia={featuredMedia} key={i} id={p?.id} />
        );
      })
    );
  }, [post]); // aggiorna le cards

  useEffect(() => {
    setFilterObj((prevData) => {
      return { ...prevData, paginationArray: new Array(pages).fill(1) };
    });
  }, [pages]); // al variare delle pagine totali genero i bottoni delle pagine

  return (
    <div>
      <Head>
        <title>Luisa Quaglia Tour Guide | Tuscany Experience | Blog</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container w-11/12 mx-auto ">
        <div className="flex flex-col lg:flex-row  gap-6  w-full mx-auto mt-[50px] lg:mt-10">
          <div className="grid grid-cols-1  lg:w-[75%] ">
            <div className="flex flex-col w-full gap-6">
              <MaskText>
                <h4 className="text-principle text-[8vw] leading-[1.2] md:leading-none  lg:text-[6vw] xl:text-[5vw] 2xl:text-[3vw] 3xl:text-[3.6vw]  font-extrabold capitalize ">
                  Last Post
                </h4>{" "}
              </MaskText>
              <div className="relative w-full">
                <LastPost lastPost={lastPost} category={category} />
              </div>
            </div>
          </div>

          <div className="flex flex-col  lg:w-[25%]">
            {category?.map((el, i) => (
              <a
                key={i}
                onClick={() => {
                  setFilterObj((prevData) => {
                    if (prevData?.categories === el?.id)
                      return { currenPage: 1, categories: 0 };
                    else return { currenPage: 1, categories: el?.id };
                  });
                  router.push({
                    pathname: "/blog",
                    query: {
                      categories: el?.id,
                      page: 1,
                    },
                  });
                }}
                className="flex items-center gap-2 border-solid border-2 rounded-[5px] bg-second border-second text-white font-medium uppercase p-[3vw] xl:p-[0.6vw] mb-2 cursor-pointer  text-[5vw] xl:text-[1.2vw]"
              >
                {el?.name}
                <Icon icon="ri:arrow-right-up-line" className="ml-0" />
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-[30px] md:mt-[100px]">
          {jsxPosts}
        </div>
      </div>

      <div className="container flex justify-center w-screen mx-auto">
        {filterObj?.paginationArray?.length > 1 && (
          <div className="flex justify-center my-10">
            <div className="btn-group">
              <button
                className="btn "
                style={
                  parseInt(currentP) - 1 === 0
                    ? {
                        opacity: 0.6,
                        pointerEvents: "none",
                      }
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
                    ? {
                        opacity: 0.6,
                        pointerEvents: "none",
                      }
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
  );
};

export default Blog;

export async function getServerSideProps(context) {
  const { locale, query, req, res } = context;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate"
  );
  let { page, categories } = query;
  page === undefined && (page = 1);
  categories === undefined && (categories = 0);
  const itemPerPage = 6;

  // const tags = await getTags();
  const idLocale = await getTagId(locale); // recupera id della lingua attuale
  const post = await getPosts(idLocale);

  const filteredPosts = post.filter((el) => {
    const filterParams =
      parseInt(categories) !== 0
        ? el?.categories.includes(parseInt(categories))
        : el;
    return filterParams;
  });
  const paginationTrim = filteredPosts.slice(
    (page - 1) * itemPerPage,
    itemPerPage * page
  );
  const category = await getCategories(locale); //categorie nella lingua attuale
  // const media = await getMedia();
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
      post: paginationTrim,
      lastPost: post.sort((a, b) => a?.date > b?.date).filter((el, i) => i < 1),
      pages: Math.ceil(filteredPosts.length / itemPerPage),
      category: category, //array delle categorie presenti
      // media: media,
      // tags: tags,
      currentP: page,
      blog: obj?.blog,
    },
  };
}
