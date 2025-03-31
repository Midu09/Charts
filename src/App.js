import { useState, useEffect } from "react";
import {
  GetCandles,
  GetCryptoInfo,
  GetLiveCandle,
  getCryptoImage,
} from "./api/binanceApi";
import ChartContainer from "./components/ChartContainer";
import CryptoSelector from "./components/CryptoSelector";
import PriceDisplay from "./components/PriceDisplay";
import ThemeToggle from "./components/ThemeToggle";
import TimeFrameSelector from "./components/TimeFrameSelector";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [currentTimeFrame, setCurrentTimeFrame] = useState("1h");
  const [currentCoin, setCurrentCoin] = useState("BTCUSDT");
  const [candleData, setCandleData] = useState([]);
  const [priceInfo, setPriceInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceOneMinuteAgo, setPriceOneMinuteAgo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [candles, info] = await Promise.all([
          GetCandles(currentTimeFrame, currentCoin),
          GetCryptoInfo(currentCoin),
        ]);

        setCandleData(candles);
        setPriceInfo(info);

        if (candles.length > 0) {
          const current = candles[candles.length - 1];
          setCurrentPrice({
            price: current.close,
            time: current.closeTime,
          });

          if (candles.length > 1) {
            const oneMinuteAgo = candles[candles.length - 2];
            setPriceOneMinuteAgo({
              price: oneMinuteAgo.close,
              time: oneMinuteAgo.closeTime,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentTimeFrame, currentCoin]);

  useEffect(() => {
    if (!currentCoin || !currentTimeFrame) return;

    const ws = new WebSocket(GetLiveCandle(currentTimeFrame, currentCoin));

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const candle = data.k;

      setCandleData((prevData) => {
        const newData = [...prevData];
        const lastCandle = newData[newData.length - 1];

        if (lastCandle && lastCandle.openTime === candle.t) {
          lastCandle.close = parseFloat(candle.c);
          lastCandle.high = Math.max(lastCandle.high, parseFloat(candle.h));
          lastCandle.low = Math.min(lastCandle.low, parseFloat(candle.l));
          lastCandle.volume = parseFloat(candle.v);
          lastCandle.closeTime = candle.T;
        } else {
          newData.push({
            openTime: candle.t,
            open: parseFloat(candle.o),
            high: parseFloat(candle.h),
            low: parseFloat(candle.l),
            close: parseFloat(candle.c),
            volume: parseFloat(candle.v),
            closeTime: candle.T,
            baseAssetVolume: 0,
            numberOfTrades: 0,
            takerBuyVolume: 0,
            takerBuyBaseAssetVolume: 0,
            ignore: 0,
          });

          if (newData.length > 1000) {
            newData.shift();
          }
        }

        setCurrentPrice({
          price: parseFloat(candle.c),
          time: candle.T,
        });

        return newData;
      });
    };

    return () => {
      ws.close();
    };
  }, [currentTimeFrame, currentCoin]);

  const handleGetCurrentPrice = async () => {
    try {
      const info = await GetCryptoInfo(currentCoin);
      setPriceInfo(info);

      if (candleData.length > 0) {
        const current = candleData[candleData.length - 1];
        setCurrentPrice({
          price: current.close,
          time: current.closeTime,
        });

        if (candleData.length > 1) {
          const oneMinuteAgo = candleData[candleData.length - 2];
          setPriceOneMinuteAgo({
            price: oneMinuteAgo.close,
            time: oneMinuteAgo.closeTime,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching current price:", error);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {currentCoin} Price Chart
            {priceInfo && (
              <span
                className={`ml-2 text-lg ${
                  priceInfo.priceChangePercent >= 0
                    ? theme === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                    : theme === "dark"
                    ? "text-red-400"
                    : "text-red-600"
                }`}
              >
                {parseFloat(priceInfo.priceChangePercent).toFixed(2)}%
              </span>
            )}
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <CryptoSelector
              currentCoin={currentCoin}
              setCurrentCoin={setCurrentCoin}
              theme={theme}
              getCryptoImage={getCryptoImage}
            />
          </div>
        </div>

        <TimeFrameSelector
          currentTimeFrame={currentTimeFrame}
          setCurrentTimeFrame={setCurrentTimeFrame}
          theme={theme}
        />

        <PriceDisplay
          currentPrice={currentPrice}
          priceOneMinuteAgo={priceOneMinuteAgo}
          theme={theme}
          handleGetCurrentPrice={handleGetCurrentPrice}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ChartContainer candleData={candleData} theme={theme} />
        )}

        <div className="mt-4 text-sm text-gray-500">
          <p>
            Drag left/right to view historical data. Data provided by Binance
            API.
          </p>
        </div>
      </div>
    </div>
  );
}
