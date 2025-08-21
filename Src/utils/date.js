const nowISO = () => new Date().toISOString();

export { nowISO };

const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
export { formatTime };
