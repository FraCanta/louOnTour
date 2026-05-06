function uniquePaths(paths = []) {
  return [...new Set(paths.filter(Boolean))];
}

export function getEventRevalidationPaths(slug, previousSlug = "") {
  const slugs = uniquePaths([slug, previousSlug]);
  const eventDetailPaths = slugs.flatMap((eventSlug) => [
    `/eventi/${eventSlug}`,
    `/en/eventi/${eventSlug}`,
  ]);

  return uniquePaths(["/", "/en", "/eventi", "/en/eventi", ...eventDetailPaths]);
}

export async function revalidateEventPages(res, slug, previousSlug = "") {
  if (typeof res?.revalidate !== "function") {
    return;
  }

  const paths = getEventRevalidationPaths(slug, previousSlug);
  const results = await Promise.allSettled(
    paths.map((path) => res.revalidate(path)),
  );
  const failed = results.filter((result) => result.status === "rejected");

  if (failed.length > 0) {
    console.warn(
      `Event page revalidation failed for ${failed.length} path(s).`,
      failed.map((result) => result.reason?.message || result.reason),
    );
  }
}
