import React, { useState, useEffect } from "react";
import router, { useRouter } from "next/router";

import { getPosts, getCategories, getTagId } from "../utils/wordpress";
import Head from "next/head";
import Post from "../components/Post/post";

const Blog = ({ post, category, pages, currentP }) => {
  const myRouter = useRouter();
  // const [categoriesFilter, setCategoriesFilter] = useState(0);
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
    console.log("brutto pirla sto leggendo le chiavi");
    setFilterObj({
      currentPage: parseInt(myRouter?.query?.page) || 1,
      categories: parseInt(myRouter?.query?.categories) || 0,
    });
  }, []); // aggiorna i filtri correnti dalla querystring

  useEffect(() => {
    console.log(filterObj);
  }, [filterObj]);

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

  // useEffect(() => {
  //   setFilterObj((prevData) => {
  //     return { ...prevData, currentPage: parseInt(currentP) };
  //   });
  //   // setCurrentPage(currentP);
  // }, [currentP]);

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
                filterObj?.categories === el?.id
                  ? {
                      background:
                        "linear-gradient(90deg,  hsla(204, 68%, 41%, 1) 0%, hsla(205, 100%, 67%, 1) 100%  )",
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
                router.push(
                  {
                    pathname: "/blog",
                    query: {
                      categories: el?.id,
                      page: 1,
                    },
                  }
                  // { shallow: true }
                );
              }}
              className={`${
                filterObj?.categories !== el?.id
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
                      filterObj?.categories === el?.id
                        ? {
                            background:
                              "linear-gradient(90deg,  hsla(204, 68%, 41%, 1) 0%, hsla(205, 100%, 67%, 1) 100%  )",
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

                      router.push(
                        {
                          pathname: "/blog",
                          query: {
                            categories: el?.id,
                            page: 1,
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
      {filterObj?.paginationArray?.length > 1 && (
        <div className="flex justify-center mb-8">
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
              // disabled={parseInt(currentPage) + 1 > pages}
              onClick={() => handlePagination(parseInt(currentP) + 1)}
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

  return {
    props: {
      post: paginationTrim,
      pages: Math.ceil(filteredPosts.length / itemPerPage),
      category: category, //array delle categorie presenti
      // media: media,
      // tags: tags,
      currentP: page,
    },
  };
}
