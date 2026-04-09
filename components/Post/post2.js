import Image from "next/image";
import Link from "next/link";
import { getDate } from "../../utils/utils";

const Post2 = ({ post, featuredMedia }) => {
  // Prende il nome della prima categoria, se esiste
  const categoryName = post?.postCategories?.[0]?.name || "";

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="flex flex-col h-[600px] gap-4"
    >
      <Image
        className="object-cover w-full   h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[450px]  rounded-sm"
        src={
          featuredMedia?.media_details?.sizes?.full?.source_url ||
          featuredMedia?.source_url
        }
        width={5400}
        height={5300}
        alt={post?.title?.rendered}
      />
      <div className="flex flex-col gap-4">
        <small className="text-sm text-para/80">
          {post?.["_embedded"].author[0]?.name} • {getDate(post?.date)}
        </small>
        <h3
          dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}
          className="text-2xl font-semibold leading-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        {categoryName && (
          <span className="text-principle font-bold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full lg:max-w-max tracking-wide text-xs lg:text-sm">
            {categoryName}
          </span>
        )}
      </div>
    </Link>
  );
};

export default Post2;
