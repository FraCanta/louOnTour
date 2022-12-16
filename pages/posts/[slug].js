import Link from "next/link";

import { getPost, getSlugs, getTags } from "../../utils/wordpress";
import Head from "next/head";
import Image from "next/image";
import Siena from "../../public/assets/locationTour/siena/siena2.jpg";

export default function PostPage({
  post,
  modifiedContent,
  featuredMedia,
  tags,
}) {
  return (
    <>
      <Head>
        <title>{`Lou On Tour - ${post.title.rendered}`}</title>
        <meta
          property="og:image"
          content={`https://lou-eight.vercel.app//${featuredMedia}`}
        />
      </Head>

      <div className="container mx-auto pt-5 w-11/12 2xl:w-4/5 text-black ">
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
          className="text-center py-8 text-3xl 2xl:text-5xl text-black l-article"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        ></h1>
        <figure>
          <Image
            src={
              featuredMedia?.["media_details"]?.sizes?.full?.["source_url"] ||
              Siena
            }
            width={800}
            height={800}
            alt={featuredMedia?.["alt_text"] || "LouOnTour image"}
            className="w-full h-[550px] object-cover rounded-lg py-8"
            priority
          />
        </figure>

        <div
          className="text-black text-base lg:text-xl l-article"
          dangerouslySetInnerHTML={{ __html: modifiedContent }}
        ></div>
      </div>
      <div className="w-11/12 lg:w-4/5 mx-auto py-12">
        <h6>Tags</h6>
        {tags.map((el, i) => (
          <div className="badge badge-warning mr-2 text-white" key={i}>
            {el?.name}
          </div>
        ))}
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
  const modifiedContent = post?.content?.rendered?.replace(
    "data-src-fg",
    "src"
  );
  const featuredMedia = post?.["_embedded"]?.["wp:featuredmedia"][0];
  const tags = await getTags();
  const filteredTags = tags?.filter((el) => el);
  return {
    props: {
      post,
      modifiedContent: modifiedContent,
      featuredMedia: featuredMedia,
      tags: filteredTags,
    },
    revalidate: 10, // In seconds
  };
}
