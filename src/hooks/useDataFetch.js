import { useCallback, useEffect, useState } from "react";

const identity = (item) => item;

export function useDataFetch(fetcher, normalizer = identity, options = {}) {
  const {
    autoLoad = true,
    clearError,
    filter,
    initialData = [],
    onError,
  } = options;

  const [items, setItems] = useState(initialData);

  const load = useCallback(async () => {
    try {
      const data = await fetcher();
      const normalizedItems = (data || []).map(normalizer);
      setItems(filter ? normalizedItems.filter(filter) : normalizedItems);
    } catch (error) {
      if (onError) onError(error);
    }
  }, [fetcher, filter, normalizer, onError]);

  const retry = useCallback(() => {
    if (clearError) clearError();
    load();
  }, [clearError, load]);

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  return {
    items,
    load,
    retry,
    setItems,
  };
}
