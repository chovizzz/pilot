import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface FeatureComparisonData {
  heading?: string;
  subheading?: string;
}

type FeatureComparisonProps = HydrogenComponentProps<FeatureComparisonData>;

export const FeatureComparison = forwardRef<
  HTMLElement,
  FeatureComparisonProps
>((props, ref) => {
  const { heading, subheading, children, ...rest } = props;
  const animation = useAnimation();

  return (
    <Section ref={ref} {...rest} data-motion="fade-up" {...animation}>
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

