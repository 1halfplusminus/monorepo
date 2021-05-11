import React, { ReactNode } from 'react';

import styled from 'styled-components';
import tw from 'twin.macro';
import NumberFormat from 'react-number-format';

export interface StatistiqueCardProps {
  type: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  number: ReactNode | number;
  variation?: ['-' | '+', number] | ReactNode;
  description: ReactNode;
}

export const getColor = (type: StatistiqueCardProps['type']) => {
  switch (type) {
    case 'warning':
      return '#fa9b4c';
    case 'success':
      return '#19be5e';
    case 'danger':
      return '#d1335b';
    default:
      return '#53657d';
  }
};

const StatistiqueCardTitle = styled.h4`
  ${tw`text-xl font-bold m-0`}
`;

const StatistiqueCardDescription = styled.div`
  ${tw`w-full text-sm text-center`}
`;

const StatistiqueCardVariation = styled(
  ({ variation, ...rest }: Pick<StatistiqueCardProps, 'variation'>) => {
    return (
      <div {...rest}>
        {variation && variation[0] ? (
          <>
            ({variation[0]}{' '}
            {
              <NumberFormat
                displayType="text"
                thousandSeparator={' '}
                value={variation[1]}
              />
            }{' '}
            )
          </>
        ) : (
          <> {variation}</>
        )}
      </div>
    );
  }
)`
  ${tw`text-sm font-light`}
`;

const StyledStatistiqueCard = styled.div<Pick<StatistiqueCardProps, 'type'>>`
  ${tw`inline-flex flex-col space-y-1 items-center justify-start w-32 h-32 px-1 py-2.5 bg-white border border-gray-300 rounded-xl`}
  color: ${({ type }) => getColor(type)};
`;

export function StatistiqueCard({
  number,
  description,
  variation,
  type,
}: StatistiqueCardProps) {
  return (
    <StyledStatistiqueCard type={type}>
      <StatistiqueCardTitle>
        {typeof number === 'number' || typeof number === 'string' ? (
          <NumberFormat
            displayType="text"
            thousandSeparator={' '}
            value={number}
          />
        ) : (
          number
        )}
      </StatistiqueCardTitle>
      {variation && <StatistiqueCardVariation variation={variation} />}
      <StatistiqueCardDescription>{description}</StatistiqueCardDescription>
    </StyledStatistiqueCard>
  );
}

export default StatistiqueCard;
