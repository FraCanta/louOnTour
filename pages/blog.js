import React from "react";
import { getPosts, getCategories, getMedia, getTags } from "../utils/wordpress";
import Head from "next/head";
import Post from "../components/Post/post";
import { useRouter } from "next/router";

const Blog = ({ post, category, media, tags }) => {
  const { locale } = useRouter();
  const idLocale = (tags?.filter((el) => el.name === locale))[0].id;

  console.log("posts", post);

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
      <div className="py-8 text-4xl text-center text-black">
        <h1>Blog</h1>
      </div>
      <div className="container mx-auto pt-5 p-2 xl:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3  gap-14 md:gap-14 xl:gap-18">
          {jsxPosts}
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
