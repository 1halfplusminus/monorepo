import * as React from 'react';

function TransactionSubmittedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" {...props}>
      <path
        d="M103.536 46.465a5 5 0 00-7.072 0l-31.82 31.82a5 5 0 107.072 7.07L100 57.071l28.284 28.284a5 5 0 007.071-7.07l-31.819-31.82zM105 150V50H95v100h10z"
        fill="#2683AB"
      />
      <circle cx={100} cy={100} r={99} stroke="#2683AB" strokeWidth={2} />
    </svg>
  );
}

const MemoTransactionSubmitted = React.memo(TransactionSubmittedIcon);
export default MemoTransactionSubmitted;
