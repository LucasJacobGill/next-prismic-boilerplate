import { Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { PrismicRichText, SliceZone } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("blog_post", uid).catch(() => notFound());

  return (
    <>
      <section className="relative flex items-center justify-center py-10">
        <div className="max-w-4xl w-full mx-auto px-5 space-y-5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-sans max-w-x leading-relaxed">
            {page.data.title}
          </h1>
          <p className="text-sm text-foreground/70 font-sans">
            <time>{page.data.date}</time>
          </p>
          <div className="text-base font-sans max-w-md leading-relaxed text-foreground/70 text-pretty">
            <PrismicRichText field={page.data.introduction} />
          </div>
          {page.data.featured_image.url && (
            <div className="aspect-square lg:aspect-video overflow-hidden rounded-lg">
              <PrismicNextImage
                field={page.data.featured_image}
                className="object-cover object-center w-full h-full"
              />
            </div>
          )}
        </div>
      </section>
      <article className="w-full mx-auto px-5 pb-10 text-foreground/90 text-pretty max-w-prose space-y-5">
        <PrismicRichText
          field={page.data.content}
          components={{
            heading1: ({ children }) => (
              <h1 className="text-3xl font-semibold text-foreground font-sans">
                {children}
              </h1>
            ),
            heading2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-foreground font-sans">
                {children}
              </h2>
            ),
            heading3: ({ children }) => (
              <h3 className="text-xl font-semibold text-foreground font-sans">
                {children}
              </h3>
            ),
            heading4: ({ children }) => (
              <h4 className="text-lg font-semibold text-foreground font-sans">
                {children}
              </h4>
            ),
            heading5: ({ children }) => (
              <h5 className="text-base font-semibold text-foreground font-sans">
                {children}
              </h5>
            ),
            heading6: ({ children }) => (
              <h6 className="text-sm font-semibold text-foreground font-sans">
                {children}
              </h6>
            ),
            paragraph: ({ children }) => (
              <p className="leading-relaxed">{children}</p>
            ),
            list: ({ children }) => (
              <ul className="list-disc ml-5">{children}</ul>
            ),
            oList: ({ children }) => (
              <ol className="list-decimal ml-5">{children}</ol>
            ),
            preformatted: ({ children }) => (
              <pre className="bg-foreground/50 dark:bg-foreground/30 p-4 rounded-lg overflow-x-auto">
                <code>{children}</code>
              </pre>
            ),
            image: ({ node }) => (
              <PrismicNextImage field={node} className="rounded-lg" />
            ),
          }}
        />
      </article>
      <SliceZone slices={page.data.slices} components={components} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("blog_post", uid).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("blog_post");

  return pages.map((page) => ({ uid: page.uid }));
}
