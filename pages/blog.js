import React from "react";
import { getPosts, getCategories, getMedia, getTags } from "../utils/wordpress";
import Head from "next/head";
import Post from "../components/Post/post";
import { useRouter } from "next/router";

const Blog = ({ post, category, media, tags }) => {
  const { locale } = useRouter();
  const idLocale = (tags?.filter((el) => el.name === locale))[0].id;

  // console.log("posts", post);

  const jsxPosts = post
    .filter((p) => p?.tags?.includes(idLocale))
    .map((p) => {
      const featuredMedia = p?.["_embedded"]?.["wp:featuredmedia"][0];
      return <Post post={p} featuredMedia={featuredMedia} key={p.id} />;
    });

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
              {/* <p className="py-6 text-base 2xl:text-2xl ">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto pt-5 p-2 xl:p-8">
        <div className="grid gap-14  xl:gap-20 grid-cols-1 lg:grid-cols-3 justify-items-center content-center pt-12 2xl:pt-10">
          {jsxPosts}
          {/* <div className="w-1/2">
            <h2>Categorie</h2>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Blog;

export async function getStaticProps() {
  const post = await getPosts();
  const category = await getCategories();
  const media = await getMedia();
  const tags = await getTags();

  return {
    props: { post: post, category: category, media: media, tags: tags },
    revalidate: 10,
  };
}
