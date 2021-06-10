import * as React from 'react';

export interface SwapIconProps {
  onClick: () => void;
}
function SwapIcon({
  onClick,
  ...props
}: React.SVGProps<SVGSVGElement> & SwapIconProps) {
  return (
    <svg onClick={onClick} viewBox="0 0 96 95" fill="none" {...props}>
      <ellipse cx={48} cy={47.5} rx={48} ry={47.5} fill="#111827" />
      <ellipse cx={48} cy={47.5} rx={42} ry={41.5} fill="#374151" />
      <path
        d="M48.5 36.125v22.75M59.875 47.5L48.5 58.875 37.125 47.5"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoSwapIcon = React.memo(SwapIcon);
export default MemoSwapIcon;
