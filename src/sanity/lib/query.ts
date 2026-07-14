import { defineQuery } from "next-sanity";

export const blogpost=defineQuery(`*[_type=="blog"]{
    blogTitle,
    blogDescription,
    slug,
    "image":image.asset->url
    }`)