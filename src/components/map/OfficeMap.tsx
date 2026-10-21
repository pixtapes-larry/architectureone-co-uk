"use client";

import { useEffect, useRef } from "react";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { officePinIcon } from "./pin-icons";
import { JAWG_URL, JAWG_ATTRIBUTION } from "@/lib/map-constants";
import styles from "./OfficeMap.module.css";

export default function OfficeMap({
  latitude,
  longitude,
  label,
}: {
  latitude: number;
  longitude: number;
  label: string;
}) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return;
    let cancelled = false;

    import("leaflet").then((leafletModule) => {
      if (cancelled || !mapElRef.current) return;
      const Leaflet = leafletModule.default;

      // Unlike the per-project mini map, this one's meant to be explored
      // (zoom in to check the route, pan around) — a real small map, not
      // a static locator thumbnail.
      const map = Leaflet.map(mapElRef.current, {
        center: [latitude, longitude],
        zoom: 14,
      });
      mapRef.current = map;

      Leaflet.tileLayer(JAWG_URL, {
        maxZoom: 22,
        attribution: JAWG_ATTRIBUTION,
      }).addTo(map);

      Leaflet.marker([latitude, longitude], { icon: officePinIcon() })
        .bindPopup(label)
        .addTo(map);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  return <div ref={mapElRef} className={styles.map} />;
}
