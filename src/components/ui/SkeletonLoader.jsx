export default function SkeletonLoader({ type = "box", count = 1, width, height, className = "" }) {
  const items = Array.from({ length: count });
  const style = { width, height };

  if (count > 1) {
    return (
      <>
        {items.map((_, index) => (
          <div key={index} className={`skeleton skeleton-${type} ${className}`} style={style} />
        ))}
      </>
    );
  }

  return <div className={`skeleton skeleton-${type} ${className}`} style={style} />;
}
