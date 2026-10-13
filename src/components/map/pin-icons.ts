// Leaflet divIcon factory, ported from the localtest/ prototype. Called
// lazily (never at module scope touching `window`) — safe because this
// file is only ever imported from a client-only component.
import L from "leaflet";

export function pinIcon(featured: boolean) {
  const size = featured ? 24 : 16;
  const color = featured ? "#E63950" : "#9CA3AF";
  return L.divIcon({
    className: "",
    html:
      `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;` +
      `background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(20,20,27,.4);` +
      `transform:rotate(-45deg)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}
