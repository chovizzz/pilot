import { createSchema, type HydrogenComponentProps, type WeaverseImage, useChildInstances } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";
import { Image } from "~/components/image";
import { SatisfactionGuaranteeFeature } from "./feature";
import { SatisfactionGuaranteeReview } from "./review-item";

interface SatisfactionGuaranteeData {
  badgeImage?: WeaverseImage | string;
  title?: string;
  subtitle?: string;
  productImage?: WeaverseImage | string;
  starBadgeImage?: WeaverseImage | string;
  reviewCount?: string;
  reviewCountText?: string;
  avatarImage?: WeaverseImage | string;
  maxWidth?: number;
  padding?: number;
  bgColor?: string;
  titleColor?: string;
  titleSize?: number;
  subtitleColor?: string;
  subtitleSize?: number;
  stickyTop?: number;
  pulseColor?: string;
}

type SatisfactionGuaranteeProps = HydrogenComponentProps<SatisfactionGuaranteeData>;

export const SatisfactionGuarantee = forwardRef<
  HTMLElement,
  SatisfactionGuaranteeProps
>((props, ref) => {
  const {
    badgeImage,
    title = "100% Satisfaction Guarantee",
    subtitle = "People Love It - Here's Why Everyone Is Talking About Ceiling Fan with LED Light",
    productImage,
    starBadgeImage,
    reviewCount = "101,230",
    reviewCountText = "Customers Give Positive Reviews",
    avatarImage,
    maxWidth = 480,
    padding = 20,
    bgColor = "#fcf5f0",
    titleColor = "#000000",
    titleSize = 24,
    subtitleColor = "#330f00",
    subtitleSize = 18,
    stickyTop = 90,
    pulseColor = "#ffd1b3",
    children,
    ...rest
  } = props as SatisfactionGuaranteeData & typeof props;

  const animation = useAnimation();
  const childInstances = useChildInstances();

  // Prepare image data for Image component
  const badgeImageData: Partial<WeaverseImage> | undefined = badgeImage
    ? typeof badgeImage === "string"
      ? { url: badgeImage, altText: "Badge" }
      : badgeImage
    : undefined;
  const productImageData: Partial<WeaverseImage> | undefined = productImage
    ? typeof productImage === "string"
      ? { url: productImage, altText: "Product" }
      : productImage
    : undefined;
  const starBadgeImageData: Partial<WeaverseImage> | undefined = starBadgeImage
    ? typeof starBadgeImage === "string"
      ? { url: starBadgeImage, altText: "Star badge" }
      : starBadgeImage
    : undefined;
  const avatarImageData: Partial<WeaverseImage> | undefined = avatarImage
    ? typeof avatarImage === "string"
      ? { url: avatarImage, altText: "Avatar" }
      : avatarImage
    : undefined;

  // Separate features and reviews from children
  // Weaverse child instances should have a type property, but we'll check multiple possible locations
  const features: typeof childInstances = [];
  const reviews: typeof childInstances = [];
  
  childInstances.forEach((child) => {
    // Try to get type from different possible locations
    // Check if it's a feature or review by examining the child instance
    const childAny = child as any;
    const childType = childAny.type || childAny.schema?.type || childAny.data?.type || "";
    
    if (childType.includes("feature")) {
      features.push(child);
    } else if (childType.includes("review")) {
      reviews.push(child);
    } else {
      // Fallback: if type is not found, check if it has review-specific data
      const data = child.data as any;
      if (data?.rating !== undefined || data?.content || data?.authorName) {
        reviews.push(child);
      } else if (data?.text) {
        features.push(child);
      }
    }
  });

  // Create pulsate animation keyframes
  const pulsateKeyframes = `
    @keyframes pulsate1 {
      0% {
        transform: scale(0.6);
        opacity: 1;
        box-shadow: inset 0 0 25px 3px hsla(0, 0%, 100%, 0.75), 0 0 25px 10px hsla(0, 0%, 100%, 0.75);
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
        box-shadow: none;
      }
    }
    .comment16-image::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      animation: pulsate1 2s;
      animation-direction: forwards;
    animation-iteration-count: infinite;
    animation-timing-function: steps;
      opacity: 1;
      border-radius: 50%;
      background-color: ${pulseColor};
      left: 0;
      top: 0;
      z-index: -1;
    }
  `;

  // Create responsive maxWidth style that only applies on lg (1024px) and above
  // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
  const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
    .comment16-container-responsive {
      width: 100%;
    }
    @media (min-width: 1024px) {
      .comment16-container-responsive {
        max-width: ${maxWidth}px;
      }
    }
  ` : `
    .comment16-container-responsive {
      width: 100%;
    }
  `;

  return (
    <Section
      ref={ref}
      {...rest}
      className="w-full mx-auto leading-tight comment16-container comment16-container-responsive"
      style={{
        backgroundColor: bgColor,
      }}
      data-motion="fade-up"
      {...animation}
    >
      <style>{pulsateKeyframes}</style>
      <style>{responsiveMaxWidthStyle}</style>
      <div
        className="main-content max-w-7xl mx-auto comment16-content"
        style={{
          paddingTop: `${padding}px`,
          paddingBottom: `${padding}px`,
          paddingLeft: `${padding}px`,
          paddingRight: `${padding}px`,
        }}
      >
        {/* Badge Image */}
        {badgeImageData && (
          <div className="imgage-section-container w-[140px] mb-2 mx-auto">
            <Image
              data={badgeImageData}
              alt="Badge"
              width={232}
              height={230}
              className="w-full h-auto"
              loading="lazy"
              sizes="auto"
            />
          </div>
        )}

        {/* Title */}
        {title && (
          <div
            className="money-back-2-title font-bold mb-3 text-center"
            style={{
              color: titleColor,
              fontSize: `${titleSize}px`,
            }}
          >
            {title}
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <div
            className="money-back-2-desc leading-normal text-center"
            style={{
              color: subtitleColor,
              fontSize: `${subtitleSize}px`,
            }}
          >
            <p style={{ textAlign: "center" }}>
              {subtitle.includes(" - ") ? (
                <>
                  <strong>{subtitle.split(" - ")[0]}</strong>
                  {` - ${subtitle.split(" - ")[1]}`}
                </>
              ) : (
                subtitle
              )}
            </p>
          </div>
        )}

        {/* Sticky Product Section */}
        <div
          className="sticky comment16-sticky mt-[90px]"
          style={{ top: `${stickyTop}px` }}
        >
          <div className="comment16-sticky-container relative w-[65%] max-w-[250px] z-1 mx-auto my-[70px] transition-all duration-500">
            {/* Product Image */}
            {productImageData && (
              <div className="comment16-image relative aspect-square">
                <div className="imgage-section-container rounded-full overflow-hidden h-full">
                  <Image
                    data={productImageData}
                    alt="Product"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    sizes="auto"
                  />
                </div>

                {/* Star Badge */}
                {starBadgeImageData && (
                  <div
                    className="comment-13-image-star p-3 absolute top-0 right-0 rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgb(252, 181, 135)" }}
                  >
                    <div className="imgage-section-container w-20">
                      <Image
                        data={starBadgeImageData}
                        alt="Star badge"
                        width={224}
                        height={67}
                        className="w-full h-auto object-contain"
                        loading="lazy"
                        sizes="auto"
                      />
                    </div>
                  </div>
                )}

                {/* Review Count Badge */}
                <div
                  className="comment-13-image-count py-2 px-3 absolute right-0 rounded-full font-bold leading-none flex"
                  style={{
                    color: "rgb(255, 255, 255)",
                    fontSize: "16px",
                    backgroundColor: "rgb(0, 0, 0)",
                    top: "36px", // Almost touching star badge (star badge bottom + minimal gap)
                  }}
                >
                  <span>{reviewCount}</span>
                  <span>+</span>
                </div>

                {/* Avatar Badge */}
                {avatarImageData && (
                  <div
                    className="comment-13-image-avatar py-1 px-3 absolute bottom-0 left-0 rounded-full"
                    style={{
                      backgroundColor: "rgb(239, 123, 47)",
                      transform: "translateY(10%) translateX(-30%)",
                    }}
                  >
                    <div className="imgage-section-container w-24">
                      <Image
                        data={avatarImageData}
                        alt="Avatar"
                        width={251}
                        height={91}
                        className="w-full h-auto object-contain"
                        loading="lazy"
                        sizes="auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Review Count Text */}
            <div className="comment16-text">
              <div
                className="comment16-title font-bold text-center pt-4 mb-2 flex justify-center"
                style={{
                  color: "#330f00",
                  fontSize: "28px",
                }}
              >
                <span>{reviewCount}</span>
                <span>+</span>
              </div>
              {reviewCountText && (
                <div
                  className="comment16-desc text-center mb-4"
                  style={{
                    color: "#000000",
                    fontSize: "14px",
                  }}
                >
                  <p style={{ textAlign: "center" }}>
                    <strong>{reviewCountText}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features List */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-4 comment16-features mb-6">
            {features.map((feature, index) => (
              <SatisfactionGuaranteeFeature
                key={(feature as any).id || `feature-${index}`}
                {...(feature.data as any)}
              />
            ))}
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="comment16-reviews">
            {reviews.map((review, index) => {
              const isLast = index === reviews.length - 1;
              const reviewData = review.data as any;
              return (
                <div key={(review as any).id || `review-${index}`}>
                  <SatisfactionGuaranteeReview
                    {...reviewData}
                  />
                  {isLast && reviewData.bgColor && (
                    <div
                      className="w-5 h-5 mx-auto"
                      style={{
                        backgroundColor: reviewData.bgColor,
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
});

SatisfactionGuarantee.displayName = "SatisfactionGuarantee";

export default SatisfactionGuarantee;

export const schema = createSchema({
  type: "satisfaction-guarantee",
  title: "Satisfaction Guarantee",
  childTypes: ["satisfaction-guarantee--feature", "satisfaction-guarantee--review"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "image",
          name: "badgeImage",
          label: "Badge Image",
        },
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "100% Satisfaction Guarantee",
        },
        {
          type: "textarea",
          name: "subtitle",
          label: "Subtitle",
          defaultValue: "People Love It - Here's Why Everyone Is Talking About Ceiling Fan with LED Light",
        },
        {
          type: "image",
          name: "productImage",
          label: "Product Image",
        },
        {
          type: "image",
          name: "starBadgeImage",
          label: "Star Badge Image",
        },
        {
          type: "text",
          name: "reviewCount",
          label: "Review Count",
          defaultValue: "101,230",
        },
        {
          type: "text",
          name: "reviewCountText",
          label: "Review Count Text",
          defaultValue: "Customers Give Positive Reviews",
        },
        {
          type: "image",
          name: "avatarImage",
          label: "Avatar Image",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "text",
          name: "nodeId",
          label: "Section ID",
          helpText: "Set a unique ID for anchor links (e.g., 'satisfaction-guarantee'). Leave empty to auto-generate.",
        },
        {
          type: "range",
          name: "maxWidth",
          label: "Max Width",
                defaultValue: 480,
                configs: {
                  min: 0,
                  max: 1200,
                  step: 20,
                  unit: "px",
                },
                helpText: "Maximum width on large screens (1024px and above). Set to 0 for unlimited width.",
              },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 20,
          configs: {
            min: 0,
            max: 80,
            step: 4,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "stickyTop",
          label: "Sticky Top Position",
          defaultValue: 90,
          configs: {
            min: 0,
            max: 200,
            step: 10,
            unit: "px",
          },
          helpText: "Distance from top when sticky",
        },
        {
          type: "color",
          name: "pulseColor",
          label: "Pulse Animation Color",
          defaultValue: "#ffd1b3",
          helpText: "Color of the ripple animation behind the product image",
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
          defaultValue: "#fcf5f0",
        },
        {
          type: "color",
          name: "titleColor",
          label: "Title Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "subtitleColor",
          label: "Subtitle Color",
          defaultValue: "#330f00",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "titleSize",
          label: "Title Size",
          defaultValue: 24,
          configs: {
            min: 16,
            max: 48,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "subtitleSize",
          label: "Subtitle Size",
          defaultValue: 18,
          configs: {
            min: 12,
            max: 32,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    title: "100% Satisfaction Guarantee",
    subtitle: "People Love It - Here's Why Everyone Is Talking About Ceiling Fan with LED Light",
    reviewCount: "101,230",
    reviewCountText: "Customers Give Positive Reviews",
    maxWidth: 480,
    padding: 20,
    bgColor: "#fcf5f0",
    titleColor: "#000000",
    titleSize: 24,
    subtitleColor: "#330f00",
    subtitleSize: 18,
    stickyTop: 90,
    pulseColor: "#ffd1b3",
    children: [
      {
        type: "satisfaction-guarantee--feature",
        text: "Ease of Installation",
      },
      {
        type: "satisfaction-guarantee--review",
      },
    ],
  },
});

