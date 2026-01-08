import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

const variants = cva("grid comment13-grid", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-3",
    },
  },
  defaultVariants: {
    columns: 1,
  },
});

interface TestimonialsItemsProps
  extends VariantProps<typeof variants>,
    HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  gap?: number;
}

function TestimonialsItems(props: TestimonialsItemsProps) {
  const { gap = 30, columns = 1, children, ref, ...rest } = props;

  return (
    <div
      ref={ref}
      {...rest}
      className={clsx(variants({ columns }))}
      style={{
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

export default TestimonialsItems;

export const schema = createSchema({
  type: "testimonials-items",
  title: "Items",
  childTypes: ["testimonial--item", "testimonial--item-v2"],
  settings: [
    {
      group: "Items",
      inputs: [
        {
          type: "range",
          name: "gap",
          label: "Items gap",
          configs: {
            min: 10,
            max: 40,
            step: 2,
            unit: "px",
          },
          defaultValue: 30,
        },
        {
          type: "select",
          name: "columns",
          label: "Columns",
          defaultValue: 1,
          configs: {
            options: [
              { value: 1, label: "1 Column" },
              { value: 2, label: "2 Columns (Responsive)" },
              { value: 3, label: "3 Columns (Responsive)" },
            ],
          },
          helpText: "Number of columns on larger screens. Mobile will always show 1 column.",
        },
      ],
    },
  ],
});
