import * as React from 'react';
import styled from 'styled-components';

function NonMemoInformation(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} {...props}>
      <path d="M9.5 16A6.61 6.61 0 013 9.5 6.61 6.61 0 019.5 3 6.61 6.61 0 0116 9.5 6.63 6.63 0 019.5 16zm0-14A7.5 7.5 0 1017 9.5 7.5 7.5 0 009.5 2zm.5 6v4.08h1V13H8.07v-.92H9V9H8V8zM9 6h1v1H9z" />
    </svg>
  );
}

const Information = React.memo(styled(NonMemoInformation)`
  path {
    fill: white;
  }
`);

export default Information;
