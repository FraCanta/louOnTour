import Link from "next/link";

import { getPost, getSlugs } from "../../utils/wordpress";
import Head from "next/head";

export default function PostPage({ post, modifiedContent }) {
  console.log(modifiedContent);
  return (
    <>
      <Head>
        <title>{`Lou On Tour - ${post.title.rendered}`}</title>
      </Head>

      <div className="container mx-auto pt-5 w-11/12 2xl:w-4/5 text-black">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href="/" className="text-black">
                Home
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-black">
                Blog
              </Link>
            </li>
            <li
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              className="font-bold"
            ></li>
          </ul>
        </div>
        <h1
          className="text-center py-8 text-3xl 2xl:text-5xl text-black"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        ></h1>
        <div
          className="text-black"
          dangerouslySetInnerHTML={{ __html: modifiedContent }}
        ></div>
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
  const modifiedContent = post?.content?.rendered?.replace("data-src", "src");

  return {
    props: {
      post,
      modifiedContent: modifiedContent,
    },
    revalidate: 10, // In seconds
  };
}
