
import { useState, useCallback, useEffect } from "react";
import { 
  fetchAdminContent, 
  bulkAdminContent,
  createAdminContent, 
  updateAdminContent, 
  deleteAdminContent, 
  uploadImage 
} from "../../content/api";
import type { AdminContentItem, ContentType, ContentStatus } from "../../content/types";

function makeTempId(prefix: string) {
  const r =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replaceAll("-", "").slice(0, 12)
      : String(Math.random()).slice(2, 14);
  return `${prefix}_${Date.now()}_${r}`;
}

export function useAdminCRUD<T>(type: ContentType) {
  const cacheKey = `admin_cache_${type}`;
  const [items, setItems] = useState<AdminContentItem<T>[]>(() => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { items?: AdminContentItem<T>[] } | null;
      return Array.isArray(parsed?.items) ? parsed!.items : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminContent<T>({ type });
      setItems(data);
      localStorage.setItem(cacheKey, JSON.stringify({ items: data, cachedAt: Date.now() }));
    } catch (err: any) {
      setError(err.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  }, [type, cacheKey, items.length]);

  useEffect(() => {
    void loadItems({ silent: true });
  }, [loadItems]);

  const createItem = async (data: T, status: ContentStatus = "draft") => {
    const optimistic: AdminContentItem<T> = {
      id: makeTempId(type),
      type,
      data,
      status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const prev = items;
    setItems((cur) => [optimistic, ...cur]);
    try {
      const id = await createAdminContent(type, data, status);
      setItems((cur) =>
        cur.map((it) =>
          it.id === optimistic.id ? { ...it, id, createdAt: it.createdAt, updatedAt: Date.now() } : it
        )
      );
      void loadItems({ silent: true });
      return id;
    } catch (err: any) {
      setItems(prev);
      throw new Error(err.message || "Failed to create item");
    }
  };

  const createMany = async (rows: Array<{ data: T; status?: ContentStatus }>) => {
    const prev = items;
    const now = Date.now();
    const optimistic = rows.map((r) => ({
      id: makeTempId(type),
      type,
      data: r.data,
      status: r.status ?? "draft",
      createdAt: now,
      updatedAt: now,
    })) as AdminContentItem<T>[];
    setItems((cur) => [...optimistic, ...cur]);
    try {
      const tasks = rows.map((r) => createAdminContent(type, r.data, r.status ?? "draft"));
      const ids = await Promise.all(tasks);
      setItems((cur) => {
        const map = new Map(optimistic.map((o, i) => [o.id, ids[i]]));
        return cur.map((it) => {
          const nextId = map.get(it.id);
          return nextId ? { ...it, id: nextId, updatedAt: Date.now() } : it;
        });
      });
      void loadItems({ silent: true });
      return ids;
    } catch (err: any) {
      setItems(prev);
      throw new Error(err.message || "Failed to create items");
    }
  };

  const updateItem = async (id: string, data: T, status?: ContentStatus) => {
    const prev = items;
    setItems((cur) =>
      cur.map((it) =>
        it.id === id ? { ...it, data, status: status ?? it.status, updatedAt: Date.now() } : it
      )
    );
    try {
      await updateAdminContent(id, data, status);
      void loadItems({ silent: true });
    } catch (err: any) {
      setItems(prev);
      throw new Error(err.message || "Failed to update item");
    }
  };

  const deleteItem = async (id: string) => {
    const prev = items;
    setItems((cur) => cur.filter((it) => it.id !== id));
    try {
      await deleteAdminContent(id);
      void loadItems({ silent: true });
    } catch (err: any) {
      if (String(err?.message) === "not_found") {
        void loadItems({ silent: true });
        return;
      }
      if (String(err?.message) === "request_timeout") {
        void loadItems({ silent: true });
        return;
      }
      setItems(prev);
      throw new Error(err.message || "Failed to delete item");
    }
  };

  const deleteMany = async (ids: string[]) => {
    const prev = items;
    const setIds = new Set(ids);
    setItems((cur) => cur.filter((it) => !setIds.has(it.id)));
    try {
      const canBulk =
        type !== "player" &&
        ids.length > 1 &&
        ids.every((id) => id.startsWith(`${type}_`));

      if (canBulk) {
        await bulkAdminContent(ids, "delete");
      } else {
        const results = await Promise.allSettled(ids.map((id) => deleteAdminContent(id)));
        const failures = results
          .map((r) => (r.status === "rejected" ? r.reason : null))
          .filter(Boolean)
          .map((e: any) => String(e?.message ?? e));
        const nonIgnorable = failures.filter((m) => m !== "not_found" && m !== "request_timeout");
        if (nonIgnorable.length) throw new Error(nonIgnorable[0] || "delete_failed");
      void loadItems({ silent: true });
        return;
      }
      void loadItems({ silent: true });
    } catch (err: any) {
      if (String(err?.message) === "request_timeout") {
        void loadItems({ silent: true });
        return;
      }
      setItems(prev);
      throw new Error(err.message || "Failed to delete items");
    }
  };

  const upload = async (file: File) => {
    try {
      return await uploadImage(file);
    } catch (err: any) {
      throw new Error(err.message || "Failed to upload image");
    }
  };

  return {
    items,
    loading,
    error,
    refresh: () => loadItems({ silent: true }),
    createItem,
    createMany,
    updateItem,
    deleteItem,
    deleteMany,
    upload
  };
}
