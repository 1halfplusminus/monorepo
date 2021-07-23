import styled from 'styled-components';
import tw from 'twin.macro';
import TransactionRejectedIcon from '../icon/transaction-rejected';

const Row = styled.div`
  ${tw`flex flex-row justify-center`}
`;
const Col = styled.div`
  ${tw`flex flex-col gap-1 pt-6 pb-6 bg-gray-800`}
`;
const Title = styled.div`
  ${tw`text-red-400 text-lg`}
`;
const StyledIcon = styled(TransactionRejectedIcon)`
  ${tw`h-16 text-red-400`}
`;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TransactionRejectedProps {}

export const TransactionRejected = (props: TransactionRejectedProps) => (
  <Col>
    <Row>
      <StyledIcon />
    </Row>
    <Row>
      <Title>Transaction Rejected</Title>
    </Row>
  </Col>
);
