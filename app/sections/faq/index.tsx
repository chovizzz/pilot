import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface FAQData {
  heading?: string;
  maxWidth?: number;
  padding?: number;
  bgColor?: string;
  headingColor?: string;
  headingSize?: number;
}

type FAQProps = HydrogenComponentProps<FAQData>;

export const FAQ = forwardRef<HTMLElement, FAQProps>((props, ref) => {
  const {
    heading = "Frequently Asked Questions (FAQ)",
    maxWidth = 500,
    padding = 36,
    bgColor = "#FAE2D2",
    headingColor = "#000000",
    headingSize = 24,
    children,
    ...rest
  } = props as FAQData & typeof props;
  const animation = useAnimation();

  return (
    <Section
      ref={ref}
      {...rest}
      style={{
        backgroundColor: bgColor,
        padding: `${padding}px 20px 15px`,
        maxWidth: `${maxWidth}px`,
      }}
      data-motion="fade-up"
      {...animation}
    >
      <div className="w-full max-w-7xl mx-auto">
        {heading && (
          <div className="text-center mb-3 lg:mb-6">
            <div
              className="font-bold capitalize"
              style={{
                color: headingColor,
                fontSize: `${headingSize}px`,
              }}
            >
              {heading}
            </div>
          </div>
        )}
        <div className="w-full faq6-list">{children}</div>
      </div>
    </Section>
  );
});

FAQ.displayName = "FAQ";

export default FAQ;

export const schema = createSchema({
  type: "faq",
  title: "FAQ",
  childTypes: ["faq--items"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Frequently Asked Questions (FAQ)",
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
            min: 300,
            max: 800,
            step: 10,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "padding",
          label: "Padding Top",
          defaultValue: 36,
          configs: {
            min: 0,
            max: 80,
            step: 4,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#FAE2D2",
        },
        {
          type: "color",
          name: "headingColor",
          label: "Heading Color",
          defaultValue: "#000000",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "headingSize",
          label: "Heading Size",
          defaultValue: 24,
          configs: {
            min: 16,
            max: 40,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    heading: "Frequently Asked Questions (FAQ)",
    maxWidth: 500,
    padding: 36,
    bgColor: "#FAE2D2",
    headingColor: "#000000",
    headingSize: 24,
    children: [
      {
        type: "faq--items",
      },
    ],
  },
});

