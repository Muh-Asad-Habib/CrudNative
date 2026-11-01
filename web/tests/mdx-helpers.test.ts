import { describe, expect, it } from "vitest";
import { parseTree } from "@/components/mdx/file-tree";
import { buildStyleCode } from "@/components/labs/flexbox-playground";

describe("parseTree (FileTree)", () => {
  it("mendeteksi indentasi 2 spasi, folder, komentar, dan highlight", () => {
    const rows = parseTree(`
belajar-api/
  src/
    * server.js # titik masuk
  package.json
`);
    expect(rows).toEqual([
      { depth: 0, name: "belajar-api/", comment: undefined, folder: true, highlight: false },
      { depth: 1, name: "src/", comment: undefined, folder: true, highlight: false },
      { depth: 2, name: "server.js", comment: "titik masuk", folder: false, highlight: true },
      { depth: 1, name: "package.json", comment: undefined, folder: false, highlight: false },
    ]);
  });

  it("mendukung indentasi 4 spasi, tab, dan indentasi dasar yang tidak nol", () => {
    expect(parseTree("app/\n    _layout.js\n    (tabs)/\n        index.js").map((r) => r.depth)).toEqual([0, 1, 1, 2]);
    expect(parseTree("app/\n\tindex.js\n\t\tx.js").map((r) => r.depth)).toEqual([0, 1, 2]);
    expect(parseTree("    a/\n      b.js").map((r) => r.depth)).toEqual([0, 1]);
  });

  it("satu baris saja tetap valid", () => {
    expect(parseTree("README.md")).toEqual([
      { depth: 0, name: "README.md", comment: undefined, folder: false, highlight: false },
    ]);
  });

  it("tanda # tanpa spasi di depannya bukan komentar", () => {
    expect(parseTree("app/\n  tasks/[id]#.js")[1].name).toBe("tasks/[id]#.js");
  });
});

describe("buildStyleCode (lab Flexbox)", () => {
  const base = {
    flexDirection: "column" as const,
    justifyContent: "flex-start" as const,
    alignItems: "stretch" as const,
    flexWrap: "nowrap" as const,
    gap: 8,
    count: 3,
    growFirst: false,
  };

  it("menghasilkan StyleSheet default", () => {
    const code = buildStyleCode(base);
    expect(code).toContain("import { StyleSheet } from 'react-native';");
    expect(code).toContain("flexDirection: 'column',");
    expect(code).toContain("gap: 8,");
    expect(code).toContain("height: 56,");
    expect(code).not.toContain("flexWrap");
    expect(code).not.toContain("width: 56");
    expect(code.trim().endsWith("});")).toBe(true);
  });

  it("row + wrap + alignItems non-stretch menambah ukuran sumbu silang", () => {
    const code = buildStyleCode({ ...base, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 0 });
    expect(code).toContain("flexWrap: 'wrap',");
    expect(code).toContain("width: 56,");
    expect(code).toContain("height: 56,");
    expect(code).not.toContain("gap:");
  });

  it("growFirst menambahkan style first", () => {
    expect(buildStyleCode({ ...base, growFirst: true })).toContain("first: { flex: 1 },");
  });
});
