import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef, useState } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface FAQItemData {
  question?: string;
  answer?: string;
  bgColor?: string;
  borderColor?: string;
  questionColor?: string;
  questionSize?: number;
  answerColor?: string;
  answerSize?: number;
}

type FAQItemProps = HydrogenComponentProps<FAQItemData>;

// X icon SVG component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    t="1744341726659"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M851.416 217.84l-45.256-45.248L512 466.744l-294.152-294.16-45.256 45.256L466.744 512l-294.152 294.16 45.248 45.256L512 557.256l294.16 294.16 45.256-45.256L557.256 512z" />
  </svg>
);

// Green checkmark icon SVG component
const CheckIcon = () => (
  <svg
    t="1744350079490"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
  >
    <path
      d="M512 0a512 512 0 1 0 0 1024A512 512 0 0 0 512 0z"
      fill="#FFFFFF"
    />
    <path
      d="M512 0a512 512 0 1 0 0 1024A512 512 0 0 0 512 0z m344.283429 380.854857l-365.275429 365.275429-0.438857 0.438857a72.923429 72.923429 0 0 1-103.424 0l-0.438857-0.438857-218.989715-218.989715a73.142857 73.142857 0 1 1 103.424-103.424L438.857143 591.433143l314.002286-314.002286a73.142857 73.142857 0 0 1 103.424 103.424z"
      fill="#16C60C"
    />
  </svg>
);

export const FAQItem = forwardRef<HTMLDivElement, FAQItemProps>(
  (props, ref) => {
    const {
      question,
      answer,
      bgColor = "#FAE2D2",
      borderColor = "#C4C4C4",
      questionColor = "#000000",
      questionSize = 15,
      answerColor = "#000000",
      answerSize = 15,
      ...rest
    } = props as FAQItemData & typeof props;
    const [isOpen, setIsOpen] = useState(false);
    const animation = useAnimation();

    return (
      <div
        ref={ref}
        {...rest}
        className="pb-1.5 faq6-list-box border-b"
        style={{
          borderColor,
          backgroundColor: bgColor,
        }}
        data-motion="fade-up"
        {...animation}
      >
        <div className="cursor-pointer">
          <div className="w-full question-line">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="font-semibold block no-underline capitalize relative py-[18px] flex justify-between gap-2 w-full text-left"
              style={{
                color: questionColor,
                fontSize: `${questionSize}px`,
              }}
            >
              {question}
              <div>
                <XIcon
                  className={`w-[15px] transition-transform ${
                    isOpen ? "" : "rotate-[-45deg]"
                  }`}
                />
              </div>
            </button>
          </div>
          <div
            className={`relative answer-fade answer-contents answer-line flex gap-[7px] answer-collapse transition-all duration-300 overflow-hidden ${
              isOpen ? "show" : ""
            }`}
            style={{
              maxHeight: isOpen ? "1000px" : "0",
              opacity: isOpen ? 1 : 0,
            }}
          >
            <div style={{ width: "16px", flexShrink: 0 }}>
              <CheckIcon />
            </div>
            <div
              className="flex-1"
              style={{
                color: answerColor,
                fontSize: `${answerSize}px`,
              }}
            >
              <p>{answer}</p>
            </div>
          </div>
        </div>
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
          defaultValue: "What sockets does this fit?",
        },
        {
          type: "textarea",
          name: "answer",
          label: "Answer",
          defaultValue: "Fits standard E26 light sockets found in most homes.",
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
          name: "borderColor",
          label: "Border Color",
          defaultValue: "#C4C4C4",
        },
        {
          type: "color",
          name: "questionColor",
          label: "Question Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "answerColor",
          label: "Answer Color",
          defaultValue: "#000000",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "questionSize",
          label: "Question Size",
          defaultValue: 15,
          configs: {
            min: 12,
            max: 24,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "answerSize",
          label: "Answer Size",
          defaultValue: 15,
          configs: {
            min: 12,
            max: 24,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    question: "What sockets does this fit?",
    answer: "Fits standard E26 light sockets found in most homes.",
    bgColor: "#FAE2D2",
    borderColor: "#C4C4C4",
    questionColor: "#000000",
    answerColor: "#000000",
    questionSize: 15,
    answerSize: 15,
  },
});

