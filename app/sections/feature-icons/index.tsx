import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface FeatureIconsData {
  heading?: string;
  maxWidth?: number;
}

type FeatureIconsProps = HydrogenComponentProps<FeatureIconsData>;

export const FeatureIcons = forwardRef<HTMLElement, FeatureIconsProps>(
  (props, ref) => {
    const { heading, maxWidth = 500, children, ...rest } = props as FeatureIconsData & typeof props;
    const animation = useAnimation();

    // Create responsive maxWidth style that only applies on lg (1024px) and above
    // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
    const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
      .feature-icons-responsive {
        width: 100%;
      }
      @media (min-width: 1024px) {
        .feature-icons-responsive {
          max-width: ${maxWidth}px;
        }
      }
    ` : `
      .feature-icons-responsive {
        width: 100%;
      }
    `;

    return (
      <Section ref={ref} {...rest} className="feature-icons-responsive mx-auto" data-motion="fade-up" {...animation}>
        <style>{responsiveMaxWidthStyle}</style>
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
    {
      group: "Layout",
      inputs: [
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
    children: [
      {
        type: "feature-icons--grid",
      },
    ],
  },
});

