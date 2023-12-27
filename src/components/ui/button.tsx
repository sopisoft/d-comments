import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "tailwind.config.jsinline-flex tailwind.config.jsitems-center tailwind.config.jsjustify-center tailwind.config.jswhitespace-nowrap tailwind.config.jsrounded-md tailwind.config.jstext-sm tailwind.config.jsfont-medium tailwind.config.jsring-offset-background tailwind.config.jstransition-colors focus-visible:tailwind.config.jsoutline-none focus-visible:tailwind.config.jsring-2 focus-visible:tailwind.config.jsring-ring focus-visible:tailwind.config.jsring-offset-2 disabled:tailwind.config.jspointer-events-none disabled:tailwind.config.jsopacity-50",
  {
    variants: {
      variant: {
        default:
          "tailwind.config.jsbg-primary tailwind.config.jstext-primary-foreground hover:tailwind.config.jsbg-primary/90",
        destructive:
          "tailwind.config.jsbg-destructive tailwind.config.jstext-destructive-foreground hover:tailwind.config.jsbg-destructive/90",
        outline:
          "tailwind.config.jsborder tailwind.config.jsborder-input tailwind.config.jsbg-background hover:tailwind.config.jsbg-accent hover:tailwind.config.jstext-accent-foreground",
        secondary:
          "tailwind.config.jsbg-secondary tailwind.config.jstext-secondary-foreground hover:tailwind.config.jsbg-secondary/80",
        ghost:
          "hover:tailwind.config.jsbg-accent hover:tailwind.config.jstext-accent-foreground",
        link: "tailwind.config.jstext-primary tailwind.config.jsunderline-offset-4 hover:tailwind.config.jsunderline",
      },
      size: {
        default:
          "tailwind.config.jsh-10 tailwind.config.jspx-4 tailwind.config.jspy-2",
        sm: "tailwind.config.jsh-9 tailwind.config.jsrounded-md tailwind.config.jspx-3",
        lg: "tailwind.config.jsh-11 tailwind.config.jsrounded-md tailwind.config.jspx-8",
        icon: "tailwind.config.jsh-10 tailwind.config.jsw-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
