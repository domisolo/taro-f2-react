import { useEffect, useRef } from 'react';

function useUnmount(effectCallback: () => void) {
  const ref = useRef(effectCallback);
  ref.current = effectCallback;

  useEffect(() => () => ref.current(), []);
}

export default useUnmount;
