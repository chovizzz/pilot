import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";

interface ComparisonImagesItemData {
  itemType?: "problem" | "solution";
  image?: WeaverseImage | string;
  icon?: string;
  text?: string;
  useGrayscale?: boolean;
}

type ComparisonImagesItemProps = HydrogenComponentProps<ComparisonImagesItemData>;

export const ComparisonImagesItem = forwardRef<
  HTMLDivElement,
  ComparisonImagesItemProps
>((props, ref) => {
  const {
    itemType = "problem",
    image,
    icon = itemType === "problem" ? "❌" : "✅",
    text,
    useGrayscale = itemType === "problem",
  } = props;

  const animation = useAnimation();
  const textColor = itemType === "problem" ? "text-red-600" : "text-green-600";

  // Extract image URL from WeaverseImage object or string
  const imageUrl = image 
    ? (typeof image === "string" ? image : image.url)
    : null;

  return (
    <div
      ref={ref}
      className="relative"
      data-motion="slide-in"
      {...animation}
    >
      {imageUrl && (
        <div className={`relative overflow-hidden rounded-lg ${useGrayscale ? "grayscale" : ""}`}>
          <Image
            src={imageUrl}
            alt={text || ""}
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 p-6">
            <div className={`text-4xl mb-4 ${textColor}`}>{icon}</div>
            {text && (
              <p className={`text-white text-center font-medium ${textColor.replace("text-", "text-")}`}>
                {text}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

ComparisonImagesItem.displayName = "ComparisonImagesItem";

export default ComparisonImagesItem;

export const schema = createSchema({
  type: "comparison-images--item",
  title: "Comparison Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "select",
          name: "itemType",
          label: "Type",
          defaultValue: "problem",
          configs: {
            options: [
              { value: "problem", label: "Problem" },
              { value: "solution", label: "Solution" },
            ],
          },
        },
        {
          type: "image",
          name: "image",
          label: "Image",
        },
        {
          type: "text",
          name: "icon",
          label: "Icon",
          defaultValue: "❌",
        },
        {
          type: "richtext",
          name: "text",
          label: "Text",
          defaultValue: "Description",
        },
      ],
    },
    {
      group: "Style",
      inputs: [
        {
          type: "switch",
          name: "useGrayscale",
          label: "Use Grayscale",
          defaultValue: true,
          condition: (data: ComparisonImagesItemData) => data.itemType === "problem",
        },
      ],
    },
  ],
  presets: {
    type: "problem",
    icon: "❌",
    text: "Problem description",
    useGrayscale: true,
  },
});

