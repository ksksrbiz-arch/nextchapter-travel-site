import { useEffect, useState } from "react";

type ConnectionLike = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

export function useReducedData() {
  const [reducedData, setReducedData] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const connection =
      ((navigator as Navigator & { connection?: ConnectionLike }).connection ??
        undefined) as ConnectionLike | undefined;

    if (!connection) return;

    const sync = () => {
      const isLowBandwidth =
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g";
      setReducedData(Boolean(connection.saveData || isLowBandwidth));
    };

    sync();
    connection.addEventListener?.("change", sync);
    return () => connection.removeEventListener?.("change", sync);
  }, []);

  return reducedData;
}
