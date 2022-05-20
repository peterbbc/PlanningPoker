import { useLocation } from './useLocation';

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
