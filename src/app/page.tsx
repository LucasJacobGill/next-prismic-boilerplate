import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("homepage").catch(() => notFound());

  console.log("page data:", page.data);

  return (
    <>
      <section className="relative min-h-svh flex items-center justify-center">
        <div className="container mx-auto px-5">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white font-sans max-w-x leading-relaxed">
            {page.data.title}
          </h1>
          <PrismicRichText field={page.data.description} />
          {page.data.buttons.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {page.data.buttons.map((button, index) => (
                <PrismicNextLink
                  key={index}
                  field={button}
                  className="rounded-full flex items-center justify-center px-4 py-2 bg-white text-black transition"
                >
                  {button?.text || "Learn More"}
                </PrismicNextLink>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* <SliceZone slices={page.data.slices} components={components} />; */}
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("homepage").catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}
