//Chuyen tu file TS sang JS
import axios from "axios";

export const GetCandles = async (currentTimeFrame, currentCoin) => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${currentCoin}&interval=${currentTimeFrame}&limit=1000`
    );

    return response.data.map((item) => ({
      openTime: item[0],
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
      closeTime: item[6],
      baseAssetVolume: parseFloat(item[7]),
      numberOfTrades: item[8],
      takerBuyVolume: parseFloat(item[9]),
      takerBuyBaseAssetVolume: parseFloat(item[10]),
      ignore: parseFloat(item[11]),
    }));
  } catch (error) {
    console.error("Error fetching candlestick data:", error);
    return [];
  }
};

export const GetCryptoInfo = async (currentCoin) => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${currentCoin}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching crypto info:", error);
    throw error;
  }
};

export const GetLiveCandle = (currentTimeFrame, currentCoin) => {
  return `wss://stream.binance.com:9443/ws/${currentCoin.toLowerCase()}@kline_${currentTimeFrame}`;
};

export const cryptoCoins = [
  {
    cryptoName: "BTCUSDT",
    cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
  },
  {
    cryptoName: "ETHUSDT",
    cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },
  {
    cryptoName: "SOLUSDT",
    cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
  },
  {
    cryptoName: "BNBUSDT",
    cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
  },
];

export const getCryptoImage = (getCoin) => {
  const coin = cryptoCoins.find((crypto) => crypto.cryptoName === getCoin);
  return coin ? coin.cryptoImage : null;
};
