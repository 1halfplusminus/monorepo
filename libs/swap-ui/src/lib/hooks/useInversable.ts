import { useState } from 'react';
export interface UseInversableProps {
  inversed: boolean;
}

export type UseInversable = (
  props: UseInversableProps
) => { inverse: () => void; inversed: boolean };

export const useInversable: UseInversable = ({ inversed: defaultInversed }) => {
  const [inversed, setInversed] = useState(defaultInversed);
  return {
    inversed,
    inverse: () => setInversed(!inversed),
  };
};
