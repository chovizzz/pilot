import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface FeatureComparisonData {
  heading?: string;
  subheading?: string;
  maxWidth?: number;
}

type FeatureComparisonProps = HydrogenComponentProps<FeatureComparisonData>;

export const FeatureComparison = forwardRef<
  HTMLElement,
  FeatureComparisonProps
>(  (props, ref) => {
    const { heading, subheading, maxWidth = 500, children, ...rest } = props as FeatureComparisonData & typeof props;
    const animation = useAnimation();

    // Create responsive maxWidth style that only applies on lg (1024px) and above
    // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
    const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
      .feature-comparison-responsive {
        width: 100%;
      }
      @media (min-width: 1024px) {
        .feature-comparison-responsive {
          max-width: ${maxWidth}px;
        }
      }
    ` : `
      .feature-comparison-responsive {
        width: 100%;
      }
    `;

    return (
      <Section ref={ref} {...rest} className="feature-comparison-responsive mx-auto" data-motion="fade-up" {...animation}>
        <style>{responsiveMaxWidthStyle}</style>
      {heading && (
        <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>
      )}
      {subheading && (
        <p className="text-gray-600 mb-8 text-center">{subheading}</p>
      )}
      {children}
    </Section>
  );
});

FeatureComparison.displayName = "FeatureComparison";

export default FeatureComparison;

export const schema = createSchema({
  type: "feature-comparison",
  title: "Feature Comparison",
  childTypes: ["feature-comparison--table"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Feature Comparison",
        },
        {
          type: "richtext",
          name: "subheading",
          label: "Subheading",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "text",
          name: "id",
          label: "Section ID",
          helpText: "Set a unique ID for anchor links (e.g., 'feature-comparison'). Leave empty to auto-generate.",
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
    heading: "Feature Comparison",
    children: [
      {
        type: "feature-comparison--table",
      },
    ],
  },
});

