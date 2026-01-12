import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

interface TestimonialItemV2Data {
  id?: string;
  content?: string;
  authorName?: string;
  productImage?: WeaverseImage | string;
  rating?: number;
  showVerified?: boolean;
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
  textSize?: number;
  nameColor?: string;
  nameSize?: number;
  verifiedIconColor?: string;
  starIconImage?: WeaverseImage | string;
  layout?: "vertical" | "horizontal";
  imageRatio?: number;
  imageAlignment?: "center" | "start" | "end";
}

type TestimonialItemV2Props = HydrogenComponentProps<TestimonialItemV2Data>;

// Image alignment variants
const imageAlignmentVariants = cva("flex imgage-section-container", {
  variants: {
    alignment: {
      center: "justify-center",
      start: "justify-start",
      end: "justify-end",
    },
    layout: {
      vertical: "mt-2 mb-2",
      horizontal: "mt-2 mb-2 sm:mt-0 sm:mb-0",
    },
  },
  compoundVariants: [
    // Horizontal layout: apply vertical alignment (items-*)
    {
      layout: "horizontal",
      alignment: "center",
      class: "sm:items-center",
    },
    {
      layout: "horizontal",
      alignment: "start",
      class: "sm:items-start",
    },
    {
      layout: "horizontal",
      alignment: "end",
      class: "sm:items-end",
    },
  ],
  defaultVariants: {
    alignment: "center",
    layout: "vertical",
  },
});

// Verified checkmark SVG component (green circle with checkmark)
const VerifiedCheckIcon = ({ color = "#3A8128" }: { color?: string }) => (
  <svg
    viewBox="0 0 1025 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[30px] h-auto shrink-0"
  >
    <path
      d="M512.083915 64.734385c-247.21296 0-447.607415 200.390362-447.607415 447.603322s200.391385 447.608439 447.607415 447.608439c247.208866 0 447.605369-200.393432 447.605369-447.608439C959.687237 265.126794 759.292782 64.734385 512.083915 64.734385zM524.007028 665.571858l-71.565282 70.39968-71.593936-70.39968 0.019444-0.020467L213.850554 501.239419l71.566305-70.421171 167.014653 164.328345L738.750971 313.452701l71.566305 70.422194L524.004981 665.568788 524.007028 665.571858z"
      fill={color}
    />
  </svg>
);

export const TestimonialItemV2 = forwardRef<
  HTMLDivElement,
  TestimonialItemV2Props
>((props, ref) => {
  const {
    id,
    content,
    authorName,
    productImage,
    rating = 5,
    showVerified = true,
    borderColor = "#e5e7eb",
    bgColor = "#ffffff",
    textColor = "#252a32",
    textSize = 14,
    nameColor = "#000000",
    nameSize = 14,
    verifiedIconColor = "#3A8128",
    starIconImage,
    layout = "vertical",
    imageRatio = 40,
    imageAlignment = "center",
    ...rest
  } = props as TestimonialItemV2Data & typeof props;

  const animation = useAnimation();

  // Prepare image data for Image component
  const productImageData: Partial<WeaverseImage> | undefined = productImage
    ? typeof productImage === "string"
      ? { url: productImage, altText: "Product" }
      : productImage
    : undefined;

  const starIconData: Partial<WeaverseImage> | undefined = starIconImage
    ? typeof starIconImage === "string"
      ? { url: starIconImage, altText: "Star rating" }
      : starIconImage
    : undefined;

  // Default star rating image (base64 from HTML)
  const defaultStarIcon =
    "data:image/webp;base64,UklGRqwDAABXRUJQVlA4TKADAAAvYQAEENfFoG0bQT7+aB5hddc+BzJpm8y/3t0VCCSR7G85o0iSpNTyI1CCf297wEyX2bRtyJq0ugN8TyEgBIQ0CXOpPc0SEhLSCAkJQkJASCMgIRCicQv4IEQgCh3AhYGBIdSAht1BCFEIguCvCYFoHIgJUfhQCArfZb2UhqAR/BCNQATiR0H8xV7ugCrDGfhQyl7pH1zC45RwwfUUipRknsMLCdu2HW+r/L6D7wvraP3StcFsq8Zs27Zt26ttY97f24tE9H8CIL35ESl88AYpfPYUKXx9Hyn8eBO6A5WbUjC0YsOY3uia1aN6YxtWDKVgU+WAzmmr4LHehWj+Pb1r48df07uXH72g97jAOqPRPd9MXzWi01fk8i0f0umv8Hgq+nWGlvtcRX06I6vSzXndavsjZN4VnWPjyOh5nVMWaZ3SOR8lxx3TuZpHRvbLhj9d2z/JSXqKjt6tHxMNf71xYKZBupYduV03KhqpvnVooUmaCw7dqh4RjdbdPrLURRozD9z4Oiwaq797tNhNOiftv/ZpGDix9mdBbsBNkv6gFVu88Tpwdt2vWG7AQ5LeoBX7s+EqcGH975gV8JKkN2DFfq+/AFzZ8CdmBb0k6Qnkxn6tOwtc37g4ZgX9JOnOyS34ufZEQ2EmlcOreoGm8iwqh1Z2Aq3LA1QOLG8FOleGqJxV3gz0rgpTOaOwAZ/n+1Syl3cCwLfCNJWsylYAaCjLUMkoawCA1soslbTCagDoXJ6t4pv/GcDrmR5ZRnkLhO9me2XphQ0Qfpnjl/nnfoGwoTBd5p39HsKW8gyZZ+Zr/P94kiHyFNZA+nyyKXLN/wzp25mmyJz5FtIv810ic/ILSKsLPSJj0mOISyT+zVCskng3QHGVS+RaDcUNXkkVFDf7JSUQ90+l2FyhMPLdJjJKVRY5RI4lKqWGyPZ9RGG5KeLUflF1jHQGs+20/xiTtcRJRyDbTv4dlPVMIe2BgJ2c0iMb/EvaswMOMt4iG/thpz076CRj1aJHUSMyfdeWZMARb5e9yjPCE3duSwYdsVrZh3xnaML27RNCzvwPsn8xRzC5befEsJH3UtYedwSSW3dNjxjRR6KLiYWH24FvOyZOfSO7kZi1rwWo3zVtyhPZgykzdjcCjbtnTHkgezZl2q56oGXfrMQN2ZupE3d8A9oPL0xcFJ072QNh856HsgvHuyBsO3RbdvloB4QdRy/J7hxsg7Dr+AXZw73NEPacPAsA";

  const isHorizontal = layout === "horizontal";
  const textRatio = 100 - imageRatio;
  // Use provided id or generate a fallback for CSS targeting
  const itemId = id || `testimonial-v2-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      {isHorizontal && (
        <style>
          {`
            @media (min-width: 640px) {
              #${itemId} .testimonialsII-box-top {
                width: ${imageRatio}% !important;
                min-width: 120px;
              }
              #${itemId} .testimonialsII-box-bottom {
                width: ${textRatio}% !important;
              }
            }
          `}
        </style>
      )}
      <div
        ref={ref}
        id={id || itemId}
        {...rest}
        className={clsx(
          "flex border py-2 px-4 rounded-md",
          isHorizontal
            ? [
                "flex-col sm:flex-row gap-4",
                imageAlignment === "center" && "sm:items-center",
                imageAlignment === "start" && "sm:items-start",
                imageAlignment === "end" && "sm:items-end",
              ]
            : "flex-col"
        )}
        style={{
          borderColor,
          backgroundColor: bgColor,
        }}
        data-motion="fade-up"
        {...animation}
      >
        {/* Product Image Section */}
        {productImageData && (
          <div
            className={clsx(
              "testimonialsII-box-top shrink-0",
              isHorizontal ? "w-full sm:w-auto" : "w-full"
            )}
          >
            <div
              className={clsx(
                imageAlignmentVariants({
                  alignment: imageAlignment,
                  layout: isHorizontal ? "horizontal" : "vertical",
                }),
                // For horizontal layout, apply vertical alignment to the image container
                isHorizontal && [
                  imageAlignment === "center" && "sm:items-center",
                  imageAlignment === "start" && "sm:items-start",
                  imageAlignment === "end" && "sm:items-end",
                ]
              )}
            >
              <div
                className={
                  !isHorizontal && imageAlignment === "start"
                    ? "w-fit"
                    : !isHorizontal && imageAlignment === "end"
                      ? "w-fit ml-auto"
                      : "w-full"
                }
                style={{
                  aspectRatio: "800 / 800",
                  width:
                    !isHorizontal && imageAlignment !== "center"
                      ? "auto"
                      : "100%",
                  height: "auto",
                  maxWidth: !isHorizontal ? "100%" : "none",
                }}
              >
                <Image
                  data={productImageData}
                  alt=""
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  sizes="auto"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div
          className={`testimonialsII-box-bottom ${
            isHorizontal ? "w-full sm:flex-1" : "w-full"
          }`}
        >
        {/* Author Name */}
        {authorName && (
          <h4
            className="font-bold"
            style={{
              color: nameColor,
              fontSize: `${nameSize}px`,
            }}
          >
            {authorName}
          </h4>
        )}

        {/* Rating Section */}
        <div className="flex items-center pb-2">
          <div className="tm-left">
            {showVerified && (
              <VerifiedCheckIcon color={verifiedIconColor} />
            )}
          </div>
          <div className="ml-4 tm-right">
            {starIconData ? (
              <Image
                data={starIconData}
                alt=""
                className="w-auto h-auto min-h-[20px]"
                loading="lazy"
                sizes="auto"
              />
            ) : (
              <img
                src={defaultStarIcon}
                alt=""
                className="w-auto h-auto min-h-[20px]"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Review Text */}
        {content && (
          <div
            className="space-y-6 text-base leading-5 testimonialsII-text"
            style={{
              color: textColor,
              fontSize: `${textSize}px`,
            }}
          >
            <p>{content}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
});

TestimonialItemV2.displayName = "TestimonialItemV2";

export default TestimonialItemV2;

export const schema = createSchema({
  type: "testimonial--item-v2",
  title: "Testimonial V2",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "text",
          name: "id",
          label: "Element ID",
          helpText: "Set a unique ID for anchor links (e.g., 'testimonial-1'). Leave empty to auto-generate.",
        },
      ],
    },
    {
      group: "Content",
      inputs: [
        {
          type: "textarea",
          name: "content",
          label: "Review Content",
          defaultValue:
            "I was surprised how easy this was to install—just screwed it into my ceiling light socket and done! The fan is strong, the light is bright, and I can control everything from my bed. Total game changer for my small bedroom.",
        },
        {
          type: "text",
          name: "authorName",
          label: "Author Name",
          defaultValue: "Amanda J.",
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
          label: "Show Verified Icon",
          defaultValue: true,
        },
        {
          type: "image",
          name: "starIconImage",
          label: "Star Rating Icon",
          helpText: "Optional custom star rating icon. If not provided, default icon will be used.",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "layout",
          label: "Layout Direction",
          defaultValue: "vertical",
          configs: {
            options: [
              { value: "vertical", label: "Vertical (Image Top)" },
              { value: "horizontal", label: "Horizontal (Image Left)" },
            ],
          },
        },
        {
          type: "range",
          name: "imageRatio",
          label: "Image Ratio (%)",
          defaultValue: 40,
          configs: {
            min: 20,
            max: 60,
            step: 5,
            unit: "%",
          },
          condition: (data: TestimonialItemV2Data) =>
            data.layout === "horizontal",
          helpText: "Percentage of width occupied by image (only applies to horizontal layout)",
        },
        {
          type: "select",
          name: "imageAlignment",
          label: "Image Alignment",
          defaultValue: "center",
          configs: {
            options: [
              { value: "center", label: "Center" },
              { value: "start", label: "Start (Left)" },
              { value: "end", label: "End (Right)" },
            ],
          },
          helpText: "Image alignment for both vertical and horizontal layouts",
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
          defaultValue: 14,
          configs: {
            min: 10,
            max: 20,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "nameSize",
          label: "Name Size",
          defaultValue: 14,
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
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "borderColor",
          label: "Border Color",
          defaultValue: "#e5e7eb",
        },
        {
          type: "color",
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#252a32",
        },
        {
          type: "color",
          name: "nameColor",
          label: "Name Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "verifiedIconColor",
          label: "Verified Icon Color",
          defaultValue: "#3A8128",
        },
      ],
    },
  ],
  presets: {
    content:
      "I was surprised how easy this was to install—just screwed it into my ceiling light socket and done! The fan is strong, the light is bright, and I can control everything from my bed. Total game changer for my small bedroom.",
    authorName: "Amanda J.",
    rating: 5,
    showVerified: true,
    layout: "vertical",
    imageRatio: 40,
    imageAlignment: "center",
    borderColor: "#e5e7eb",
    bgColor: "#ffffff",
    textColor: "#252a32",
    nameColor: "#000000",
    verifiedIconColor: "#3A8128",
  },
});

