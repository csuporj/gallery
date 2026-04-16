import { type ComponentPropsWithRef } from "react";

export const gridComponents = {
  List: function List({ ref, style, children, ...props }: ComponentPropsWithRef<"div">) {
    return (
      <div
        ref={ref}
        {...props}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          paddingBottom: "4px",
          ...style
        }}
      >
        {children}
      </div>
    );
  },

  Item: function Item({ ref, style, children, ...props }: ComponentPropsWithRef<"div">) {
    return (
      <div
        ref={ref}
        {...props}
        style={{ display: "flex", ...style }}>
        {children}
      </div>
    );
  },
};
