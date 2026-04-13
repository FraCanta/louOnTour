import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getDate } from "../../utils/utils";

const LastPost = ({ lastPost }) => {
  if (!lastPost?.length) return null;

  const main = lastPost[0];
  const side = lastPost.slice(1, 4);

  const stripHtml = (html) =>
    html?.replace(/<[^>]*>?/gm, "").slice(0, 200) + "...";

  return (
    <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
      {/* LEFT BIG */}
      <Link
        href={`/posts/${main.slug}`}
        className="flex flex-col gap-4 lg:row-span-3"
      >
        <Image
          className="object-cover w-full h-full rounded-sm"
          src={
            main?._embedded?.["wp:featuredmedia"][0]?.media_details?.sizes?.full
              ?.source_url
          }
          width={4800}
          height={2400}
          alt={main?.title?.rendered}
        />

        <small className="text-md lg:text-base text-para/80">
          {main?.["_embedded"].author[0]?.name} • {getDate(main?.date)}
        </small>

        <h2
          dangerouslySetInnerHTML={{ __html: main.title?.rendered }}
          className="text-2xl font-semibold lg:text-6xl"
        />

        <p className="text-para">{stripHtml(main?.excerpt?.rendered)}</p>

        <div className="flex flex-wrap gap-2">
          {main?.postCategories?.map((cat) => (
            <span
              key={cat.id}
              className="text-principle font-bold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full lg:max-w-max tracking-wide text-xs lg:text-sm"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </Link>

      {/* RIGHT LIST */}
      {side.map((post) => (
        <Link
          href={`/posts/${post.slug}`}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2 "
          key={post.id}
        >
          <Image
            src={
              post?._embedded?.["wp:featuredmedia"][0]?.media_details?.sizes
                ?.full?.source_url
            }
            width={5220}
            height={3160}
            className="object-cover w-full h-full rounded-sm"
            alt={post?.title?.rendered}
          />

          <div className="flex flex-col gap-4">
            <small className="text-base text-para/80">
              {post?.["_embedded"].author[0]?.name} • {getDate(post?.date)}
            </small>

            <h3
              dangerouslySetInnerHTML={{
                __html: post.title?.rendered,
              }}
              className="text-2xl font-semibold lg:text-3xl"
            />

            <p className="text-sm text-para">
              {stripHtml(post?.excerpt?.rendered)}
            </p>

            <div className="flex flex-wrap gap-2">
              {post?.postCategories?.map((cat) => (
                <span
                  key={cat.id}
                  className="text-principle font-bold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full lg:max-w-max tracking-wide text-xs lg:text-sm"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LastPost;
