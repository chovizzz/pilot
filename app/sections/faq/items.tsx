import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { FAQItem } from "./item";

export const FAQItems = forwardRef<HTMLDivElement, HydrogenComponentProps>(
  (props, ref) => {
    const { ...rest } = props;
    const childInstances = useChildInstances();
    const animation = useAnimation();

    return (
      <div
        ref={ref}
        {...rest}
        className="w-full faq6-list"
        data-motion="fade-up"
        {...animation}
      >
        {childInstances.map((child, index) => (
          <FAQItem key={`faq-item-${index}`} {...(child.data as any)} />
        ))}
      </div>
    );
  }
);

FAQItems.displayName = "FAQItems";

export default FAQItems;

export const schema = createSchema({
  type: "faq--items",
  title: "FAQ Items",
  childTypes: ["faq--item"],
  settings: [],
  presets: {
    children: [
      {
        type: "faq--item",
        question: "Is the fan noisy?",
        answer: "Designed for quiet operation, it runs smoothly.",
      },
    ],
  },
});

