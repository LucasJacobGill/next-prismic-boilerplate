import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

import { cn } from "@/lib/utils";
import { AppWindowMac } from "lucide-react";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("homepage").catch(() => notFound());

  return (
    <>
      <section className="relative min-h-svh flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto px-5 space-y-5">
          <AppWindowMac size="32" className="stroke-foreground" />
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white font-sans max-w-x leading-relaxed">
            {page.data.title}
          </h1>
          <div className="text-base font-sans max-w-md leading-relaxed text-foreground/70 text-pretty">
            <PrismicRichText field={page.data.description} />
          </div>
          {page.data.buttons.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {page.data.buttons.map((button, index) => (
                <PrismicNextLink
                  key={index}
                  field={button}
                  className={cn(
                    "rounded-full inline-flex items-center justify-center px-5 py-3 transition-colors font-sans text-base duration-150 ease-linear",
                    button.variant === "Primary"
                      ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
                      : " border border-solid border-black/10 hover:border-transparent hover:bg-black/5 dark:border-white/10 dark:hover:bg-[#1a1a1a]"
                  )}
                >
                  {button?.text || "Learn More"}
                </PrismicNextLink>
              ))}
            </div>
          )}
        </div>
      </section>
      <SliceZone slices={page.data.slices} components={components} />;
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
