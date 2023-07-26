export default function CategoryCard({title, url, coverImage} : AppCategoryCard) : JSX.Element {
  return (
    <div className="shrink-0 relative w-52 sm:w-[280px] h-[360px] rounded-3xl overflow-hidden">
      <img src={coverImage || "/images/category-placeholder.png"} className="absolute w-full h-full object-cover" alt="category background" />
      <img src="/images/black-fg.png" className="absolute w-full h-full" alt="black foreground" />
      <h3 className="absolute center">
        <a className="text-white02 font-medium" href={url}>
          {title}
        </a>
      </h3>
    </div>
  );
}