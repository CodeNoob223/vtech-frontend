import { useEffect, useState } from "react";
type selectCardProp = {
  content?: string,
  handleClick?: React.MouseEventHandler | undefined,
  select: boolean
}

export default function SmallSelectCard({ content, handleClick, select }: selectCardProp): JSX.Element {

  return (
    <button
      className={`${select ? "bg-primary" : "bg-secondary"} box-border flex rounded-full text-white font-medium text-xs px-3 py-1 max-h-6`}
      onClick={handleClick}
    >
      {content}
    </button>
  );
}