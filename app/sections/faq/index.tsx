import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface FAQData {
  heading?: string;
}

type FAQProps = HydrogenComponentProps<FAQData>;

export const FAQ = forwardRef<HTMLElement, FAQProps>((props, ref) => {
  const { heading, children, ...rest } = props;
  const animation = useAnimation();

  return (
    <Section ref={ref} {...rest} data-motion="fade-up" {...animation}>
      {heading && (
        <h2 className="text-3xl font-bold mb-8 text-center">{heading}</h2>
      )}
      <div className="space-y-4">{children}</div>
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
          defaultValue: "Frequently Asked Questions",
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    heading: "Frequently Asked Questions",
    children: [
      {
        type: "faq--items",
      },
    ],
  },
});

