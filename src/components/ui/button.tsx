import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/merge-classnames";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:grayscale disabled:cursor-not-allowed disabled:shadow-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-slate-800 text-white hover:enabled:bg-slate-700 shadow-md hover:enabled:shadow-lg active:enabled:scale-[0.98]",
        destructive:
          "bg-destructive text-white hover:enabled:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-md active:enabled:scale-[0.98]",
        outline:
          "border-2 border-slate-800 bg-transparent text-slate-800 hover:enabled:bg-slate-50 hover:enabled:border-slate-700 shadow-sm hover:enabled:shadow-md active:enabled:scale-[0.98]",
        secondary:
          "bg-slate-100 text-slate-900 hover:enabled:bg-slate-200 shadow-sm active:enabled:scale-[0.98]",
        ghost: "hover:enabled:bg-accent hover:enabled:text-accent-foreground",
        link: "text-slate-800 underline-offset-4 hover:enabled:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
