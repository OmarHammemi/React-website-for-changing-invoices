import React, { useMemo, useState } from "react";

export default function App() {
  const [value, setValue] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [currencies] = useState(["EUR", "USD", "CAD"]);
  const [result, setResult] = useState(0);

  const fromCurrencies = useMemo(() => {
    return currencies.filter((c) => c !== toCurrency);
  }, [currencies, toCurrency]);

  const toCurrencies = useMemo(() => {
    return currencies.filter((c) => c !== fromCurrency);
  }, [currencies, fromCurrency]);

  const convert = async (e) => {
    e.preventDefault();
    const formValid = +value >= 0 && fromCurrency && toCurrency;
    if (!formValid) {
      return;
    }
    const res = await fetch(
      `http://api.exchangeratesapi.io/v1/convert?access_key=dd1d20ed653e1add31173e99583bba61&from=USD&to=EUR&amount=${fromCurrency}`
    );
    const { rates } = await res.json();
    setResult(+value * rates[toCurrency]);
  };

  return (
    <div>
      <form onSubmit={convert}>
        <div>
          <label>value</label>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div>
          <label>from currency</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {fromCurrencies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label>to currency</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {toCurrencies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button type="submit">convert</button>
      </form>
      <div>
        {value} {fromCurrency} is {result.toFixed(2)} {toCurrency}
      </div>
    </div>
  );
}
