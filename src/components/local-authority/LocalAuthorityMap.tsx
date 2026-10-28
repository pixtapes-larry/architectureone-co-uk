"use client";

import { useEffect, useRef } from "react";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { pinIcon } from "@/components/map/pin-icons";
import { JAWG_URL, JAWG_ATTRIBUTION } from "@/lib/map-constants";
import { localAuthorityBoundarySlug } from "@/lib/local-authority-slug";
import styles from "./LocalAuthorityMap.module.css";

type MapPin = {
  latitude: number;
  longitude: number;
  address: string;
  featured: boolean;
};

export default function LocalAuthorityMap({
  name,
  pins,
}: {
  name: string;
  pins: MapPin[];
}) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return;
    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;

    import("leaflet").then(async (leafletModule) => {
      if (cancelled || !mapElRef.current) return;
      const Leaflet = leafletModule.default;

      const map = Leaflet.map(mapElRef.current, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      // The map can initialize while its flex/grid column hasn't settled to
      // its final width yet (fonts loading, layout reflow) — Leaflet caches
      // that size and never revisits it on its own, leaving the tiles and
      // fitBounds() framing stuck to a too-small viewport. Watch the
      // container and tell Leaflet to re-measure whenever it changes.
      resizeObserver = new ResizeObserver(() => map.invalidateSize());
      resizeObserver.observe(mapElRef.current);

      Leaflet.tileLayer(JAWG_URL, {
        maxZoom: 22,
        attribution: JAWG_ATTRIBUTION,
      }).addTo(map);

      pins.forEach((p) => {
        Leaflet.marker([p.latitude, p.longitude], {
          icon: pinIcon(p.featured),
        })
          .bindTooltip(p.address, { permanent: false })
          .addTo(map);
      });

      const slug = localAuthorityBoundarySlug(name);
      let boundaryBounds: L.LatLngBounds | null = null;
      try {
        const res = await fetch(`/boundaries/by-la/${slug}.geojson`);
        if (res.ok && !cancelled) {
          const geojson = await res.json();
          const boundaryLayer = Leaflet.geoJSON(geojson, {
            style: {
              color: "#E63950",
              weight: 2,
              fillColor: "#E63950",
              fillOpacity: 0.06,
            },
          }).addTo(map);
          boundaryBounds = boundaryLayer.getBounds();
        }
      } catch {
        // boundary file missing for this authority — fall back to pins only
      }

      map.invalidateSize();

      if (boundaryBounds && boundaryBounds.isValid()) {
        map.fitBounds(boundaryBounds, { padding: [16, 16] });
      } else if (pins.length > 0) {
        const pinBounds = Leaflet.latLngBounds(
          pins.map((p) => [p.latitude, p.longitude] as [number, number]),
        );
        map.fitBounds(pinBounds, { padding: [32, 32] });
      } else {
        map.setView([52.2, 0.8], 9);
      }
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return <div ref={mapElRef} className={styles.map} />;
}
