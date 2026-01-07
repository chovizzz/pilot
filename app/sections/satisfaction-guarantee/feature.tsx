import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { Image } from "~/components/image";

interface SatisfactionGuaranteeFeatureData {
  text?: string;
  iconImage?: WeaverseImage | string;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
}

type SatisfactionGuaranteeFeatureProps = HydrogenComponentProps<SatisfactionGuaranteeFeatureData>;

// Checkmark Icon SVG
const CheckmarkIcon = () => (
  <svg
    t="1744874698021"
    viewBox="0 0 1025 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="5321"
    width="14"
    height="14"
    fill="currentColor"
  >
    <path
      d="M483.84768 867.808C466.37568 885.792 441.73568 896 415.87968 896 390.05568 896 365.41568 885.792 347.94368 867.808L27.46368 547.552C-9.17632 508.864-9.17632 450.336 27.46368 411.648 44.26368 394.944 67.30368 385.088 91.68768 384.256 118.72768 383.008 144.93568 393.024 163.46368 411.648L415.87968 664 860.61568 219.552C878.31168 201.952 902.88768 192 928.58368 192 954.24768 192 978.82368 201.952 996.51968 219.552 1033.15968 258.208 1033.15968 316.704 996.51968 355.36L483.84768 867.808Z"
      p-id="5322"
    />
  </svg>
);

export const SatisfactionGuaranteeFeature = forwardRef<
  HTMLDivElement,
  SatisfactionGuaranteeFeatureProps
>((props, ref) => {
  const {
    text = "Feature",
    iconImage,
    bgColor = "#EF7B2E",
    textColor = "#ffffff",
    fontSize = 12,
    ...rest
  } = props as SatisfactionGuaranteeFeatureData & typeof props;

  const animation = useAnimation();

  const iconImageData: Partial<WeaverseImage> | undefined = iconImage
    ? typeof iconImage === "string"
      ? { url: iconImage, altText: "Icon" }
      : iconImage
    : undefined;

  return (
    <div
      ref={ref}
      {...rest}
      className="comment16-feature rounded-full py-2 px-4 leading-none flex items-center gap-2"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontSize: `${fontSize}px`,
      }}
      data-motion="fade-up"
      {...animation}
    >
      <div>{text}</div>
      {iconImageData ? (
        <div className="imgage-section-container w-4">
          <Image
            data={iconImageData}
            alt="Icon"
            width={60}
            height={60}
            className="w-full h-auto object-contain"
            loading="lazy"
            sizes="auto"
          />
        </div>
      ) : (
        <div className="text-current">
          <CheckmarkIcon />
        </div>
      )}
    </div>
  );
});

SatisfactionGuaranteeFeature.displayName = "SatisfactionGuaranteeFeature";

export default SatisfactionGuaranteeFeature;

export const schema = createSchema({
  type: "satisfaction-guarantee--feature",
  title: "Feature",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "text",
          label: "Feature Text",
          defaultValue: "Ease of Installation",
        },
        {
          type: "image",
          name: "iconImage",
          label: "Icon Image",
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
          defaultValue: "#EF7B2E",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#ffffff",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "fontSize",
          label: "Font Size",
          defaultValue: 12,
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
    text: "Ease of Installation",
    bgColor: "#EF7B2E",
    textColor: "#ffffff",
    fontSize: 12,
  },
});

