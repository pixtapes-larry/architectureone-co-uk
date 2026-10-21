"use client";

import { useEffect, useRef } from "react";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { pinIcon } from "@/components/map/pin-icons";
import { JAWG_URL, JAWG_ATTRIBUTION } from "@/lib/map-constants";
import styles from "./ProjectMiniMap.module.css";

export default function ProjectMiniMap({
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

      // A locator thumbnail, not a mini explorer — interactions stay off
      // so it reads as a fixed image rather than an interactive map.
      const map = Leaflet.map(mapElRef.current, {
        center: [latitude, longitude],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      });
      mapRef.current = map;

      Leaflet.tileLayer(JAWG_URL, {
        maxZoom: 22,
        attribution: JAWG_ATTRIBUTION,
      }).addTo(map);

      Leaflet.marker([latitude, longitude], { icon: pinIcon(true) })
        .bindTooltip(label, { permanent: false })
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
