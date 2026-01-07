import { createSchema, type HydrogenComponentProps, type WeaverseImage, useChildInstances } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";
import { Product360ViewItem } from "./item";

interface Product360ViewData {
  title?: string;
  buttonText?: string;
  overlayImage?: WeaverseImage | string;
  maxWidth?: number;
  padding?: number;
  titleColor?: string;
  titleSize?: number;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonSize?: number;
  bgColor?: string;
  autoRotate?: boolean;
  changeSlidesEvery?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
}

type Product360ViewProps = HydrogenComponentProps<Product360ViewData>;

export const Product360View = forwardRef<
  HTMLDivElement,
  Product360ViewProps
>((props, ref) => {
  const {
    title = "360°SWIPE TO VIEW PRODUCT",
    buttonText = "<< Swipe left or right >>",
    overlayImage,
    maxWidth = 480,
    padding = 20,
    titleColor = "#000000",
    titleSize = 26,
    buttonBgColor = "#ef7b2e",
    buttonTextColor = "#ffffff",
    buttonSize = 16,
    bgColor = "#ffffff",
    autoRotate = true,
    changeSlidesEvery = 3,
    showPagination = false,
    showNavigation = false,
    ...rest
  } = props as Product360ViewData & typeof props;

  const animation = useAnimation();
  const childInstances = useChildInstances();

  // Prepare image data for Image component
  const overlayImageData: Partial<WeaverseImage> | undefined = overlayImage
    ? typeof overlayImage === "string"
      ? { url: overlayImage, altText: "Overlay image" }
      : overlayImage
    : undefined;

  // Create responsive maxWidth style that only applies on lg (1024px) and above
  // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
  const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
    .gallery4-container-responsive {
      width: 100%;
    }
    @media (min-width: 1024px) {
      .gallery4-container-responsive {
        max-width: ${maxWidth}px;
      }
    }
  ` : `
    .gallery4-container-responsive {
      width: 100%;
    }
  `;

  return (
    <div
      ref={ref}
      {...rest}
      className="w-full mx-auto leading-tight gallery4-container gallery4-container-responsive"
      style={{
        backgroundColor: bgColor,
      }}
      data-motion="fade-up"
      {...animation}
    >
      <style>{responsiveMaxWidthStyle}</style>
      <div
        className="main-content max-w-7xl mx-auto"
        style={{ padding: `${padding}px` }}
      >
        {title && (
          <div
            className="gallery4-title font-bold mb-4 text-center"
            style={{
              fontSize: `${titleSize}px`,
              color: titleColor,
            }}
          >
            {title}
          </div>
        )}
        {buttonText && (
          <div
            className="gallery4-button font-bold mb-8 px-6 py-2 rounded-full max-w-max mx-auto"
            style={{
              fontSize: `${buttonSize}px`,
              color: buttonTextColor,
              backgroundColor: buttonBgColor,
            }}
          >
            {buttonText}
          </div>
        )}
        <div className="relative">
          <style>
            {`
              ${!showNavigation ? `
                .gallery4-carousel .swiper-button-prev,
                .gallery4-carousel .swiper-button-next {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  pointer-events: none !important;
                }
              ` : ''}
              ${!showPagination ? `
                .gallery4-carousel .swiper-pagination,
                .gallery4-carousel .swiper-pagination-bullets,
                .gallery4-carousel .swiper-pagination-bullet {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  pointer-events: none !important;
                }
              ` : ''}
            `}
          </style>
          <Swiper
            modules={[
              EffectFade,
              showNavigation ? Navigation : null,
              autoRotate ? Autoplay : null,
              showPagination ? Pagination : null,
            ].filter(Boolean)}
            effect="fade"
            slidesPerView={1}
            navigation={showNavigation ? true : false}
            pagination={
              showPagination
                ? {
                    clickable: true,
                    dynamicBullets: true,
                  }
                : { el: null }
            }
            loop={childInstances.length > 1}
            speed={500}
            autoplay={
              autoRotate && childInstances.length > 1
                ? {
                    delay: changeSlidesEvery * 1000,
                    disableOnInteraction: false,
                  }
                : false
            }
            fadeEffect={{
              crossFade: true,
            }}
            onTransitionStart={(swiper) => {
              // Determine slide direction based on previous and current index
              // Use realIndex for accurate direction detection in loop mode
              const previousRealIndex = swiper.previousRealIndex ?? swiper.previousIndex;
              const currentRealIndex = swiper.realIndex ?? swiper.activeIndex;
              const totalSlides = swiper.slides.length;
              
              // Calculate direction: true for forward (next), false for backward (prev)
              let isForward = true;
              
              if (swiper.params.loop && totalSlides > 1) {
                // In loop mode, handle wrap-around cases
                const diff = currentRealIndex - previousRealIndex;
                // If difference is positive and not a wrap-around, it's forward
                // If difference is negative and not a wrap-around, it's backward
                // Handle wrap-around: if we go from last to first, it's backward
                // If we go from first to last, it's forward
                if (Math.abs(diff) <= totalSlides / 2) {
                  // Normal case: no wrap-around
                  isForward = diff > 0;
                } else {
                  // Wrap-around case
                  isForward = diff < 0;
                }
              } else {
                // Non-loop mode: simple comparison
                isForward = currentRealIndex > previousRealIndex;
              }
              
              // Trigger rotation animation with fade on slide change
              const activeSlide = swiper.slides[swiper.activeIndex];
              if (activeSlide) {
                const img = activeSlide.querySelector(".product-360-image") as HTMLElement;
                if (img) {
                  const duration = img.getAttribute("data-rotation-duration") || "0.5";
                  img.style.setProperty("--rotation-duration", `${duration}s`);
                  // Remove both animation classes
                  img.classList.remove("product-360-rotating-forward", "product-360-rotating-backward");
                  // Force reflow to restart animation
                  void img.offsetWidth;
                  // Add the appropriate animation class based on direction
                  // Reverse the direction: forward (next) = backward rotation, backward (prev) = forward rotation
                  if (isForward) {
                    img.classList.add("product-360-rotating-backward");
                  } else {
                    img.classList.add("product-360-rotating-forward");
                  }
                }
              }
            }}
            onSlideChangeTransitionEnd={(swiper) => {
              // Remove animation classes after transition completes
              swiper.slides.forEach((slide) => {
                const img = slide.querySelector(".product-360-image") as HTMLElement;
                if (img) {
                  img.classList.remove("product-360-rotating-forward", "product-360-rotating-backward");
                }
              });
            }}
            className="gallery4-carousel"
            style={{ height: "255px" }}
          >
            {childInstances.map((child, index) => (
              <SwiperSlide key={`product-360-${index}`}>
                <Product360ViewItem {...(child.data as any)} />
              </SwiperSlide>
            ))}
          </Swiper>
          {overlayImageData && (
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-10 pointer-events-none">
              <div
                className="imgage-section-container mx-auto"
                style={{
                  aspectRatio: "651 / 155",
                }}
              >
                <Image
                  data={overlayImageData}
                  alt=""
                  className="w-full h-full object-contain"
                  loading="lazy"
                  sizes="auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Product360View.displayName = "Product360View";

export default Product360View;

export const schema = createSchema({
  type: "product-360-view",
  title: "360° Product View",
  childTypes: ["product-360-view--item"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "360°SWIPE TO VIEW PRODUCT",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button Text",
          defaultValue: "<< Swipe left or right >>",
        },
        {
          type: "image",
          name: "overlayImage",
          label: "Overlay Image",
          helpText: "Image displayed on top of the carousel",
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
          type: "switch",
          name: "autoRotate",
          label: "Auto Rotate",
          defaultValue: true,
          helpText: "Automatically rotate through product images",
        },
        {
          type: "range",
          name: "changeSlidesEvery",
          label: "Change Slides Every",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 10,
            step: 0.5,
            unit: "s",
          },
          condition: (data: Product360ViewData) => data.autoRotate === true,
          helpText: "Time between each slide change",
        },
        {
          type: "switch",
          name: "showNavigation",
          label: "Show Navigation Arrows",
          defaultValue: false,
          helpText: "Display previous/next navigation arrows",
        },
        {
          type: "switch",
          name: "showPagination",
          label: "Show Pagination",
          defaultValue: false,
          helpText: "Display pagination dots below the carousel",
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
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "titleColor",
          label: "Title Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "buttonBgColor",
          label: "Button Background Color",
          defaultValue: "#ef7b2e",
        },
        {
          type: "color",
          name: "buttonTextColor",
          label: "Button Text Color",
          defaultValue: "#ffffff",
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
          defaultValue: 26,
          configs: {
            min: 16,
            max: 48,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "buttonSize",
          label: "Button Size",
          defaultValue: 16,
          configs: {
            min: 12,
            max: 24,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    title: "360°SWIPE TO VIEW PRODUCT",
    buttonText: "<< Swipe left or right >>",
    maxWidth: 480,
    padding: 20,
    titleColor: "#000000",
    titleSize: 26,
    buttonBgColor: "#ef7b2e",
    buttonTextColor: "#ffffff",
    buttonSize: 16,
    bgColor: "#ffffff",
    autoRotate: true,
    changeSlidesEvery: 3,
    showNavigation: false,
    showPagination: false,
    children: [
      {
        type: "product-360-view--item",
      },
    ],
  },
});

