import { Image } from "@shopify/hydrogen";
import type { InspectorGroup, WeaverseImage } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const variants = cva("absolute inset-0 z-[-1] h-full w-full", {
  variants: {
    backgroundFit: {
      fill: "object-fill",
      cover: "object-cover",
      contain: "object-contain",
    },
    backgroundPosition: {
      "top left": "object-[top_left]",
      "top center": "object-[top_center]",
      "top right": "object-[top_right]",
      "center left": "object-[center_left]",
      "center center": "object-[center_center]",
      "center right": "object-[center_right]",
      "bottom left": "object-[bottom_left]",
      "bottom center": "object-[bottom_center]",
      "bottom right": "object-[bottom_right]",
    },
  },
  defaultVariants: {
    backgroundFit: "cover",
    backgroundPosition: "center center",
  },
});

export type BackgroundImageProps = VariantProps<typeof variants> & {
  backgroundImage?: WeaverseImage | string;
  width?: number;
};

export function BackgroundImage(props: BackgroundImageProps & { loading?: "lazy" | "eager" }) {
  const { backgroundImage, backgroundFit, backgroundPosition, loading = "lazy", width } = props;
  if (backgroundImage) {
    const data =
      typeof backgroundImage === "string"
        ? { url: backgroundImage, altText: "Section background" }
        : backgroundImage;
    
    // If width is provided, use it to generate responsive sizes
    // Otherwise, use default responsive sizes for full-width backgrounds
    let sizes: string;
    if (width && width > 0) {
      // Calculate responsive sizes based on the provided width
      // For high-DPI displays, browsers will automatically select 2x resolution
      sizes = `(min-width: ${width}px) ${width}px, 100vw`;
    } else {
      // Default responsive sizes for full-width backgrounds
      sizes = "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, (min-width: 768px) 768px, 100vw";
    }
    
    // If width is provided, pass it to Image component to generate appropriate srcset
    // Otherwise, let Hydrogen Image component generate srcset based on sizes and original dimensions
    return (
      <Image
        className={variants({ backgroundFit, backgroundPosition })}
        data={data}
        sizes={sizes}
        loading={loading}
        {...(width && width > 0 ? { width } : {})}
      />
    );
  }
  return null;
}

export const backgroundInputs: InspectorGroup["inputs"] = [
  {
    type: "select",
    name: "backgroundFor",
    label: "Background for",
    configs: {
      options: [
        { value: "section", label: "Section" },
        { value: "content", label: "Content" },
      ],
    },
    defaultValue: "section",
  },
  {
    type: "color",
    name: "backgroundColor",
    label: "Background color",
    defaultValue: "",
  },
  {
    type: "image",
    name: "backgroundImage",
    label: "Background image",
  },
  {
    type: "select",
    name: "backgroundFit",
    label: "Background fit",
    configs: {
      options: [
        { value: "fill", label: "Fill" },
        { value: "cover", label: "Cover" },
        { value: "contain", label: "Contain" },
      ],
    },
    defaultValue: "cover",
    condition: (data: BackgroundImageProps) => Boolean(data.backgroundImage),
  },
  {
    type: "position",
    name: "backgroundPosition",
    label: "Background position",
    defaultValue: "center center",
    condition: (data: BackgroundImageProps) => Boolean(data.backgroundImage),
  },
];
