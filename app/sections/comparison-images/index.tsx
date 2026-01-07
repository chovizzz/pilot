import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";
import { ComparisonImagesItem } from "./item";

interface ComparisonImagesData {
  heading?: string;
  subheading?: string;
  layout?: "side-by-side" | "vertical";
  maxWidth?: number;
}

type ComparisonImagesProps = HydrogenComponentProps<ComparisonImagesData>;

export const ComparisonImages = forwardRef<HTMLElement, ComparisonImagesProps>(
  (props, ref) => {
    const { heading, subheading, layout = "side-by-side", maxWidth = 500, children, ...rest } = props as ComparisonImagesData & typeof props;
    const animation = useAnimation();

    // Create responsive maxWidth style that only applies on lg (1024px) and above
    // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
    const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
      .comparison-images-responsive {
        width: 100%;
      }
      @media (min-width: 1024px) {
        .comparison-images-responsive {
          max-width: ${maxWidth}px;
        }
      }
    ` : `
      .comparison-images-responsive {
        width: 100%;
      }
    `;

    return (
      <Section ref={ref} {...rest} className="comparison-images-responsive mx-auto" data-motion="fade-up" {...animation}>
        <style>{responsiveMaxWidthStyle}</style>
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
        {
          type: "range",
          name: "maxWidth",
          label: "Max Width",
          defaultValue: 500,
          configs: {
            min: 0,
            max: 1600,
            step: 20,
            unit: "px",
          },
          helpText: "Maximum width on large screens (1024px and above). Set to 0 for unlimited width.",
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

