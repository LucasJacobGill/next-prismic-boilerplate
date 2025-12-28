import { FC, ViewTransition } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

/**
 * Props for `BlogPosts`.
 */
export type BlogPostsProps = SliceComponentProps<Content.BlogPostsSlice>;

/**
 * Component for "BlogPosts" Slices.
 */
const BlogPosts: FC<BlogPostsProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-4xl w-full mx-auto px-5 space-y-5">
        <div className="grid md:grid-cols-3 gap-y-8 gap-x-4">
          {slice.primary.selected_posts.map(
            (item, index) =>
              isFilled.link(item.post) && (
                <PrismicNextLink
                  key={index}
                  field={item.post}
                  className="grid grid-rows-subgrid gap-3 row-span-4 hover:opacity-80 transition-opacity duration-150 ease-linear"
                >
                  <ViewTransition name={`featured-image-${item.post.uid}`}>
                    <PrismicNextImage
                      field={item.post.data?.featured_image}
                      className="aspect-square rounded-lg object-cover object-center"
                    />
                  </ViewTransition>
                  <h4 className="text-lg font-semibold text-foreground font-sans">
                    {item.post.data?.title || "Untitled Post"}
                  </h4>
                  <p className="text-sm text-foreground/70 font-sans">
                    <time dateTime={item.post.data?.date || ""}>
                      {item.post.data?.date}
                    </time>
                  </p>
                  <PrismicRichText
                    field={item.post.data?.introduction}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="text-sm text-foreground/70 font-sans leading-relaxed">
                          {children}
                        </p>
                      ),
                    }}
                  />
                </PrismicNextLink>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPosts;
