import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";
import { ComparisonImagesItem } from "./item";

interface ComparisonImagesData {
  heading?: string;
  subheading?: string;
  layout?: "side-by-side" | "vertical";
}

type ComparisonImagesProps = HydrogenComponentProps<ComparisonImagesData>;

export const ComparisonImages = forwardRef<HTMLElement, ComparisonImagesProps>(
  (props, ref) => {
    const { heading, subheading, layout = "side-by-side", children, ...rest } = props;
    const animation = useAnimation();

    return (
      <Section ref={ref} {...rest} data-motion="fade-up" {...animation}>
        {heading && (
          <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>
        )}
        {subheading && (
          <p className="text-gray-600 mb-8 text-center">{subheading}</p>
        )}
        <div
          className={`grid gap-6 ${
            layout === "side-by-side" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {children}
        </div>
      </Section>
    );
  }
);

ComparisonImages.displayName = "ComparisonImages";

export default ComparisonImages;

export const schema = createSchema({
  type: "comparison-images",
  title: "Comparison Images",
  childTypes: ["comparison-images--item"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Tired of Chunky Fans and Dim Lighting?",
        },
        {
          type: "richtext",
          name: "subheading",
          label: "Subheading",
          defaultValue: "Try Ceiling Fan with LED Light",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "layout",
          label: "Layout",
          defaultValue: "side-by-side",
          configs: {
            options: [
              { value: "side-by-side", label: "Side by Side" },
              { value: "vertical", label: "Vertical" },
            ],
          },
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    heading: "Tired of Chunky Fans and Dim Lighting?",
    subheading: "Try Ceiling Fan with LED Light",
    layout: "side-by-side",
    children: [
      {
        type: "comparison-images--item",
        itemType: "problem",
        image: "https://via.placeholder.com/400x300",
        icon: "❌",
        text: "Problem description",
      },
      {
        type: "comparison-images--item",
        itemType: "solution",
        image: "https://via.placeholder.com/400x300",
        icon: "✅",
        text: "Solution description",
      },
    ],
  },
});

