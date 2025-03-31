import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function ChartContainer({ candleData, theme }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || candleData.length === 0) return;

    // Xóa chart cũ nếu tồn tại
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Tạo chart mới
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: "solid",
          color: theme === "dark" ? "#1e293b" : "#ffffff",
        },
        textColor: theme === "dark" ? "#d1d5db" : "#374151",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: theme === "dark" ? "#334155" : "#e5e7eb" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Thêm series nến
    const candleSeries = chart.addCandlestickSeries({
      upColor: theme === "dark" ? "#10b981" : "#059669",
      downColor: theme === "dark" ? "#ef4444" : "#dc2626",
      borderVisible: false,
      wickUpColor: theme === "dark" ? "#10b981" : "#059669",
      wickDownColor: theme === "dark" ? "#ef4444" : "#dc2626",
    });

    // Chuẩn bị dữ liệu
    const formattedCandleData = candleData.map((candle) => ({
      time: candle.openTime / 1000, // Chuyển từ milliseconds sang seconds
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    // Thiết lập dữ liệu
    candleSeries.setData(formattedCandleData);

    // Thêm series volume
    const volumeSeries = chart.addHistogramSeries({
      color:
        theme === "dark"
          ? "rgba(59, 130, 246, 0.5)"
          : "rgba(59, 130, 246, 0.3)",
      priceFormat: { type: "volume" },
      priceScaleId: "",
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const formattedVolumeData = candleData.map((candle) => ({
      time: candle.openTime / 1000,
      value: candle.volume,
      color:
        candle.close > candle.open
          ? theme === "dark"
            ? "rgba(16, 185, 129, 0.5)"
            : "rgba(5, 150, 105, 0.5)"
          : theme === "dark"
          ? "rgba(239, 68, 68, 0.5)"
          : "rgba(220, 38, 38, 0.5)",
    }));

    volumeSeries.setData(formattedVolumeData);

    // Xử lý resize
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    // Lưu reference
    chartRef.current = chart;

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [candleData, theme]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
  );
}
