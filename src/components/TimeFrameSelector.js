export default function TimeFrameSelector({
  currentTimeFrame,
  setCurrentTimeFrame,
  theme,
}) {
  const timeFrames = [
    { value: "1m", label: "1 Minute" },
    { value: "5m", label: "5 Minutes" },
    { value: "30m", label: "30 Minutes" },
    { value: "1h", label: "1 Hour" },
    { value: "4h", label: "4 Hours" },
    { value: "1d", label: "1 Day" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {timeFrames.map((tf) => (
        <button
          key={tf.value}
          onClick={() => setCurrentTimeFrame(tf.value)}
          className={`px-3 py-1 rounded-md text-sm ${
            currentTimeFrame === tf.value
              ? theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              : theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}
