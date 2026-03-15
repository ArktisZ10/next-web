import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: {} }));

import { GET, POST } from "./route";

vi.mock("better-auth/next-js", () => {
  return {
    toNextJsHandler: vi.fn(() => ({
      GET: vi.fn(),
      POST: vi.fn(),
    })),
  };
});

describe('Given the Next.js Auth API Route', () => {
  describe('When the route file is loaded', () => {
    it('Then it correctly exports GET and POST handlers', () => {
      // Given/When imports happen
      
      // Then
      expect(GET).toBeDefined();
      expect(POST).toBeDefined();
    });
  });
});
