import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { Image } from "~/components/image";

interface PainPointSolutionItemData {
  painPointTitle?: string;
  painPoint?: string;
  painPointImage?: WeaverseImage | string;
  painPointBgColor?: string;
  painPointTextColor?: string;
  painPointTitleSize?: number;
  painPointTextSize?: number;
  solutionTitle?: string;
  solution?: string;
  solutionBgColor?: string;
  solutionTextColor?: string;
  solutionTitleSize?: number;
  solutionTextSize?: number;
  itemWidth?: number;
}

type PainPointSolutionItemProps =
  HydrogenComponentProps<PainPointSolutionItemData>;

// Red exclamation mark icon SVG
const ExclamationIcon = () => (
  <svg
    t="1744874346287"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="white"
  >
    <path d="M450.602458 665.598073a62.463819 62.463819 0 0 0 122.879645 0L614.441984 102.399704A102.615282 102.615282 0 0 0 512.04228 0 105.256116 105.256116 0 0 0 409.642577 112.639674L450.602458 665.598073z m61.439822 153.599556a102.399704 102.399704 0 1 0 102.399704 102.399703 96.740773 96.740773 0 0 0-102.399704-102.399703z" />
  </svg>
);

// Green checkmark icon SVG
const CheckmarkIcon = () => (
  <svg
    t="1744874698021"
    viewBox="0 0 1025 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="white"
  >
    <path d="M483.84768 867.808C466.37568 885.792 441.73568 896 415.87968 896 390.05568 896 365.41568 885.792 347.94368 867.808L27.46368 547.552C-9.17632 508.864-9.17632 450.336 27.46368 411.648 44.26368 394.944 67.30368 385.088 91.68768 384.256 118.72768 383.008 144.93568 393.024 163.46368 411.648L415.87968 664 860.61568 219.552C878.31168 201.952 902.88768 192 928.58368 192 954.24768 192 978.82368 201.952 996.51968 219.552 1033.15968 258.208 1033.15968 316.704 996.51968 355.36L483.84768 867.808Z" />
  </svg>
);

export const PainPointSolutionItem = forwardRef<
  HTMLDivElement,
  PainPointSolutionItemProps
>((props, ref) => {
  const {
    painPointTitle,
    painPoint,
    painPointImage,
    painPointBgColor = "#9e9e9e",
    painPointTextColor = "#101010",
    painPointTitleSize = 16,
    painPointTextSize = 13,
    solutionTitle,
    solution,
    solutionBgColor = "#ef7b2e",
    solutionTextColor = "#101010",
    solutionTitleSize = 16,
    solutionTextSize = 13,
    itemWidth = 80,
    ...rest
  } = props as PainPointSolutionItemData & typeof props;

  const animation = useAnimation();

  // Prepare image data for Image component
  const painPointImageData: Partial<WeaverseImage> | undefined = painPointImage
    ? typeof painPointImage === "string"
      ? { url: painPointImage, altText: "Pain point" }
      : painPointImage
    : undefined;

  return (
    <div
      ref={ref}
      {...rest}
      className="comment14-list-item shrink-0"
      style={{ width: `${itemWidth}%` }}
      data-motion="slide-in"
      {...animation}
    >
      {/* Pain Point Section */}
      <div
        className="comment14-item-top mb-2 p-4 rounded-md"
        style={{ backgroundColor: painPointBgColor }}
      >
        <div className="flex gap-2 items-start mb-2">
          <div
            className="shrink-0 rounded-full p-1"
            style={{ backgroundColor: "#ff0000" }}
          >
            <ExclamationIcon />
          </div>
          <div>
            {painPointTitle && (
              <div
                className="comment14-item-top-title font-bold mb-1"
                style={{
                  fontSize: `${painPointTitleSize}px`,
                  color: painPointTextColor,
                }}
              >
                {painPointTitle}
              </div>
            )}
            {painPoint && (
              <div
                className="comment14-item-top-content leading-normal"
                style={{
                  fontSize: `${painPointTextSize}px`,
                  color: painPointTextColor,
                }}
              >
                <p>{painPoint}</p>
              </div>
            )}
          </div>
        </div>
        {painPointImageData && (
          <div
            className="imgage-section-container rounded-md overflow-hidden"
            style={{
              aspectRatio: "500 / 386",
            }}
          >
            <Image
              data={painPointImageData}
              alt="Pain point"
              className="w-full h-full object-cover"
              loading="lazy"
              sizes="auto"
            />
          </div>
        )}
      </div>

      {/* Solution Section */}
      <div
        className="comment14-item-bottom p-4 rounded-md flex items-start gap-2"
        style={{ backgroundColor: solutionBgColor }}
      >
        <div
          className="shrink-0 rounded-full p-1"
          style={{ backgroundColor: "#4ad37b" }}
        >
          <CheckmarkIcon />
        </div>
        <div>
          {solutionTitle && (
            <div
              className="comment14-item-bottom-title font-bold mb-1"
              style={{
                fontSize: `${solutionTitleSize}px`,
                color: solutionTextColor,
              }}
            >
              {solutionTitle}
            </div>
          )}
          {solution && (
            <div
              className="comment14-item-bottom-content leading-normal"
              style={{
                fontSize: `${solutionTextSize}px`,
                color: solutionTextColor,
              }}
            >
              <p>{solution}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PainPointSolutionItem.displayName = "PainPointSolutionItem";

export default PainPointSolutionItem;

export const schema = createSchema({
  type: "pain-point-solution--item",
  title: "Pain Point Item",
  settings: [
    {
      group: "Pain Point",
      inputs: [
        {
          type: "text",
          name: "painPointTitle",
          label: "Pain Point Title",
          defaultValue: "Pain Point 1",
        },
        {
          type: "textarea",
          name: "painPoint",
          label: "Pain Point Description",
          defaultValue: "Traditional fans take up valuable floor space",
        },
        {
          type: "image",
          name: "painPointImage",
          label: "Pain Point Image",
        },
        {
          type: "color",
          name: "painPointBgColor",
          label: "Background Color",
          defaultValue: "#9e9e9e",
        },
        {
          type: "color",
          name: "painPointTextColor",
          label: "Text Color",
          defaultValue: "#101010",
        },
        {
          type: "range",
          name: "painPointTitleSize",
          label: "Title Size",
          defaultValue: 16,
          configs: {
            min: 12,
            max: 24,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "painPointTextSize",
          label: "Text Size",
          defaultValue: 13,
          configs: {
            min: 10,
            max: 20,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Solution",
      inputs: [
        {
          type: "text",
          name: "solutionTitle",
          label: "Solution Title",
          defaultValue: "Ceiling Fan with LED Light:",
        },
        {
          type: "textarea",
          name: "solution",
          label: "Solution Description",
          defaultValue: "Screw-in ceiling fan that fits any standard light socket - no space wasted!",
        },
        {
          type: "color",
          name: "solutionBgColor",
          label: "Background Color",
          defaultValue: "#ef7b2e",
        },
        {
          type: "color",
          name: "solutionTextColor",
          label: "Text Color",
          defaultValue: "#101010",
        },
        {
          type: "range",
          name: "solutionTitleSize",
          label: "Title Size",
          defaultValue: 16,
          configs: {
            min: 12,
            max: 24,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "solutionTextSize",
          label: "Text Size",
          defaultValue: 13,
          configs: {
            min: 10,
            max: 20,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    painPointTitle: "Pain Point 1",
    painPoint: "Traditional fans take up valuable floor space",
    solutionTitle: "Ceiling Fan with LED Light:",
    solution: "Screw-in ceiling fan that fits any standard light socket - no space wasted!",
    painPointBgColor: "#9e9e9e",
    painPointTextColor: "#101010",
    solutionBgColor: "#ef7b2e",
    solutionTextColor: "#101010",
  },
});

