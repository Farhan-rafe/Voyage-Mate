import React, { useMemo, useState } from "react";
import axios from "axios";

const currencies = ["USD", "EUR", "BDT", "GBP", "INR", "JPY", "AUD"];

export default function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("BDT");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [justConverted, setJustConverted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canConvert = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) && n >= 0 && amount.trim() !== "";
  }, [amount]);

  const convert = async () => {
    setLoading(true);
    setError(null);
    setJustConverted(false);

    try {
      const res = await axios.post("/currency/convert", {
        from,
        to,
        amount: Number(amount),
      });

      setResult(res.data.result);
      setRate(res.data.rate);
      setJustConverted(true);

      window.setTimeout(() => setJustConverted(false), 1500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        `Conversion failed (${err?.response?.status || "unknown"})`;
      setResult(null);
      setRate(null);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-900">
            Currency Converter
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Convert currencies to estimate your budget.
          </p>
        </div>


      </div>

      <div className="mt-4 grid gap-4">
        {/* From/To */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              From
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-sky-100 transition focus:border-sky-400 focus:ring-2"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              To
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-sky-100 transition focus:border-sky-400 focus:ring-2"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Ex: 1500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-sky-100 transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Enter the amount in <span className="font-medium">{from}</span>.
          </p>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={convert}
          disabled={loading || !canConvert}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Converting…" : justConverted ? "Converted ✓" : "Convert"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-[11px] font-medium text-red-600">{error}</p>
        )}

        {/* Result */}
        {result !== null && (
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              Converted Amount
            </p>

            <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              {Number(result).toFixed(2)}{" "}
              <span className="text-sm font-medium text-slate-600">{to}</span>
            </div>

            {rate !== null && (
              <p className="mt-1 text-[11px] text-slate-400">
                1 {from} ≈ {Number(rate).toFixed(4)} {to}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
