import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft, Briefcase, Package, Receipt, Wallet2, Plus, Trash2,
  TrendingUp, TrendingDown, AlertTriangle, Pencil, X, Lightbulb, ShoppingCart,
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useBusinessStore } from '../store/businessStore';
import { useNotificationsStore } from '../store/notificationsStore';

// Mi Negocio: administración simple de un emprendimiento — productos,
// ventas, gastos y ganancia real. Pensado para quien está aprendiendo:
// cada número importante viene acompañado de qué significa.

const money = (n: number) =>
  '$' + (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type Tab = 'resumen' | 'productos' | 'ventas' | 'gastos';

const EXPENSE_CATEGORIES = ['Alquiler', 'Servicios', 'Insumos', 'Marketing', 'Transporte', 'Sueldos', 'Otros'];

export const BusinessScreen = ({ onClose, onAskJarvis }: { onClose: () => void; onAskJarvis?: (prompt: string) => void }) => {
  const store = useBusinessStore();
  const notify = useNotificationsStore((s) => s.add);
  const [tab, setTab] = useState<Tab>('resumen');
  const summary = store.getSummary();

  // Nombre del negocio (editable la primera vez y desde el lápiz)
  const [editingName, setEditingName] = useState(!store.businessName);
  const [nameDraft, setNameDraft] = useState(store.businessName);

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="absolute inset-0 bg-bg-main z-50 flex flex-col"
    >
      {/* Encabezado */}
      <div className="px-6 pt-6 pb-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={onClose} aria-label="Volver" className="p-2 -ml-2 hover:bg-bg-bubble-jarvis rounded-full transition-colors bg-bg-chat shadow-sm border border-border-subtle">
          <ChevronLeft size={24} className="text-gold-deep" />
        </button>
        <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center">
          <Briefcase size={18} />
        </div>
        <div className="flex-1 min-w-0">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={nameDraft} autoFocus placeholder="Nombre de tu negocio"
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && nameDraft.trim()) { store.setBusinessName(nameDraft); setEditingName(false); } }}
                className="flex-1 min-w-0 h-9 border-b-2 border-gold-primary bg-transparent outline-none text-[16px] font-bold text-text-primary"
              />
              <button
                onClick={() => { if (nameDraft.trim()) { store.setBusinessName(nameDraft); setEditingName(false); } }}
                className="text-xs font-bold text-gold-deep px-2"
              >
                OK
              </button>
            </div>
          ) : (
            <button onClick={() => { setNameDraft(store.businessName); setEditingName(true); }} className="flex items-center gap-2 text-left">
              <h2 className="font-bold text-lg text-text-primary truncate">{store.businessName || 'Mi Negocio'}</h2>
              <Pencil size={13} className="text-text-secondary flex-shrink-0" />
            </button>
          )}
          <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Administración de negocio</p>
        </div>
      </div>

      {/* Pestañas */}
      <div className="px-6 pb-3 flex gap-2 flex-shrink-0">
        {([
          { id: 'resumen', label: 'Resumen', Icon: TrendingUp },
          { id: 'productos', label: 'Productos', Icon: Package },
          { id: 'ventas', label: 'Ventas', Icon: Receipt },
          { id: 'gastos', label: 'Gastos', Icon: Wallet2 },
        ] as { id: Tab; label: string; Icon: any }[]).map(({ id, label, Icon }) => (
          <button
            key={id} onClick={() => setTab(id)}
            className={`flex-1 h-10 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === id ? 'gold-gradient shadow-sm' : 'bg-bg-bubble-jarvis text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10">
        {tab === 'resumen' && <ResumenTab summary={summary} onAskJarvis={onAskJarvis} goTo={setTab} />}
        {tab === 'productos' && <ProductosTab notify={notify} />}
        {tab === 'ventas' && <VentasTab notify={notify} />}
        {tab === 'gastos' && <GastosTab />}
      </div>
    </motion.div>
  );
};

/* ------------------------------- RESUMEN ------------------------------- */

const ResumenTab = ({ summary, onAskJarvis, goTo }: any) => {
  const sales = useBusinessStore((s) => s.sales);

  // Ventas de los últimos 14 días para la gráfica
  const chartData = useMemo(() => {
    const days: { day: string; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const total = sales
        .filter((x: any) => x.date.slice(0, 10) === key)
        .reduce((s: number, x: any) => s + x.total, 0);
      days.push({ day: d.getDate().toString(), total: Math.round(total * 100) / 100 });
    }
    return days;
  }, [sales]);
  const hasChartData = chartData.some((d) => d.total > 0);

  if (!summary.hasData) {
    return (
      <div className="text-center pt-14">
        <div className="w-16 h-16 rounded-2xl gold-gradient gold-glow mx-auto flex items-center justify-center mb-5">
          <Briefcase size={28} />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2 font-display">Administra tu emprendimiento</h3>
        <p className="text-sm text-text-secondary leading-relaxed max-w-[280px] mx-auto mb-7">
          Registra tus productos con costo y precio, anota cada venta y cada gasto,
          y MIDAS te dice cuánto estás ganando de verdad.
        </p>
        <button onClick={() => goTo('productos')} className="h-12 px-6 gold-gradient gold-glow rounded-2xl font-bold text-sm">
          Empezar: crear mi primer producto
        </button>
      </div>
    );
  }

  const net = summary.monthNetProfit;
  return (
    <div className="space-y-4">
      {/* Ganancia neta del mes: el número que importa */}
      <div className="bg-bg-chat rounded-3xl p-6 border border-border-subtle premium-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Ganancia neta · este mes</div>
        <div className={`text-4xl font-black tracking-tight ${net >= 0 ? 'text-gold-deep' : 'text-red-500'}`}>
          {money(net)}
        </div>
        <div className="text-[11px] text-text-secondary mt-1">
          Ventas {money(summary.monthRevenue)} − mercancía {money(summary.monthCogs)} − gastos {money(summary.monthExpenses)}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Ventas del mes', value: money(summary.monthRevenue), Icon: Receipt },
          { label: 'Ganancia bruta', value: money(summary.monthGrossProfit), Icon: TrendingUp },
          { label: 'Margen bruto', value: `${summary.marginPct}%`, Icon: summary.marginPct >= 30 ? TrendingUp : TrendingDown },
          { label: 'Gastos del mes', value: money(summary.monthExpenses), Icon: Wallet2 },
        ].map((k, i) => (
          <div key={i} className="bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow">
            <k.Icon size={16} className="text-gold-deep mb-2" />
            <div className="text-lg font-black text-text-primary">{k.value}</div>
            <div className="text-[9px] text-text-secondary uppercase font-bold tracking-wider mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Gráfica de ventas 14 días */}
      {hasChartData && (
        <div className="bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow">
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-3">Ventas · últimos 14 días</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} interval={1} />
                <Tooltip
                  formatter={(v: any) => [money(Number(v)), 'Ventas']}
                  labelFormatter={(l: any) => `Día ${l}`}
                  contentStyle={{ background: 'var(--bg-chat)', border: '1px solid var(--border-subtle)', borderRadius: 12, fontSize: 11, color: 'var(--text-primary)' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill="#DEA935" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Punto de equilibrio + producto estrella */}
      {summary.breakEvenRevenue !== null && (
        <div className="bg-gold-pale border border-gold-primary/30 rounded-2xl p-4 flex items-start gap-3">
          <Lightbulb size={18} className="text-gold-deep flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-text-primary leading-relaxed">
            <b>Punto de equilibrio:</b> con tu margen actual ({summary.marginPct}%), necesitas vender{' '}
            <b>{money(summary.breakEvenRevenue)}</b> este mes para cubrir tus gastos operativos.
            {summary.monthRevenue >= summary.breakEvenRevenue
              ? ' Ya lo superaste: todo lo demás es ganancia.'
              : ` Te faltan ${money(summary.breakEvenRevenue - summary.monthRevenue)}.`}
          </p>
        </div>
      )}
      {summary.topProduct && (
        <div className="bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow text-[12px] text-text-primary">
          ⭐ Tu producto estrella del mes es <b>{summary.topProduct}</b>.
        </div>
      )}
      {summary.lowStock.length > 0 && (
        <div className="border border-red-200 dark:border-red-900 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-text-primary leading-relaxed">
            <b>Inventario bajo:</b> {summary.lowStock.join(', ')}. Considera reabastecer.
          </p>
        </div>
      )}

      {onAskJarvis && (
        <button
          onClick={() => onAskJarvis('Analiza los números reales de mi negocio (están en mi contexto) y dame 3 recomendaciones concretas para aumentar la ganancia neta este mes.')}
          className="w-full h-12 border border-gold-primary text-gold-deep rounded-2xl font-bold text-sm hover:bg-gold-pale transition-colors"
        >
          Pedirle un análisis a Jarvis
        </button>
      )}
    </div>
  );
};

/* ------------------------------ PRODUCTOS ------------------------------ */

const ProductosTab = ({ notify }: { notify: (t: string, x: string) => void }) => {
  const { products, addProduct, updateProduct, removeProduct } = useBusinessStore();
  const [editing, setEditing] = useState<string | 'new' | null>(products.length === 0 ? 'new' : null);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const startEdit = (id: string | 'new') => {
    if (id === 'new') {
      setName(''); setCost(''); setPrice(''); setStock('');
    } else {
      const p = products.find((x) => x.id === id);
      if (p) { setName(p.name); setCost(String(p.cost)); setPrice(String(p.price)); setStock(String(p.stock)); }
    }
    setEditing(id);
  };

  const save = () => {
    const data = { name: name.trim(), cost: parseFloat(cost) || 0, price: parseFloat(price) || 0, stock: parseInt(stock) || 0 };
    if (!data.name || data.price <= 0) return;
    if (editing === 'new') {
      addProduct(data);
      notify('Mi Negocio', `Producto "${data.name}" creado.`);
    } else if (editing) {
      updateProduct(editing, data);
    }
    setEditing(null);
  };

  const marginOf = (p: { price: number; cost: number }) =>
    p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div key={p.id} className="bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-bg-bubble-jarvis flex items-center justify-center flex-shrink-0">
                <Package size={18} className="text-gold-deep" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-text-primary truncate">{p.name}</div>
                <div className="text-[11px] text-text-secondary mt-0.5">
                  Cuesta {money(p.cost)} · Vendes a {money(p.price)} · Margen {marginOf(p)}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => startEdit(p.id)} aria-label="Editar producto" className="p-2 text-text-secondary hover:text-gold-deep transition-colors"><Pencil size={15} /></button>
              <button onClick={() => removeProduct(p.id)} aria-label="Eliminar producto" className="p-2 text-text-secondary hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
          <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${p.stock <= 3 ? 'text-red-500' : 'text-text-secondary'}`}>
            {p.stock} en inventario{p.stock <= 3 ? ' · ¡reabastecer!' : ''}
          </div>
        </div>
      ))}

      {editing !== null ? (
        <div className="bg-bg-chat border border-gold-primary/40 rounded-2xl p-4 premium-shadow space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-text-secondary">
            {editing === 'new' ? 'Nuevo producto' : 'Editar producto'}
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre (ej. Torta de chocolate)" autoFocus
            className="w-full h-11 border border-border-subtle rounded-xl px-3 text-sm bg-bg-main text-text-primary outline-none focus:border-gold-primary" />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-[9px] font-bold text-text-secondary uppercase mb-1">Me cuesta $</div>
              <input value={cost} onChange={(e) => setCost(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder="0.00"
                className="w-full h-11 border border-border-subtle rounded-xl px-3 text-sm bg-bg-main text-text-primary outline-none focus:border-gold-primary" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-text-secondary uppercase mb-1">Lo vendo a $</div>
              <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder="0.00"
                className="w-full h-11 border border-border-subtle rounded-xl px-3 text-sm bg-bg-main text-text-primary outline-none focus:border-gold-primary" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-text-secondary uppercase mb-1">Tengo (unid.)</div>
              <input value={stock} onChange={(e) => setStock(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="0"
                className="w-full h-11 border border-border-subtle rounded-xl px-3 text-sm bg-bg-main text-text-primary outline-none focus:border-gold-primary" />
            </div>
          </div>
          {parseFloat(price) > 0 && (
            <p className="text-[11px] text-text-secondary">
              Ganancia por unidad: <b className="text-gold-deep">{money((parseFloat(price) || 0) - (parseFloat(cost) || 0))}</b>{' '}
              (margen {marginOf({ price: parseFloat(price) || 0, cost: parseFloat(cost) || 0 })}%)
            </p>
          )}
          <div className="flex gap-2">
            <button onClick={save} disabled={!name.trim() || !(parseFloat(price) > 0)} className="flex-1 h-11 gold-gradient rounded-xl font-bold text-sm disabled:opacity-40">Guardar</button>
            <button onClick={() => setEditing(null)} aria-label="Cancelar" className="px-4 h-11 border border-border-subtle rounded-xl text-text-secondary"><X size={16} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => startEdit('new')} className="w-full h-12 border border-gold-primary text-gold-deep rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold-pale transition-colors">
          <Plus size={16} /> Agregar producto
        </button>
      )}
    </div>
  );
};

/* -------------------------------- VENTAS -------------------------------- */

const VentasTab = ({ notify }: { notify: (t: string, x: string) => void }) => {
  const { products, sales, registerSale, removeSale } = useBusinessStore();
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('1');
  const [error, setError] = useState('');
  const selected = products.find((p) => p.id === productId);

  const sell = () => {
    setError('');
    const result = registerSale(productId, parseInt(qty) || 0);
    if (result.ok !== true) { setError(result.error); return; }
    notify('Mi Negocio', `Venta: ${result.sale.quantity}× ${result.sale.productName} por ${money(result.sale.total)} (ganancia ${money(result.sale.profit)}).`);
    setQty('1');
  };

  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border-subtle rounded-2xl">
          <p className="text-sm text-text-secondary">Primero crea un producto en la pestaña Productos.</p>
        </div>
      ) : (
        <div className="bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <ShoppingCart size={14} /> Registrar venta
          </div>
          <select value={productId} onChange={(e) => { setProductId(e.target.value); setError(''); }}
            className="w-full h-11 border border-border-subtle rounded-xl px-3 text-sm font-semibold bg-bg-main text-text-primary outline-none focus:border-gold-primary">
            <option value="">Elige el producto…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                {p.name} · {money(p.price)} {p.stock <= 0 ? '(sin stock)' : `(${p.stock} disp.)`}
              </option>
            ))}
          </select>
          <div className="flex gap-2 items-center">
            <input value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))} inputMode="numeric" aria-label="Cantidad"
              className="w-24 h-11 border border-border-subtle rounded-xl px-3 text-sm text-center bg-bg-main text-text-primary outline-none focus:border-gold-primary" />
            <div className="flex-1 text-[12px] text-text-secondary">
              {selected && (parseInt(qty) || 0) > 0 ? (
                <>Total <b className="text-text-primary">{money((parseInt(qty) || 0) * selected.price)}</b> · Ganancia <b className="text-gold-deep">{money((parseInt(qty) || 0) * (selected.price - selected.cost))}</b></>
              ) : 'unidades'}
            </div>
          </div>
          {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}
          <button onClick={sell} disabled={!selected || (parseInt(qty) || 0) <= 0}
            className="w-full h-12 gold-gradient gold-glow rounded-xl font-bold text-sm disabled:opacity-40">
            Registrar venta
          </button>
        </div>
      )}

      {sales.length > 0 && (
        <div>
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-3">Historial ({sales.length})</div>
          <div className="space-y-2">
            {sales.slice(0, 30).map((s) => (
              <div key={s.id} className="bg-bg-chat border border-border-subtle rounded-2xl p-3.5 flex items-center justify-between premium-shadow">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-text-primary truncate">{s.quantity}× {s.productName}</div>
                  <div className="text-[10px] text-text-secondary mt-0.5">
                    {new Date(s.date).toLocaleString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {' · '}ganancia {money(s.profit)}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-sm font-bold text-green-600">+{money(s.total)}</div>
                  <button onClick={() => removeSale(s.id)} aria-label="Anular venta (devuelve inventario)" className="p-1.5 text-text-secondary hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------- GASTOS -------------------------------- */

const GastosTab = () => {
  const { expenses, addExpense, removeExpense } = useBusinessStore();
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const save = () => {
    const val = parseFloat(amount) || 0;
    if (val <= 0) return;
    addExpense(category, val, note);
    setAmount(''); setNote('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-text-secondary">Registrar gasto del negocio</div>
        <div className="flex gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="h-11 border border-border-subtle rounded-xl px-3 text-sm font-semibold bg-bg-main text-text-primary outline-none focus:border-gold-primary">
            {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder="$ 0.00"
            className="flex-1 h-11 border border-border-subtle rounded-xl px-3 text-sm bg-bg-main text-text-primary outline-none focus:border-gold-primary" />
        </div>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota (opcional)"
          className="w-full h-11 border border-border-subtle rounded-xl px-3 text-sm bg-bg-main text-text-primary outline-none focus:border-gold-primary" />
        <button onClick={save} disabled={!(parseFloat(amount) > 0)} className="w-full h-11 gold-gradient rounded-xl font-bold text-sm disabled:opacity-40">
          Guardar gasto
        </button>
      </div>

      {expenses.length > 0 ? (
        <div className="space-y-2">
          {expenses.slice(0, 30).map((e) => (
            <div key={e.id} className="bg-bg-chat border border-border-subtle rounded-2xl p-3.5 flex items-center justify-between premium-shadow">
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-text-primary">{e.category}</div>
                <div className="text-[10px] text-text-secondary mt-0.5 truncate">
                  {new Date(e.date).toLocaleDateString('es', { day: 'numeric', month: 'short' })}{e.note ? ` · ${e.note}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-sm font-bold text-text-primary">−{money(e.amount)}</div>
                <button onClick={() => removeExpense(e.id)} aria-label="Eliminar gasto" className="p-1.5 text-text-secondary hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-border-subtle rounded-2xl">
          <p className="text-sm text-text-secondary">Sin gastos registrados este mes.</p>
          <p className="text-[10px] text-text-secondary mt-1">Alquiler, insumos, marketing… anótalos para conocer tu ganancia real.</p>
        </div>
      )}
    </div>
  );
};
