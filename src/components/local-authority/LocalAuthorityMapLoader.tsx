"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` at import time, so this must never run during SSR.
const LocalAuthorityMap = dynamic(() => import("./LocalAuthorityMap"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%" }} />,
});

export default function LocalAuthorityMapLoader(props: {
  name: string;
  pins: {
    latitude: number;
    longitude: number;
    address: string;
    featured: boolean;
  }[];
}) {
  return <LocalAuthorityMap {...props} />;
}
