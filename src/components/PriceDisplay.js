export default function PriceDisplay({
  currentPrice,
  priceOneMinuteAgo,
  theme,
  handleGetCurrentPrice,
}) {
  return (
    <div
      className={`mb-6 p-4 rounded-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Current Price</h2>
          {currentPrice && (
            <p className="text-2xl">
              $
              {currentPrice.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
              <span className="text-sm ml-2">
                {new Date(currentPrice.time).toLocaleTimeString()}
              </span>
            </p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">1 Minute Ago</h2>
          {priceOneMinuteAgo && (
            <p className="text-2xl">
              $
              {priceOneMinuteAgo.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
              <span className="text-sm ml-2">
                {new Date(priceOneMinuteAgo.time).toLocaleTimeString()}
              </span>
            </p>
          )}
        </div>
        <button
          onClick={handleGetCurrentPrice}
          className={`px-4 py-2 rounded-md ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Refresh Prices
        </button>
      </div>
    </div>
  );
}
