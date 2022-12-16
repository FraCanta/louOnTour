import React, { useState, useEffect } from "react";
import router from "next/router";

import {
  getPosts,
  getCategories,
  getMedia,
  getTags,
  getTagId,
} from "../utils/wordpress";
import Head from "next/head";
import Post from "../components/Post/post";

const Blog = ({ post, category, pages, currentP }) => {
  console.log(currentP);
  const [categoriesFilter, setCategoriesFilter] = useState(0);
  const [jsxPosts, setJsxPosts] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([1]);
  const [currentPage, setCurrentPage] = useState(currentP);

  const handlePagination = (page) => {
    router.push(
      {
        pathname: "/blog",
        query: {
          page: page,
        },
      }
      // { shallow: true }
    );
  };

  useEffect(() => {
    setJsxPosts(
      post.map((p, i) => {
        const featuredMedia = p?.["_embedded"]?.["wp:featuredmedia"][0];
        return (
          <Post post={p} featuredMedia={featuredMedia} key={i} id={p?.id} />
        );
      })
    );
  }, [post]);
  useEffect(() => {
    setPageNumbers(new Array(pages).fill(1));
  }, [pages]);
  useEffect(() => {
    setCurrentPage(currentP);
  }, [currentP]);

  return (
    <div>
      <Head>
        <title>Lou On Tour - Blog</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="hero !min-h-[400px] text-white ">
          <div className="hero-content w-11/12 2xl:w-4/5  p-0 2xl:text-center">
            <div>
              <h1 className="text-8xl font-bold">Blog</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto pt-5 p-2 xl:p-8">
        <div className="tabs !justify-center hidden lg:flex py-8">
          {category.map((el, i) => (
            <a
              key={i}
              style={
                categoriesFilter === el?.id
                  ? {
                      background:
                        "linear-gradient(90deg,  hsla(204, 68%, 41%, 1) 0%, hsla(205, 100%, 67%, 1) 100%  )",
                      color: "white",
                    }
                  : {}
              } // coloro quelli selezionati
              onClick={() => {
                setCategoriesFilter((prevData) =>
                  prevData === el?.id ? 0 : el?.id
                );
                router.push(
                  {
                    pathname: "/blog",
                    query: {
                      categories: el?.id,
                    },
                  }
                  // { shallow: true }
                );
              }}
              className={`${
                categoriesFilter !== el?.id
                  ? "tab tab-xs lg:tab-lg tab-lifted "
                  : "tav tab-lg tab-lifted tab-active"
              }  `}
            >
              {el?.name}
            </a>
          ))}
        </div>

        <div className="grid gap-14  xl:gap-20 grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 justify-items-center content-center pt-12 2xl:pt-10">
          {jsxPosts}
          <div className="w-11/12">
            <div className="block lg:hidden">
              <h3 className="text-black">Categorie</h3>
              <ul>
                {category.map((el, i) => (
                  <li
                    key={i}
                    className="text-2xl mb-4 text-black"
                    style={
                      categoriesFilter === el?.id
                        ? {
                            background:
                              "linear-gradient(90deg,  hsla(204, 68%, 41%, 1) 0%, hsla(205, 100%, 67%, 1) 100%  )",
                            color: "white",
                          }
                        : {}
                    } // coloro quelli selezionati
                    onClick={() => {
                      setCategoriesFilter((prevData) =>
                        prevData === el?.id ? 0 : el?.id
                      );
                      router.push(
                        {
                          pathname: "/blog",
                          query: {
                            categories: el?.id,
                          },
                        }
                        // { shallow: true }
                      );
                    }}
                  >
                    {el?.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {pageNumbers?.length > 1 && (
        <div className="flex justify-center mb-8">
          <div className="btn-group">
            <button
              className="btn "
              style={
                parseInt(currentPage) - 1 === 0
                  ? {
                      opacity: 0.6,
                      pointerEvents: "none",
                    }
                  : {}
              }
              onClick={() => handlePagination(currentPage - 1)}
            >
              «
            </button>
            {pageNumbers?.map((el, i) => (
              <button
                className={`btn ${
                  parseInt(currentPage) - i === el && "btn-active"
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
                parseInt(currentPage) + 1 > pages
                  ? {
                      opacity: 0.6,
                      pointerEvents: "none",
                    }
                  : {}
              }
              // disabled={parseInt(currentPage) + 1 > pages}
              onClick={() => handlePagination(parseInt(currentPage) + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}
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

  const tags = await getTags();
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
  const media = await getMedia();

  return {
    props: {
      post: paginationTrim,
      pages: Math.ceil(filteredPosts.length / itemPerPage),
      category: category,
      media: media,
      tags: tags,
      currentP: page,
    },
  };
}
