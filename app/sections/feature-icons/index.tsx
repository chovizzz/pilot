import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface FeatureIconsData {
  heading?: string;
}

type FeatureIconsProps = HydrogenComponentProps<FeatureIconsData>;

export const FeatureIcons = forwardRef<HTMLElement, FeatureIconsProps>(
  (props, ref) => {
    const { heading, children, ...rest } = props;
    const animation = useAnimation();

    return (
      <Section ref={ref} {...rest} data-motion="fade-up" {...animation}>
        {heading && (
          <h2 className="text-3xl font-bold mb-8 text-center">{heading}</h2>
        )}
        {children}
      </Section>
    );
  }
);

FeatureIcons.displayName = "FeatureIcons";

export default FeatureIcons;

export const schema = createSchema({
  type: "feature-icons",
  title: "Feature Icons",
  childTypes: ["feature-icons--grid"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    children: [
      {
        type: "feature-icons--grid",
      },
    ],
  },
});

