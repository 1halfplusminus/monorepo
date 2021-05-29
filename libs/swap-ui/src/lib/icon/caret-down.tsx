import * as React from 'react';

function CaretDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <path d="M21.364 42.218l24.329 24.329c.026.027.034.065.061.091a5.856 5.856 0 004.17 1.711 5.853 5.853 0 004.17-1.711c.027-.027.034-.064.061-.091l24.329-24.329c2.285-2.285 2.285-6.024 0-8.308s-6.024-2.285-8.308 0L49.923 54.161 29.672 33.91c-2.285-2.285-6.024-2.285-8.308 0s-2.285 6.024 0 8.308z" />
    </svg>
  );
}

const MemoCaretDown = React.memo(CaretDown);
export default MemoCaretDown;
