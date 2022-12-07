import Link from "next/link";

import { getPost, getSlugs } from "../../utils/wordpress";
import Head from "next/head";

export default function PostPage({ post }) {
  return (
    <>
      <Head>
        <title>{`Lou On Tour - ${post.title.rendered}`}</title>
      </Head>
      <div className="container mx-auto pt-5">
        <h1 className="text-center pb-5">{post.title.rendered}</h1>
        <div
          className="card-text pb-5"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        ></div>
        <Link href="/blog">Back to Home</Link>
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
export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);

  return {
    props: {
      post,
    },
    revalidate: 10, // In seconds
  };
}
