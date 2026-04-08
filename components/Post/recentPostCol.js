import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getDate } from "../../utils/utils";
const RecentPostCol = ({ post, featuredMedia }) => {
  const stripHtml = (html) =>
    html?.replace(/<[^>]*>?/gm, "").slice(0, 200) + "...";
  return (
    <div className="flex w-full gap-2">
      <Link
        href={`/posts/${post.slug}`}
        className="grid grid-cols-1 gap-6"
        key={post.id}
      >
        <Image
          src={
            post?._embedded?.["wp:featuredmedia"][0]?.media_details?.sizes?.full
              ?.source_url
          }
          width={5220}
          height={3160}
          className="object-cover w-full h-[450px] rounded-sm"
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
    </div>
  );
};

export default RecentPostCol;
