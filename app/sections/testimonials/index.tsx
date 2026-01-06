import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface TestimonialsData {
  heading?: string;
  description?: string;
  maxWidth?: number;
  padding?: number;
  bgColor?: string;
  headingColor?: string;
  descriptionColor?: string;
}

type TestimonialsProps = HydrogenComponentProps<TestimonialsData>;

export const Testimonials = forwardRef<HTMLElement, TestimonialsProps>(
  (props, ref) => {
    const {
      heading = "Here's Why People Trust the Ceiling Fan with LED Light",
      description = "It's become a must-have for people, with thousands of 5 Star Reviews!",
      maxWidth = 500,
      padding = 36,
      bgColor = "#ffffff",
      headingColor = "#000000",
      descriptionColor = "#421700",
      children,
      ...rest
    } = props as TestimonialsData & typeof props;

    const animation = useAnimation();

    return (
      <Section
        ref={ref}
        {...rest}
        style={{ backgroundColor: bgColor }}
        data-motion="fade-up"
        {...animation}
      >
        <div className="w-full mx-auto leading-tight comment13-container" style={{ backgroundColor: bgColor }}>
          <div
            className="main-content mx-auto"
            style={{
              padding: `${padding}px`,
              maxWidth: `${maxWidth}px`,
            }}
          >
            {heading && (
              <div
                className="comment13-title mb-4 text-center font-bold"
                style={{
                  color: headingColor,
                  fontSize: "24px",
                }}
              >
                <p>{heading}</p>
              </div>
            )}
            {description && (
              <div
                className="comment13-desc mb-8 text-center"
                style={{
                  color: descriptionColor,
                  fontSize: "14px",
                }}
              >
                <p>{description}</p>
              </div>
            )}
            {children}
          </div>
        </div>
      </Section>
    );
  }
);

Testimonials.displayName = "Testimonials";

export default Testimonials;

export const schema = createSchema({
  type: "testimonials",
  title: "Testimonials",
  childTypes: ["testimonials-items"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Here's Why People Trust the Ceiling Fan with LED Light",
        },
        {
          type: "text",
          name: "description",
          label: "Description",
          defaultValue: "It's become a must-have for people, with thousands of 5 Star Reviews!",
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
          defaultValue: 500,
          configs: {
            min: 300,
            max: 800,
            step: 10,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 36,
          configs: {
            min: 0,
            max: 80,
            step: 4,
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
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "headingColor",
          label: "Heading Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "descriptionColor",
          label: "Description Color",
          defaultValue: "#421700",
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    heading: "Here's Why People Trust the Ceiling Fan with LED Light",
    description: "It's become a must-have for people, with thousands of 5 Star Reviews!",
    maxWidth: 500,
    padding: 36,
    bgColor: "#ffffff",
    headingColor: "#000000",
    descriptionColor: "#421700",
    children: [
      {
        type: "testimonials-items",
        children: [
          {
            type: "testimonial--item",
            authorName: "Glen P.",
            authorTitle: "Founder, eCom Graduates",
            authorImage:
              "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/glen_p.webp?v=1711343796",
            heading: "Shopify Headless Game Changer",
            content:
              "I run a Shopify development agency and this is the kind of tool I've been looking for. Clients do not understand why headless is rather expensive to build but having a tool/option like this is a game changer. ",
          },
          {
            type: "testimonial--item",
            authorName: "Tom H.",
            authorTitle: "Owner, On The Road UK",
            authorImage:
              "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/tom_h.webp?v=1711343959",
            heading: "Intuitive Tool with Big Plus",
            content:
              "I love how intuitive the tool is. It looks very promising for my potential clients, and being able to easily use meta objects with this is a big plus.",
          },
          {
            type: "testimonial--item",
            authorName: "Kenneth G.",
            authorTitle: "Frontend Developer, DevInside Agency",
            authorImage:
              "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Kenneth_g.webp?v=1711359007",
            heading: "Hydrogen Editor Mirrors Shopify",
            content:
              "We already love the Shopify theme editor, so having something similar for Hydrogen is so cool because now we can get hydrogen storefront setup similar to a liquid store.",
            hideOnMobile: true,
          },
          {
            type: "testimonial--item",
            authorName: "Leonardo G.",
            authorTitle: "Solo developer",
            authorImage:
              "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/leo_1.webp?v=1711359106",
            heading: "Hydrogen Shift Eases for Solo Dev",
            content:
              "As a solo dev with a small Shopify shop, this is something interesting to hear about. I'm migrating from a GatsbyJS headless to Hydrogen solution, and Weaverse makes it a lot easier because I want to avoid hydrogen-react with NextJS!",
            hideOnMobile: true,
          },
          {
            type: "testimonial--item",
            authorName: "Micky M.",
            authorTitle: "Owner, Joylery Silver",
            authorImage:
              "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/micky_m.webp?v=1711359054",
            heading: "Weaverse Makes Headless Accessible",
            content:
              "We struggled with site speed and as an ex-developer, I wanted to go headless but with only one in-house developer, it seemed impossible. Weaverse really made going headless a lot more accessible.",
            hideOnMobile: true,
          },
          {
            type: "testimonial--item",
            authorName: "John D.",
            authorTitle: "CEO, Tech Solutions",
            authorImage:
              "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/glen_p.webp?v=1711343796",
            heading: "Incredible Tool for Development",
            content:
              "As a tech company CEO, this tool has revolutionized how we approach development. It's intuitive, efficient, and has made our processes significantly more streamlined.",
            hideOnMobile: true,
          },
        ],
      },
    ],
  },
});
