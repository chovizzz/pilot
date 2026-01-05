import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef, useState } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface FAQItemData {
  question?: string;
  answer?: string;
}

type FAQItemProps = HydrogenComponentProps<FAQItemData>;

export const FAQItem = forwardRef<HTMLDivElement, FAQItemProps>(
  (props, ref) => {
    const { question, answer } = props;
    const [isOpen, setIsOpen] = useState(false);
    const animation = useAnimation();

    return (
      <div
        ref={ref}
        className="border border-gray-200 rounded-lg overflow-hidden"
        data-motion="fade-up"
        {...animation}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-lg">{question}</span>
          <span className="text-2xl">{isOpen ? "−" : "+"}</span>
        </button>
        {isOpen && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: answer || "" }}
            />
          </div>
        )}
      </div>
    );
  }
);

FAQItem.displayName = "FAQItem";

export default FAQItem;

export const schema = createSchema({
  type: "faq--item",
  title: "FAQ Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "question",
          label: "Question",
          defaultValue: "Is the fan noisy?",
        },
        {
          type: "richtext",
          name: "answer",
          label: "Answer",
          defaultValue: "Designed for quiet operation, it runs smoothly.",
        },
      ],
    },
  ],
  presets: {
    question: "Is the fan noisy?",
    answer: "Designed for quiet operation, it runs smoothly.",
  },
});

