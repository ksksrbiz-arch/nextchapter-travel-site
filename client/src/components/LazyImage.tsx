import { ImgHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

type LazyImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
};

export default function LazyImage({
  className,
  wrapperClassName,
  onLoad,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden w-full h-full", wrapperClassName)}>
      {!loaded && <div className="absolute inset-0 bg-white/10 animate-pulse" />}
      <img
        {...props}
        className={cn(
          className,
          "block",
          "transition duration-500",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        )}
        loading={props.loading ?? "lazy"}
        decoding={props.decoding ?? "async"}
        onLoad={event => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </div>
  );
}
