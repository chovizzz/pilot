import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";

interface TestimonialItemData {
  content?: string;
  authorImage?: WeaverseImage | string;
  authorName?: string;
  productImage?: WeaverseImage | string;
  rating?: number;
  showVerified?: boolean;
  leftLineColor?: string;
  textColor?: string;
  textSize?: number;
  nameColor?: string;
  nameSize?: number;
  starColor?: string;
  verifiedColor?: string;
}

type TestimonialItemProps = HydrogenComponentProps<TestimonialItemData>;

// Star SVG component
const StarIcon = ({ color = "#F3AF3B" }: { color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill={color}
    aria-hidden="true"
    className="h-4 w-4 shrink-0"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Verified checkmark SVG component
const VerifiedIcon = ({ color = "#3BC100" }: { color?: string }) => (
  <svg
    t="1744358114961"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3 ml-[7px]"
  >
    <path
      d="M972.4416 460.8512a132.48 132.48 0 0 0-77.7984-77.7984 368.0768 368.0768 0 0 0-23.04-55.2448 132.608 132.608 0 0 0-65.9456-175.872 134.8096 134.8096 0 0 0-110.4896 0 394.4192 394.4192 0 0 0-55.2448-23.04 132.7104 132.7104 0 0 0-248.576 0 368.1024 368.1024 0 0 0-55.2448 23.04 132.608 132.608 0 0 0-175.872 65.9456 134.8096 134.8096 0 0 0 0 110.4896 437.76 437.76 0 0 0-23.04 55.2448 132.7104 132.7104 0 0 0 0 248.576 368.0768 368.0768 0 0 0 23.04 55.2448 132.608 132.608 0 0 0 65.9456 175.872 134.8096 134.8096 0 0 0 110.4896 0 437.888 437.888 0 0 0 55.2448 23.04 132.7104 132.7104 0 0 0 248.576 0 368.0256 368.0256 0 0 0 55.2448-23.04 132.608 132.608 0 0 0 175.872-65.9456 134.8096 134.8096 0 0 0 0-110.4896 437.76 437.76 0 0 0 23.04-55.2448 132.2496 132.2496 0 0 0 77.7984-170.8032z m-211.3792-29.312l-245.1968 254.2336a67.456 67.456 0 0 1-98.0736 0l-147.1232-152.7552a74.24 74.24 0 0 1 0-102.016 67.5584 67.5584 0 0 1 95.2576-2.816l2.816 2.816 98.0736 102.016 196.1728-203.4944a67.5584 67.5584 0 0 1 95.2576-3.3792l3.3792 3.3792a74.24 74.24 0 0 1-0.5632 102.0672z"
      fill={color}
    />
  </svg>
);

export const TestimonialItem = forwardRef<HTMLDivElement, TestimonialItemProps>(
  (props, ref) => {
    const {
      content,
      authorImage,
      authorName,
      productImage,
      rating = 5,
      showVerified = true,
      leftLineColor = "#ef7b2e",
      textColor = "#421700",
      textSize = 16,
      nameColor = "#000000",
      nameSize = 15,
      starColor = "#F3AF3B",
      verifiedColor = "#3BC100",
      // Filter out props that shouldn't be passed to DOM
      authorTitle,
      hideOnMobile,
      ...rest
    } = props as TestimonialItemData & typeof props & { authorTitle?: string; hideOnMobile?: boolean };

    const animation = useAnimation();

    // Prepare image data for Image component
    const authorImageData: Partial<WeaverseImage> | undefined = authorImage
      ? typeof authorImage === "string"
        ? { url: authorImage, altText: authorName || "Author" }
        : authorImage
      : undefined;
    const productImageData: Partial<WeaverseImage> | undefined = productImage
      ? typeof productImage === "string"
        ? { url: productImage, altText: "Product" }
        : productImage
      : undefined;

    return (
      <div
        ref={ref}
        {...rest}
        className="comment13-item"
        data-motion="fade-up"
        {...animation}
      >
        <div className="flex flex-col gap-4">
          {/* Content section */}
          <div className="w-full pb-[15px] relative">
            {/* Left orange line */}
            <div
              className="absolute h-full left-[-16px]"
              style={{
                width: "4.5px",
                backgroundColor: leftLineColor,
              }}
            />
            {/* Review text */}
            {content && (
              <div
                className="space-y-6 comment13-item-text add_to_wishlist mb-[15px]"
                style={{
                  color: textColor,
                  fontSize: `${textSize}px`,
                }}
              >
                <p>{content}</p>
              </div>
            )}
            {/* Author info */}
            <div className="flex items-center comment13-item-avatar">
              {authorImageData && (
                <div
                  className="imgage-section-container rounded-full mr-2"
                  style={{
                    width: "36px",
                    height: "36px",
                    aspectRatio: "100 / 100",
                  }}
                >
                  <Image
                    data={authorImageData}
                    alt={authorName || ""}
                    className="rounded-full w-full h-full object-cover"
                    loading="lazy"
                    sizes="auto"
                  />
                </div>
              )}
              <div className="flex flex-col justify-between">
                <div className="flex items-center mb-1">
                  {authorName && (
                    <div
                      className="whitespace-nowrap comment13-item-name text-center font-bold mr-2"
                      style={{
                        color: nameColor,
                        fontSize: `${nameSize}px`,
                      }}
                    >
                      {authorName}
                    </div>
                  )}
                  {/* Stars */}
                  <div className="flex items-center comment13-item-star">
                    {Array.from({ length: rating }).map((_, i) => (
                      <span key={i}>
                        <StarIcon color={starColor} />
                      </span>
                    ))}
                  </div>
                </div>
                {/* Verified purchase */}
                {showVerified && (
                  <div
                    className="whitespace-nowrap flex items-center comment13-item-verified"
                    style={{
                      color: verifiedColor,
                      fontSize: "10px",
                    }}
                  >
                    Verified purchase
                    <VerifiedIcon color={verifiedColor} />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Product image */}
          {productImageData && (
            <div
              className="comment13-item-pic imgage-section-container"
              style={{
                aspectRatio: "800 / 800",
              }}
            >
              <Image
                data={productImageData}
                alt=""
                className="w-full h-full object-contain"
                loading="lazy"
                sizes="auto"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

TestimonialItem.displayName = "TestimonialItem";

export default TestimonialItem;

export const schema = createSchema({
  type: "testimonial--item",
  title: "Testimonial",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "textarea",
          name: "content",
          label: "Review Content",
          defaultValue:
            "Very quiet yet powerful the options to dim light and tones of lighting is incredible the power of having app control from your phone as well as a remote just added touches of greatness very easy install clear instruction.",
        },
        {
          type: "image",
          name: "authorImage",
          label: "Author Avatar",
        },
        {
          type: "text",
          name: "authorName",
          label: "Author Name",
          defaultValue: "Emily J.",
        },
        {
          type: "image",
          name: "productImage",
          label: "Product Image",
        },
        {
          type: "range",
          name: "rating",
          label: "Rating",
          defaultValue: 5,
          configs: {
            min: 1,
            max: 5,
            step: 1,
          },
        },
        {
          type: "switch",
          name: "showVerified",
          label: "Show Verified Badge",
          defaultValue: true,
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "textSize",
          label: "Text Size",
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
          name: "nameSize",
          label: "Name Size",
          defaultValue: 15,
          configs: {
            min: 12,
            max: 20,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "leftLineColor",
          label: "Left Line Color",
          defaultValue: "#ef7b2e",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#421700",
        },
        {
          type: "color",
          name: "nameColor",
          label: "Name Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "starColor",
          label: "Star Color",
          defaultValue: "#F3AF3B",
        },
        {
          type: "color",
          name: "verifiedColor",
          label: "Verified Badge Color",
          defaultValue: "#3BC100",
        },
      ],
    },
  ],
  presets: {
    content:
      "Very quiet yet powerful the options to dim light and tones of lighting is incredible the power of having app control from your phone as well as a remote just added touches of greatness very easy install clear instruction.",
    authorName: "Emily J.",
    rating: 5,
    showVerified: true,
    leftLineColor: "#ef7b2e",
    textColor: "#421700",
    nameColor: "#000000",
    starColor: "#F3AF3B",
    verifiedColor: "#3BC100",
  },
});
