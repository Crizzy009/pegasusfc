import { describe, expect, it, vi } from "vitest";

vi.mock("../lib/http", () => {
  return {
    apiJson: vi.fn(),
    apiUpload: vi.fn(),
    apiUploadWithHeaders: vi.fn(),
  };
});

vi.mock("../supabase/config", () => {
  return {
    getSupabaseConfig: () => ({ url: "https://example.supabase.co", anonKey: "anon" }),
  };
});

vi.mock("../supabase/auth", () => {
  return {
    getAccessToken: () => "test_token",
  };
});

import { apiJson } from "../lib/http";
import { createAdminContent, uploadImage } from "./api";

describe("createAdminContent", () => {
  it("returns id for players when edge function responds with ids[]", async () => {
    (apiJson as any).mockResolvedValueOnce({ inserted: 2, ids: ["player_abc", "player_def"] });
    const id = await createAdminContent("player", { name: "x" } as any, "published");
    expect(id).toBe("player_abc");
  });

  it("returns id for players when edge function responds with id", async () => {
    (apiJson as any).mockResolvedValueOnce({ id: "player_xyz" });
    const id = await createAdminContent("player", { name: "x" } as any, "published");
    expect(id).toBe("player_xyz");
  });

  it("sends authorization header for player admin calls", async () => {
    (apiJson as any).mockResolvedValueOnce({ id: "player_xyz" });
    await createAdminContent("player", { name: "x" } as any, "published");
    expect((apiJson as any).mock.calls[0][1].headers.Authorization).toBe("Bearer test_token");
    expect((apiJson as any).mock.calls[0][1].headers["x-admin"]).toBe("1");
  });
});

describe("uploadImage", () => {
  it("rejects files larger than the configured max size", async () => {
    const bytes = new Uint8Array(6 * 1024 * 1024);
    const f = new File([bytes], "big.png", { type: "image/png" });
    await expect(uploadImage(f)).rejects.toThrow("file_too_large_max_5mb");
  });
});
