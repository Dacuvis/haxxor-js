import { Haxxor } from "../src/core/app";

export const exampleRoutes = new Haxxor().get("/products", (ctx: any) => {
  const search = ctx.query.search ?? "semua barang";
  const page = ctx.query.page ?? "1";
  const limit = ctx.query.limit ?? "10";

  return ctx.json({
    success: true,
    message: "Berhasil mengambil data produk",
    filter: {
      keyword: search,
      halaman: parseInt(page),
      per_halaman: parseInt(limit),
    },
    data: [
      { id: 1, nama: "Sepatu Keren", harga: 250000 },
      { id: 2, nama: "Baju Santai", harga: 120000 },
    ],
  });
});
