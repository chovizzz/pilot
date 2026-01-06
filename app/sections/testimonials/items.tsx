import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

const variants = cva("grid gap-[30px] comment13-grid", {
  variants: {
    gap: {
      16: "gap-4",
      24: "gap-6",
      30: "gap-[30px]",
      32: "gap-8",
      40: "gap-10",
    },
  },
  defaultVariants: {
    gap: 30,
  },
});

interface TestimonialsItemsProps
  extends VariantProps<typeof variants>,
    HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
}

function TestimonialsItems(props: TestimonialsItemsProps) {
  const { gap = 30, children, ref, ...rest } = props;

  return (
    <div
      ref={ref}
      {...rest}
      className={clsx(variants({ gap }))}
      style={{
        gridTemplateColumns: "repeat(1, minmax(0px, 1fr))",
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
  childTypes: ["testimonial--item"],
  settings: [
    {
      group: "Items",
      inputs: [
        {
          type: "range",
          name: "gap",
          label: "Items gap",
          configs: {
            min: 16,
            max: 40,
            step: 2,
            unit: "px",
          },
          defaultValue: 30,
        },
      ],
    },
  ],
});
