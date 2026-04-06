import { forwardRef, type CSSProperties, type ReactNode } from "react";

export const gridComponents = {
  List: forwardRef<
    HTMLDivElement,
    { style?: CSSProperties; children?: ReactNode }
  >(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingBottom: "4px",
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }: { children?: ReactNode }) => (
    <div {...props} style={{ display: "flex" }}>
      {children}
    </div>
  ),
};
