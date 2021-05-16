import React from 'react';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';
import { formatDate } from '../covid/utils';
import ChevronRight from './chevron-left';
import ChevronLeft from './chevron-right';
import { OnDateChange } from './hooks';

const HeaderContainer = styled.header`
  ${tw`p-3 flex bg-blue-600 flex-row flex-wrap`}
`;

const HeaderItem = styled.div`
  ${tw`inline-flex items-center px-1 flex-row`}
`;

const HeaderGrowItem = styled.div`
  ${tw`inline-flex flex-grow items-center px-1`}
`;

const HeaderTitle = styled.h2`
  ${tw`flex-1 text-white text-lg text-center`}
`;

const iconCss = [
  `
    ${css`
      height: 2em;
      width: 2em;
      path {
        stroke: white;
      }
    `}
  `,
  tw`cursor-pointer`,
];

export interface HeaderDatePickerProps {
  date?: Date;
  onClick: OnDateChange;
}

const HeaderDatePicker = ({
  date = new Date(),
  onClick,
}: HeaderDatePickerProps) => {
  const handleRightClick = () => {
    onClick('right');
  };
  const handleLeftClick = () => {
    onClick('left');
  };
  return (
    <div
      css={css`
        ${tw`inline-flex px-1 items-center`}
      `}
    >
      <ChevronRight onClick={handleRightClick} css={iconCss} />
      <span tw="text-white text-center">
        Données au {formatDate(date, 'dd/MM/yyyy')}
      </span>
      <ChevronLeft onClick={handleLeftClick} css={iconCss} />
    </div>
  );
};
/* eslint-disable-next-line */
export interface HeaderProps {
  title: string;
  onClick: OnDateChange;
  date?: Date;
}

export function Header({ title, onClick, date = new Date() }: HeaderProps) {
  return (
    <HeaderContainer>
      <HeaderItem>
        <HeaderDatePicker date={date} onClick={onClick} />
      </HeaderItem>
      <HeaderGrowItem>
        <HeaderTitle>{title}</HeaderTitle>
      </HeaderGrowItem>
    </HeaderContainer>
  );
}

export default Header;
