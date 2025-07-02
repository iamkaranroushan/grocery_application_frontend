import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow active:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground ",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        logout: "bg-red-500 text-primary-foreground shadow active:bg-red-800",
        cancel: "border border-stone-400 bg-background",
        increase: "text-white active:bg-white active:text-black bg-stone-900 text-white border border-stone-700",
        order: "text-white lg:text-lg active:bg-white active:text-black bg-stone-900 text-white border border-stone-700",
        addToCart: "text-white active:bg-white active:text-black bg-stone-900 text-white border border-stone-700",
        decrease: " text-stone-700 rounded-md border border-stone-700 active:bg-red-800 active:text-white active:border-red-800",
        delete: "text-stone-700 rounded-md border border-stone-700 active:bg-red-800 active:text-white active:border-red-800",
        address: "text-white active:bg-white active:text-black bg-stone-900 text-white border border-stone-700",
        checkout: "active:bg-yellow-800 active:text-white text-white text-md bg-yellow-600 shadow-lg",
        custom: "bg-stone-200 text-black shadow hover:bg-white/70",
        deleteProduct: "bg-red-600 text-white text-sm font-bold px-3 py-1 rounded active:bg-red-700",
        custom_2: "bg-stone-700 text-white shadow hover:bg-stone-700/70",
        subscribe: "bg-stone-500 active:text-black active:bg-white font-bold",
        hero_button: "bg-black border text-white  active:bg-white active:text-black active:font-bold font-bold",
        login2: "bg-black text-white  font-medium tracking-wide hover:bg-stone-800 transition rounded-full",
      },
      size: {
        default: "h-9 px-4 py-2",
        quantity: " h-8 rounded-md px-3 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        addOptions: "h-10 rounded-lg  px-6 text-sm",
        lg: "h-10 rounded-md  ",
        icon: "h-9 w-9 lg:h-12 lg:w-12",
        subscribe: "h-12 px-4 py-6 rounded-lg lg:py-12 text-lg lg:text-3xl",
        address: "rounded-lg h-10 p-6 w-full",
        order: "rounded-lg h-10 p-6 lg:py-8 w-full",
        login: "rounded-lg h-10 p-6 lg:py-8 w-full mt-4",
        checkout: "rounded-3xl h-10 w-full p-6",
        login2: "px-6 py-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
