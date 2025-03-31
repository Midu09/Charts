export default function CryptoSelector({
  currentCoin,
  setCurrentCoin,
  theme,
  getCryptoImage,
}) {
  return (
    <select
      value={currentCoin}
      onChange={(e) => setCurrentCoin(e.target.value)}
      className={`px-3 py-1 rounded-md ${
        theme === "dark"
          ? "bg-gray-700 hover:bg-gray-600"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      <option value="BTCUSDT">BTC/USDT</option>
      <option value="ETHUSDT">ETH/USDT</option>
      <option value="SOLUSDT">SOL/USDT</option>
      <option value="BNBUSDT">BNB/USDT</option>
    </select>
  );
}
