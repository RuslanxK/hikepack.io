import { useTransition } from '@react-spring/web';

interface AnimationConfig<T> {
  items: T[];
  keys: (item: T) => string | number;
  from?: object;
  enter?: object;
  leave?: object;
}

export const useAnimation = <T>({
  items,
  keys,
  from = { opacity: 0, transform: 'translateY(20px)' },
  enter = { opacity: 1, transform: 'translateY(0)' },
  leave = { opacity: 0, transform: 'translateY(-20px)' },
}: AnimationConfig<T>) => {
  return useTransition(items, {
    keys,
    from,
    enter,
    leave,
  });
};
