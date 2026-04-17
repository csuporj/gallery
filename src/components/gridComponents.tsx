import { type ComponentPropsWithRef } from "react";

export const gridComponents = {
  List: function List({
    ref,
    children,
    ...props
  }: ComponentPropsWithRef<"div">) {
    return (
      <div
        ref={ref}
        {...props}
        className="d-flex flex-wrap justify-content-center"
      >
        {children}
      </div>
    );
  },

  Item: function Item({
    ref,
    children,
    ...props
  }: ComponentPropsWithRef<"div">) {
    return (
      <div ref={ref} {...props} className="p-1">
        {children}
      </div>
    );
  },
};
