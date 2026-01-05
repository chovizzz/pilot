import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface PainPointSolutionData {
  heading?: string;
  subheading?: string;
}

type PainPointSolutionProps = HydrogenComponentProps<PainPointSolutionData>;

export const PainPointSolution = forwardRef<
  HTMLElement,
  PainPointSolutionProps
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

PainPointSolution.displayName = "PainPointSolution";

export default PainPointSolution;

export const schema = createSchema({
  type: "pain-point-solution",
  title: "Pain Point Solution",
  childTypes: ["pain-point-solution--items"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Problems & Solutions",
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
    heading: "Problems & Solutions",
    children: [
      {
        type: "pain-point-solution--items",
      },
    ],
  },
});

