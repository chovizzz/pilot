import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface Product360ViewItemData {
  image?: WeaverseImage | string;
  maxWidth?: number;
  rotationDuration?: number;
}

type Product360ViewItemProps = HydrogenComponentProps<Product360ViewItemData>;

export const Product360ViewItem = forwardRef<
  HTMLDivElement,
  Product360ViewItemProps
>((props, ref) => {
  const { image, maxWidth = 300, rotationDuration = 0.5, ...rest } = props as Product360ViewItemData & typeof props;

  const animation = useAnimation();

  // Extract image URL from WeaverseImage object or string
  const imageUrl = image
    ? typeof image === "string"
      ? image
      : image.url
    : null;

  if (!imageUrl) {
    return null;
  }

  // Create Y-axis rotation animation keyframes (3D rotation) with fade effect
  // Forward rotation (clockwise): 0deg -> 360deg
  // Backward rotation (counterclockwise): 0deg -> -360deg
  const rotationKeyframes = `
    @keyframes product-360-rotate-y-forward {
      0% { 
        transform: perspective(1000px) rotateY(0deg);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% { 
        transform: perspective(1000px) rotateY(360deg);
        opacity: 1;
      }
    }
    @keyframes product-360-rotate-y-backward {
      0% { 
        transform: perspective(1000px) rotateY(0deg);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% { 
        transform: perspective(1000px) rotateY(-360deg);
        opacity: 1;
      }
    }
    .product-360-rotating-forward {
      animation: product-360-rotate-y-forward var(--rotation-duration, 0.5s) linear;
    }
    .product-360-rotating-backward {
      animation: product-360-rotate-y-backward var(--rotation-duration, 0.5s) linear;
    }
  `;

  return (
    <>
      <style>{rotationKeyframes}</style>
      <div
        ref={ref}
        {...rest}
        tabIndex={-1}
        style={{ width: "100%", display: "inline-block" }}
        data-motion="fade-up"
        {...animation}
      >
        <div
          className="imgage-section-container mx-auto max-w-[250px] md:max-w-[300px]"
          style={{
            aspectRatio: "1000 / 1000",
            maxWidth: `${maxWidth}px`,
            "--rotation-duration": `${rotationDuration}s`,
          } as React.CSSProperties}
        >
          <img
            src={imageUrl}
            alt=""
            width="1000"
            height="1000"
            className="w-full h-full object-contain pointer-events-none product-360-image"
            data-rotation-duration={rotationDuration}
          />
        </div>
      </div>
    </>
  );
});

Product360ViewItem.displayName = "Product360ViewItem";

export default Product360ViewItem;

export const schema = createSchema({
  type: "product-360-view--item",
  title: "360° View Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Product Image",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "maxWidth",
          label: "Max Width",
          defaultValue: 300,
          configs: {
            min: 200,
            max: 500,
            step: 10,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "rotationDuration",
          label: "Rotation Duration",
          defaultValue: 0.5,
          configs: {
            min: 0.2,
            max: 2,
            step: 0.1,
            unit: "s",
          },
          helpText: "Duration of rotation animation when switching slides (lower = faster)",
        },
      ],
    },
  ],
  presets: {
    maxWidth: 300,
    rotationDuration: 0.5,
  },
});

