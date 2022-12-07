import React from "react";
import { getPosts, getCategories } from "../utils/wordpress";
import Head from "next/head";
import Post from "../components/Post/post";

const Blog = ({ post, category }) => {
  console.log(post?.title);
  const jsxPosts = post.map((p) => {
    const featuredMedia = p["_embedded"]["wp:featuredmedia"][0];
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
      <div className="container mx-auto pt-5 p-8">
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
  return {
    props: { post: post, category: category },
    revalidate: 10,
  };
}
