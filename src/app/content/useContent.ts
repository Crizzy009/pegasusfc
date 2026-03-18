import { useEffect, useMemo, useState } from "react";
import { fetchPublicContent } from "./api";
import type { ContentItem, ContentType } from "./types";

export function usePublicContent<T>(type: ContentType) {
  const [items, setItems] = useState<ContentItem<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPublicContent<T>(type)
      .then((res) => {
        if (cancelled) return;
        setItems(res);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message || "failed_to_load");
        setItems([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [type]);

  const data = useMemo(() => items.map((i) => i.data), [items]);

  return { items, data, loading, error };
}

