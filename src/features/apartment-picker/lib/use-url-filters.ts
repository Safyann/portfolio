'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import type { PickerFilters } from '../model/types';
import { parseFilters, serializeFilters } from './filters';

// URL — единственный источник правды: фильтры не дублируются в useState, поэтому «назад», обновление
// страницы и отправленная ссылка всегда показывают одно и то же.
export function useUrlFilters(knownProjectIds: readonly string[]) {
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString()), knownProjectIds),
    [searchParams, knownProjectIds]
  );

  const setFilters = useCallback((nextFilters: PickerFilters) => {
    const query = serializeFilters(nextFilters);
    const nextUrl = query ? `?${query}` : window.location.pathname;

    // replaceState синхронизируется с useSearchParams и не плодит записи в истории на каждый символ.
    window.history.replaceState(null, '', nextUrl);
  }, []);

  return { filters, setFilters };
}
