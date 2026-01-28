import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";

interface InteractiveProduct360ItemData {
  image?: WeaverseImage | string;
}

type InteractiveProduct360ItemProps =
  HydrogenComponentProps<InteractiveProduct360ItemData>;

export const InteractiveProduct360Item = forwardRef<
  HTMLDivElement,
  InteractiveProduct360ItemProps
>((props, ref) => {
  const { image, ...rest } =
    props as InteractiveProduct360ItemData & typeof props;

  const animation = useAnimation();

  // Prepare image data for Image component
  const imageData: Partial<WeaverseImage> | undefined = image
    ? typeof image === "string"
      ? { url: image, altText: "Product image" }
      : image
    : undefined;

  if (!imageData) {
    return null;
  }

  return (
    <div
      ref={ref}
      {...rest}
      tabIndex={-1}
      style={{ width: "100%", display: "inline-block" }}
      data-motion="fade-up"
      {...animation}
    >
      <Image
        data={imageData}
        alt=""
        width={1000}
        height={1000}
        className="w-full h-full object-contain"
        loading="lazy"
        sizes="auto"
      />
    </div>
  );
});

InteractiveProduct360Item.displayName = "InteractiveProduct360Item";

export default InteractiveProduct360Item;

export const schema = createSchema({
  type: "interactive-product-360--item",
  title: "360° View Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Product Image",
          helpText: "Upload product image from a specific angle (0° to 350°, every 10°)",
        },
      ],
    },
  ],
  presets: {},
});

