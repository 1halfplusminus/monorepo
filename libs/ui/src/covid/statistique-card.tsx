import React, { ReactNode } from 'react';

import styled from 'styled-components';
import tw from 'twin.macro';
import NumberFormat from 'react-number-format';
import { getColor, getStatType, StatType } from './utils';
import { CountryStatistics } from '@halfoneplusminus/covid';

export interface StatistiqueCardProps {
  type: StatType | CountryStatistics;
  value: ReactNode | number;
  variation?: ['-' | '+', number] | ReactNode;
  description: ReactNode;
  onClick?: (type: StatType | CountryStatistics) => void;
}

const StatistiqueCardTitle = styled.h4`
  ${tw`text-xl font-bold m-0`}
`;

const StatistiqueCardDescription = styled.div`
  ${tw`w-full text-sm text-center`}
`;

const StatistiqueCardVariation = styled(
  ({ variation, ...rest }: Pick<StatistiqueCardProps, 'variation'>) => {
    const processVariation = (variation: StatistiqueCardProps['variation']) => {
      if (typeof variation === 'number') {
        return [variation >= 0 ? '+' : '-', variation];
      }
      return variation;
    };
    const renderVariation = (variation: StatistiqueCardProps['variation']) => {
      return (
        <div {...rest}>
          {variation && variation[0] !== undefined ? (
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
            variation
          )}
        </div>
      );
    };
    const component = renderVariation(processVariation(variation));
    return component;
  }
)`
  ${tw`text-sm font-light`}
`;

const StyledStatistiqueCard = styled.div<{ type: StatType }>`
  ${tw`cursor-pointer inline-flex flex-col space-y-1 items-center justify-start w-32 h-32 px-1 py-2.5 bg-white border border-gray-300 rounded-xl`}
  color: ${({ type }) => getColor(type)};
`;

export function StatistiqueCard({
  value: number,
  description,
  variation,
  type,
  onClick,
}: StatistiqueCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(type);
    }
  };
  return (
    <StyledStatistiqueCard onClick={handleClick} type={getStatType(type)}>
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
      {variation !== undefined ? (
        <StatistiqueCardVariation variation={variation} />
      ) : null}
      <StatistiqueCardDescription>{description}</StatistiqueCardDescription>
    </StyledStatistiqueCard>
  );
}

export default StatistiqueCard;
