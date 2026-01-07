import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { Image } from "~/components/image";

interface SatisfactionGuaranteeReviewData {
  productImage?: WeaverseImage | string;
  rating?: number;
  content?: string;
  authorName?: string;
  showVerified?: boolean;
  bgColor?: string;
  textColor?: string;
  textSize?: number;
  nameColor?: string;
  nameSize?: number;
  starColor?: string;
  verifiedColor?: string;
}

type SatisfactionGuaranteeReviewProps = HydrogenComponentProps<SatisfactionGuaranteeReviewData>;

// Star SVG component
const StarIcon = ({ color = "#ffc12a" }: { color?: string }) => (
  <svg
    t="1745203117466"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="8913"
    width="14"
    height="14"
    fill={color}
  >
    <path
      d="M781.186088 616.031873q17.338645 80.573705 30.59761 145.848606 6.119522 27.537849 11.219124 55.075697t9.689243 49.976096 7.649402 38.247012 4.079681 19.888446q3.059761 20.398406-9.179283 27.027888t-27.537849 6.629482q-5.099602 0-14.788845-3.569721t-14.788845-5.609562l-266.199203-155.027888q-72.414343 42.836653-131.569721 76.494024-25.498008 14.278884-50.486056 28.557769t-45.386454 26.517928-35.187251 20.398406-19.888446 10.199203q-10.199203 5.099602-20.908367 3.569721t-19.378486-7.649402-12.749004-14.788845-2.039841-17.848606q1.01992-4.079681 5.099602-19.888446t9.179283-37.737052 11.729084-48.446215 13.768924-54.055777q15.298805-63.23506 34.677291-142.788845-60.175299-52.015936-108.111554-92.812749-20.398406-17.338645-40.286853-34.167331t-35.697211-30.59761-26.007968-22.438247-11.219124-9.689243q-12.239044-11.219124-20.908367-24.988048t-6.629482-28.047809 11.219124-22.438247 20.398406-10.199203l315.155378-28.557769 117.290837-273.338645q6.119522-16.318725 17.338645-28.047809t30.59761-11.729084q10.199203 0 17.848606 4.589641t12.749004 10.709163 8.669323 12.239044 5.609562 10.199203l114.231076 273.338645 315.155378 29.577689q20.398406 5.099602 28.557769 12.239044t8.159363 22.438247q0 14.278884-8.669323 24.988048t-21.928287 26.007968z"
      p-id="8914"
    />
  </svg>
);

// Verified checkmark SVG component
const VerifiedIcon = ({ color = "#5bae35" }: { color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </svg>
);

export const SatisfactionGuaranteeReview = forwardRef<
  HTMLDivElement,
  SatisfactionGuaranteeReviewProps
>((props, ref) => {
  const {
    productImage,
    rating = 5,
    content,
    authorName,
    showVerified = true,
    bgColor = "#ffd1b3",
    textColor = "#0a2f00",
    textSize = 14,
    nameColor = "#000000",
    nameSize = 14,
    starColor = "#ffc12a",
    verifiedColor = "#5bae35",
    ...rest
  } = props as SatisfactionGuaranteeReviewData & typeof props;

  const animation = useAnimation();

  const productImageData: Partial<WeaverseImage> | undefined = productImage
    ? typeof productImage === "string"
      ? { url: productImage, altText: "Product" }
      : productImage
    : undefined;

  return (
    <div
      ref={ref}
      {...rest}
      className="comment16-item mb-3 relative"
      data-motion="fade-up"
      {...animation}
    >
      <div
        className="flex gap-3 items-center rounded-2xl p-3"
        style={{ backgroundColor: bgColor }}
      >
        {/* Product Image */}
        {productImageData && (
          <div
            className="imgage-section-container w-1/3"
            style={{ maxWidth: "105px" }}
          >
            <Image
              data={productImageData}
              alt="Product"
              width={600}
              height={768}
              className="w-full h-auto object-contain"
              loading="lazy"
              sizes="auto"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Rating Stars */}
          <div className="mb-2 flex gap-0.5" style={{ color: starColor }}>
            {Array.from({ length: rating }).map((_, index) => (
              <StarIcon key={index} color={starColor} />
            ))}
          </div>

          {/* Review Content */}
          {content && (
            <div
              className="mb-1 comment16-item-content leading-snug"
              style={{
                color: textColor,
                fontSize: `${textSize}px`,
              }}
            >
              <p>{content}</p>
            </div>
          )}

          {/* Author Info */}
          <div className="flex items-center gap-2">
            {authorName && (
              <div
                className="font-bold comment16-item-name"
                style={{
                  color: nameColor,
                  fontSize: `${nameSize}px`,
                }}
              >
                {authorName}
              </div>
            )}
            {showVerified && (
              <div
                className="flex items-center gap-1"
                style={{
                  color: verifiedColor,
                  fontSize: "12px",
                }}
              >
                <VerifiedIcon color={verifiedColor} />
                <div>Verified purchase</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SatisfactionGuaranteeReview.displayName = "SatisfactionGuaranteeReview";

export default SatisfactionGuaranteeReview;

export const schema = createSchema({
  type: "satisfaction-guarantee--review",
  title: "Review",
  settings: [
    {
      group: "Content",
      inputs: [
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
          type: "textarea",
          name: "content",
          label: "Review Content",
          defaultValue: "Game changer - Replaced my bedside lamp and fan with this one device. So quiet and bright!",
        },
        {
          type: "text",
          name: "authorName",
          label: "Author Name",
          defaultValue: "Ashley M.",
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
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#ffd1b3",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#0a2f00",
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
          defaultValue: "#ffc12a",
        },
        {
          type: "color",
          name: "verifiedColor",
          label: "Verified Color",
          defaultValue: "#5bae35",
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
            max: 24,
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
  ],
  presets: {
    rating: 5,
    content: "Game changer - Replaced my bedside lamp and fan with this one device. So quiet and bright!",
    authorName: "Ashley M.",
    showVerified: true,
    bgColor: "#ffd1b3",
    textColor: "#0a2f00",
    nameColor: "#000000",
    starColor: "#ffc12a",
    verifiedColor: "#5bae35",
    textSize: 14,
    nameSize: 14,
  },
});

