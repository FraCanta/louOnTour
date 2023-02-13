const BASE_URL = "http://loublog.louontour.it/wp-json/wp/v2";

export async function getPosts(lang) {
  const postsRes = await fetch(BASE_URL + "/posts?_embed&per_page=100", {
    cache: "force-cache",
    revalidate: 900,
  });
  const posts = await postsRes.json();
  const lngPost = posts.filter((p) => {
    if (!!lang) {
      return p?.tags?.includes(lang);
    } else {
      return p;
    }
  });
  const mainKeys = lngPost?.map((el) => {
    return {
      categories: el?.categories,
      content: { rendered: el?.content?.rendered },
      date: el?.date,
      excerpt: { rendered: el?.excerpt?.rendered },
      featured_media: el?.featured_media,
      _embedded: el["_embedded"],
      slug: el?.slug,
      title: { rendered: el?.title?.rendered },
      tags: el?.tags,
      id: el?.id,
    };
  });
  return mainKeys;
}
// array di tutti i tags presenti
export async function getTags() {
  const tagsRes = await fetch(BASE_URL + "/tags?per_page=100", {
    cache: "force-cache",
    revalidate: 900,
  });
  const tags = await tagsRes.json();
  return tags;
}

// ricerca codice di un tag
export async function getTagId(tag) {
  const tagsRes = await fetch(BASE_URL + "/tags?per_page=100", {
    cache: "force-cache",
    revalidate: 900,
  });
  const tags = await tagsRes.json();
  const idLocale = (tags?.filter((el) => el?.name === tag))[0].id; //prendo l'id che corrisponde ad it nel database di wp
  return idLocale;
}

// Restituisce un array con tutti i tags relativi ad un post
export async function getTagNameList(array) {
  const tagsRes = await fetch(BASE_URL + "/tags?per_page=100", {
    cache: "force-cache",
    revalidate: 900,
  });
  const tags = await tagsRes.json();
  const objList = tags?.filter((el) => array?.includes(el?.id));
  const nameList = objList?.map((el) => el?.name);
  return nameList;
}

export async function getPost(slug) {
  const posts = await getPosts();
  const postArray = posts.filter((post) => post.slug == slug);
  const post = postArray.length > 0 ? postArray[0] : null;
  return post;
}

export async function getMedia() {
  const mediaRes = await fetch(BASE_URL + "/media", {
    cache: "force-cache",
    revalidate: 900,
  });

  const media = await mediaRes.json();
  return media;
}

// /wp/v2/categories per le categorie
export async function getCategories(lang, onlyFull = true) {
  const categoriesRes = await fetch(BASE_URL + "/categories", {
    cache: "force-cache",
    revalidate: 900,
  });
  const categories = await categoriesRes.json();
  const filteredCategories = categories?.filter(
    (el) => el?.description === lang
  );
  const fullCategories = onlyFull
    ? filteredCategories?.filter((el) => el?.count > 0)
    : filteredCategories;

  if (!!lang) {
    lang === "it" &&
      fullCategories.splice(0, 0, { id: 0, name: "Tutte le categorie" });
    lang === "en" &&
      fullCategories.splice(0, 0, { id: 0, name: "All categories" });
    return fullCategories;
  } else {
    return categories;
  }
}

export async function getSlugs(type) {
  let elements = [];
  elements = await getPosts();
  const elementsIds = elements.map((element) => {
    return {
      params: {
        slug: element.slug,
      },
    };
  });
  return elementsIds;
}
