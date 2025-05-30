const headlessSite = "https://luisaquaglia-tourguide.com";
import LayoutTranslation from "../public/locales/layout.json";
import { getPostsByLanguageAndBlogOwner } from "../utils/wordpress";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    <url>
      <loc>${headlessSite}/</loc>
    </url>
    <url>
      <loc>${headlessSite}/en</loc>
    </url>
    <url>
      <loc>${headlessSite}/blog</loc>
    </url>
    <url>
      <loc>${headlessSite}/en/blog</loc>
    </url>
    <url>
      <loc>${headlessSite}/chi-sono</loc>
    </url>
    <url>
      <loc>${headlessSite}/en/chi-sono</loc>
    </url>
    <url>
      <loc>${headlessSite}/contatti</loc>
    </url>
    <url>
      <loc>${headlessSite}/en/contatti</loc>
    </url>
    <url>
      <loc>${headlessSite}/tours-da-fare</loc>
    </url>
    <url>
      <loc>${headlessSite}/en/tours-da-fare</loc>
    </url>

    ${LayoutTranslation?.menu?.it?.map?.markers
      .map((el) => {
        return `
          <url>
            <loc>${`${headlessSite}/locations/${encodeURIComponent(
              el?.title
            )}`}</loc>
          </url>`;
      })
      .join("")}

    ${LayoutTranslation?.menu?.en?.map?.markers
      .map((el) => {
        return `
          <url>
            <loc>${`${headlessSite}/en/locations/${encodeURIComponent(
              el?.title
            )}`}</loc>
          </url>`;
      })
      .join("")}

    ${posts?.it
      .map(({ slug, date }) => {
        const isoDate = new Date(date).toISOString();
        return `
          <url>
            <loc>${`${headlessSite}/posts/${slug}`}</loc>
            <lastmod>${isoDate}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.5</priority>
          </url>`;
      })
      .join("")}

    ${posts?.en
      .map(({ slug, date }) => {
        const isoDate = new Date(date).toISOString();
        return `
          <url>
            <loc>${`${headlessSite}/en/posts/${slug}`}</loc>
            <lastmod>${isoDate}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.5</priority>
          </url>`;
      })
      .join("")}

  </urlset>`;
}

// Optional: sitemap page component (invisibile)
export default function SiteMap() {
  return null;
}

// Generate sitemap at runtime (SSR)
export async function getServerSideProps({ res }) {
  const posts = await getPostsByLanguageAndBlogOwner();
  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}
