"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` at import time, so this must never run during SSR.
const OfficeMap = dynamic(() => import("./OfficeMap"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: 320 }} />,
});

export default function OfficeMapLoader(props: {
  latitude: number;
  longitude: number;
  label: string;
}) {
  return <OfficeMap {...props} />;
}
