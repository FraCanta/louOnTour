import React, { useState, useEffect } from "react";
import {
  getPosts,
  getCategories,
  getMedia,
  getTags,
  getTagId,
} from "../utils/wordpress";
import Head from "next/head";
import Post from "../components/Post/post";
import { useRouter } from "next/router";

const Blog = ({ post, category, media, tags }) => {
  const [categoriesFilter, setCategoriesFilter] = useState(0);
  const [jsxPosts, setJsxPosts] = useState([]);
  // const idLocale = (tags?.filter((el) => el.name === locale))[0].id;
  useEffect(() => {
    setJsxPosts(
      post
        .filter((el) => {
          const filterParams =
            categoriesFilter !== 0
              ? el?.categories.includes(parseInt(categoriesFilter))
              : el;
          return filterParams;
        })
        .map((p, i) => {
          const featuredMedia = p?.["_embedded"]?.["wp:featuredmedia"][0];
          return (
            <Post post={p} featuredMedia={featuredMedia} key={i} id={p?.id} />
          );
        })
    );
  }, [categoriesFilter]);

  // .filter((p) => p?.tags?.includes(idLocale)) da inserire

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
              onClick={() =>
                setCategoriesFilter(
                  (prevData) => (prevData === el?.id ? 0 : el?.id)
                  // const arr = [...prevData];
                  // prevData.includes(el.id)
                  //   ? arr?.splice(arr?.indexOf(el?.id), 1)
                  //   : arr.push(el?.id);
                  // return arr;
                )
              }
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
                    onClick={() =>
                      setCategoriesFilter(
                        (prevData) => (prevData === el?.id ? null : el?.id)
                        // const arr = [...prevData];
                        // prevData.includes(el.id)
                        //   ? arr?.splice(arr?.indexOf(el?.id), 1)
                        //   : arr.push(el?.id);
                        // return arr;
                      )
                    }
                  >
                    {el?.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

export async function getStaticProps({ locale }) {
  const tags = await getTags();
  // const idLocale = (tags?.filter((el) => el?.name === locale))[0].id; //prendo l'id che corrisponde ad it nel database di wp
  // const idLocale = locale;
  const idLocale = await getTagId(locale); // recupera id della lingua attuale
  const post = await getPosts(idLocale);
  const category = await getCategories(locale); //categorie nella lingua attuale
  const media = await getMedia();

  return {
    props: {
      post: post,
      category: category,
      media: media,
      tags: tags,
    },
    revalidate: 10,
  };
}
