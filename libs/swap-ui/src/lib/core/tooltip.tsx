import AntdTooltip from 'antd/lib/tooltip';
import styled from 'styled-components';

export const Tooltip = styled(AntdTooltip)``;

Tooltip.defaultProps = {
  overlayInnerStyle: { backgroundColor: 'transparent' },
};
export default Tooltip;
