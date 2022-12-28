import React, { useState, useEffect } from "react";
import router, { useRouter } from "next/router";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";

import { getPosts, getCategories, getTagId } from "../utils/wordpress";
import Head from "next/head";
import Post from "../components/Post/post";

const Blog = ({ post, category, pages, currentP, blog }) => {
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
          <Post post={p} featuredMedia={featuredMedia} key={i} id={p?.id} />
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
        <title>Lou On Tour - Blog</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-11/12 min-h-[30vh] container mx-auto flex flex-col lg:flex-row py-6 xl:py-8">
        <div className="w-full ">
          <h4 className="text-[#FE6847] text-xl 3xl:text-4xl">Blog</h4>
          <h2 className="text-5xl md:text-[64px] 3xl:text-[100px] font-medium mt-2 leading-[3.2rem] lg:leading-[3.5rem] text-[#2c395b]">
            {blog?.title}
          </h2>
          <p className="text-base sm:text-xl   mt-8 mb-4 text-[#2c395b]">
            {blog?.paragraph}
          </p>
        </div>
      </div>
      <div className="container mx-auto pt-5 p-2 xl:p-8">
        <div className="tabs !justify-center  hidden lg:flex py-8">
          {category.map((el, i) => (
            <a
              key={i}
              style={
                filterObj?.categories === el?.id
                  ? {
                      background: "#2c395b",
                      color: "white",
                    }
                  : {}
              } // coloro quelli selezionati
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
              className={`${
                filterObj?.categories !== el?.id
                  ? "tab tab-xs lg:tab-lg tab-lifted text-[#2c395b] "
                  : "tab tab-lg tab-lifted tab-active"
              }  `}
            >
              {el?.name}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-14  xl:gap-20 grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 justify-items-center content-center pt-0 2xl:pt-10 2xl:pb-20">
        {jsxPosts}
        <div className="container w-screen mx-auto flex justify-center">
          {filterObj?.paginationArray?.length > 1 && (
            <div className="flex justify-center mb-8 ">
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
      <div className="w-11/12 mx-4">
        <div className="block lg:hidden">
          <ul>
            {category.map((el, i) => (
              <li
                key={i}
                className="text-2xl text-[ #2c395b] mb-4 text-black"
                style={
                  filterObj?.categories === el?.id
                    ? {
                        background: "#2c395b",
                        width: "50%",
                        color: "white",
                      }
                    : {}
                } // coloro quelli selezionati
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
              >
                {el?.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blog;

export async function getServerSideProps(context) {
  const { locale, query, req, res } = context;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
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
      pages: Math.ceil(filteredPosts.length / itemPerPage),
      category: category, //array delle categorie presenti
      // media: media,
      // tags: tags,
      currentP: page,
      blog: obj?.blog,
    },
  };
}
