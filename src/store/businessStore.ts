import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mi Negocio: administración simple y real de un emprendimiento.
// Productos con costo/precio/inventario, ventas que descuentan stock y
// calculan ganancia, y gastos operativos. Todo persiste en el dispositivo.

export interface Product {
  id: string;
  name: string;
  cost: number;   // costo unitario
  price: number;  // precio de venta unitario
  stock: number;  // unidades disponibles
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  total: number;   // quantity * unitPrice
  profit: number;  // quantity * (unitPrice - unitCost)
  date: string;    // ISO
}

export interface BizExpense {
  id: string;
  category: string;
  note: string;
  amount: number;
  date: string; // ISO
}

interface BusinessStore {
  businessName: string;
  products: Product[];
  sales: Sale[];
  expenses: BizExpense[];
  setBusinessName: (name: string) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, patch: Partial<Omit<Product, 'id'>>) => void;
  removeProduct: (id: string) => void;
  registerSale: (productId: string, quantity: number, unitPriceOverride?: number) =>
    { ok: true; sale: Sale } | { ok: false; error: string };
  removeSale: (id: string) => void; // devuelve el stock
  addExpense: (category: string, amount: number, note?: string) => void;
  removeExpense: (id: string) => void;
  getSummary: () => BusinessSummary;
}

export interface BusinessSummary {
  hasData: boolean;
  monthRevenue: number;
  monthCogs: number;        // costo de lo vendido
  monthGrossProfit: number; // ventas - costo de mercancía
  monthExpenses: number;    // gastos operativos
  monthNetProfit: number;   // ganancia neta
  marginPct: number;        // margen bruto %
  breakEvenRevenue: number | null; // ventas necesarias para cubrir gastos del mes
  productCount: number;
  lowStock: string[];       // productos con 3 o menos unidades
  topProduct: string | null;
}

const newId = () =>
  Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

const money = (n: number) => Math.round((Number(n) || 0) * 100) / 100;

const isThisMonth = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
};

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set, get) => ({
      businessName: '',
      products: [],
      sales: [],
      expenses: [],

      setBusinessName: (name) => set({ businessName: name.trim() }),

      addProduct: (p) =>
        set((s) => ({
          products: [
            ...s.products,
            {
              id: newId(),
              name: p.name.trim(),
              cost: money(Math.max(0, p.cost)),
              price: money(Math.max(0, p.price)),
              stock: Math.max(0, Math.floor(Number(p.stock) || 0)),
            },
          ],
        })),

      updateProduct: (id, patch) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...patch,
                  ...(patch.cost !== undefined ? { cost: money(Math.max(0, patch.cost)) } : {}),
                  ...(patch.price !== undefined ? { price: money(Math.max(0, patch.price)) } : {}),
                  ...(patch.stock !== undefined ? { stock: Math.max(0, Math.floor(Number(patch.stock) || 0)) } : {}),
                }
              : p
          ),
        })),

      removeProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      registerSale: (productId, quantity, unitPriceOverride) => {
        const product = get().products.find((p) => p.id === productId);
        const qty = Math.floor(Number(quantity) || 0);
        if (!product) return { ok: false as const, error: 'Producto no encontrado.' };
        if (qty <= 0) return { ok: false as const, error: 'La cantidad debe ser mayor a 0.' };
        if (qty > product.stock)
          return { ok: false as const, error: `Solo quedan ${product.stock} unidades de ${product.name}.` };

        const unitPrice = money(unitPriceOverride !== undefined && unitPriceOverride > 0 ? unitPriceOverride : product.price);
        const sale: Sale = {
          id: newId(),
          productId: product.id,
          productName: product.name,
          quantity: qty,
          unitPrice,
          unitCost: product.cost,
          total: money(qty * unitPrice),
          profit: money(qty * (unitPrice - product.cost)),
          date: new Date().toISOString(),
        };
        set((s) => ({
          sales: [sale, ...s.sales],
          products: s.products.map((p) =>
            p.id === productId ? { ...p, stock: p.stock - qty } : p
          ),
        }));
        return { ok: true as const, sale };
      },

      removeSale: (id) => {
        const sale = get().sales.find((x) => x.id === id);
        set((s) => ({
          sales: s.sales.filter((x) => x.id !== id),
          // Al anular la venta, el inventario vuelve.
          products: sale
            ? s.products.map((p) =>
                p.id === sale.productId ? { ...p, stock: p.stock + sale.quantity } : p
              )
            : s.products,
        }));
      },

      addExpense: (category, amount, note) =>
        set((s) => ({
          expenses: [
            { id: newId(), category, amount: money(Math.max(0, amount)), note: note?.trim() || '', date: new Date().toISOString() },
            ...s.expenses,
          ],
        })),

      removeExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      getSummary: () => {
        const { products, sales, expenses } = get();
        const mSales = sales.filter((x) => isThisMonth(x.date));
        const mExpenses = expenses.filter((x) => isThisMonth(x.date));

        const monthRevenue = money(mSales.reduce((s, x) => s + x.total, 0));
        const monthCogs = money(mSales.reduce((s, x) => s + x.quantity * x.unitCost, 0));
        const monthGrossProfit = money(monthRevenue - monthCogs);
        const monthExpenses = money(mExpenses.reduce((s, x) => s + x.amount, 0));
        const monthNetProfit = money(monthGrossProfit - monthExpenses);
        const marginPct = monthRevenue > 0 ? Math.round((monthGrossProfit / monthRevenue) * 1000) / 10 : 0;
        // Punto de equilibrio: cuánto hay que vender para cubrir los gastos
        // operativos del mes, dado el margen bruto actual.
        const breakEvenRevenue =
          monthRevenue > 0 && monthGrossProfit > 0
            ? money(monthExpenses / (monthGrossProfit / monthRevenue))
            : null;

        const byProduct: Record<string, number> = {};
        for (const x of mSales) byProduct[x.productName] = (byProduct[x.productName] || 0) + x.total;
        const topProduct = Object.entries(byProduct).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        return {
          hasData: products.length > 0 || sales.length > 0 || expenses.length > 0,
          monthRevenue,
          monthCogs,
          monthGrossProfit,
          monthExpenses,
          monthNetProfit,
          marginPct,
          breakEvenRevenue,
          productCount: products.length,
          lowStock: products.filter((p) => p.stock <= 3).map((p) => `${p.name} (${p.stock})`),
          topProduct,
        };
      },
    }),
    { name: 'midas_business' }
  )
);
