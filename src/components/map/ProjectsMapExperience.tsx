"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { pinIcon } from "./pin-icons";
import {
  MOCK_PROJECTS,
  POSTCODE_SEARCH_ANCHORS,
  type ProjectMapSummary,
} from "@/lib/mock-projects";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  PROJECT_TYPE_CATEGORY,
  PROJECT_TYPE_LABELS,
  type Category,
} from "@/lib/project-labels";
import { JAWG_URL, JAWG_ATTRIBUTION } from "@/lib/map-constants";
import styles from "./ProjectsMapExperience.module.css";

const HADLEIGH_CENTER: [number, number] = [52.0428, 0.9551];

function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8;
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLng = (lng2 - lng1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type VisibleProject = ProjectMapSummary & { distance: number };

export default function ProjectsMapExperience() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<ProjectMapSummary, L.Marker>>(new Map());
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const topbarRef = useRef<HTMLDivElement>(null);
  const chipbarRef = useRef<HTMLDivElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const postcodeInputRef = useRef<HTMLInputElement>(null);

  const [activeCategory, setActiveCategory] = useState<Category | "all">(
    "all",
  );
  const [searchOpen, setSearchOpen] = useState(true);
  const [postcode, setPostcode] = useState("");
  const [visible, setVisible] = useState<VisibleProject[]>([]);
  const [status, setStatus] = useState(
    "Click a pin, or search a postcode district.",
  );

  const activeCategoryRef = useRef(activeCategory);
  activeCategoryRef.current = activeCategory;

  // mount the Leaflet map once
  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return;
    let cancelled = false;

    import("leaflet").then((leafletModule) => {
      if (cancelled || !mapElRef.current) return;
      const Leaflet = leafletModule.default;

      const map = Leaflet.map(mapElRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView(HADLEIGH_CENTER, 13);
      mapRef.current = map;

      Leaflet.tileLayer(JAWG_URL, {
        maxZoom: 22,
        attribution: JAWG_ATTRIBUTION,
      }).addTo(map);

      MOCK_PROJECTS.forEach((p) => {
        const marker = Leaflet.marker([p.latitude, p.longitude], {
          icon: pinIcon(p.featured),
        });
        marker.bindPopup(
          `<div class="${styles.popupCard}">` +
            `<img src="${p.photoUrl}" alt="${p.address}">` +
            `<span class="${styles.popupTag}">${PROJECT_TYPE_LABELS[p.projectType]}</span>` +
            `<div class="${styles.popupName}">${p.address}</div>` +
            `<div class="${styles.popupLoc}">${p.place}</div>` +
            `<div class="${styles.popupDesc}">${p.description}</div>` +
            (p.featured && p.slug
              ? `<a class="${styles.popupCta}" href="/work/${p.slug}">View case study →</a>`
              : `<span class="${styles.popupLoc}">Not yet a featured project</span>`) +
            `</div>`,
        );
        marker.on("click", () => {
          map.flyTo([p.latitude, p.longitude], Math.max(map.getZoom(), 15), {
            duration: 1.1,
          });
        });
        markersRef.current.set(p, marker);
      });

      layerGroupRef.current = Leaflet.layerGroup(
        Array.from(markersRef.current.values()),
      ).addTo(map);

      const refreshList = () => {
        const bounds = map.getBounds();
        const center = map.getCenter();
        const category = activeCategoryRef.current;
        const inView = MOCK_PROJECTS.filter(
          (p) =>
            (category === "all" ||
              PROJECT_TYPE_CATEGORY[p.projectType] === category) &&
            bounds.contains([p.latitude, p.longitude]),
        ).map((p) => ({
          ...p,
          distance: haversineMiles(
            center.lat,
            center.lng,
            p.latitude,
            p.longitude,
          ),
        }));
        inView.sort((a, b) => a.distance - b.distance);
        setVisible(inView);
        setStatus(
          inView.length === 0
            ? "No projects in view — zoom out or pan to find one."
            : `${inView.length} of ${MOCK_PROJECTS.length} projects visible — pan or zoom to see more.`,
        );
      };
      map.on("moveend zoomend", refreshList);
      refreshList();

      layoutChrome();
      window.addEventListener("resize", layoutChrome);
      if (document.fonts?.ready) document.fonts.ready.then(layoutChrome);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", layoutChrome);
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep the floating chrome clear of the header and the results strip,
  // however tall either actually renders — ported from localtest/index.html
  function layoutChrome() {
    const topH = topbarRef.current?.offsetHeight ?? 0;
    if (chipbarRef.current) chipbarRef.current.style.top = `${topH + 12}px`;
    if (reopenRef.current) reopenRef.current.style.top = `${topH + 12}px`;
    const stripH = stripRef.current?.offsetHeight ?? 0;
    if (legendRef.current)
      legendRef.current.style.bottom = `${stripH + 16}px`;
    const map = mapRef.current;
    if (map) {
      const container = map.getContainer();
      const zoomCtl = container.querySelector<HTMLElement>(
        ".leaflet-control-zoom",
      );
      if (zoomCtl) zoomCtl.style.marginBottom = `${stripH + 16}px`;
      const attrib = container.querySelector<HTMLElement>(
        ".leaflet-control-attribution",
      );
      if (attrib) attrib.style.marginBottom = `${stripH}px`;
    }
  }

  // re-run the strip height measurement whenever the card row changes
  useEffect(() => {
    layoutChrome();
  }, [visible]);

  // re-filter the marker layer and the strip when the category changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !layerGroupRef.current) return;
    import("leaflet").then((leafletModule) => {
      const Leaflet = leafletModule.default;
      map.removeLayer(layerGroupRef.current!);
      const shown = MOCK_PROJECTS.filter(
        (p) =>
          activeCategory === "all" ||
          PROJECT_TYPE_CATEGORY[p.projectType] === activeCategory,
      ).map((p) => markersRef.current.get(p)!);
      layerGroupRef.current = Leaflet.layerGroup(shown).addTo(map);
      map.fire("moveend");
    });
  }, [activeCategory]);

  function openResult(p: ProjectMapSummary) {
    const map = mapRef.current;
    const marker = markersRef.current.get(p);
    if (!map || !marker) return;
    map.flyTo([p.latitude, p.longitude], 15, { duration: 1.1 });
    marker.openPopup();
  }

  function doSearch() {
    const raw = postcode.trim().toUpperCase();
    if (!raw) return;
    const outcode = raw.split(" ")[0].replace(/[^A-Z0-9]/g, "");
    const anchor = POSTCODE_SEARCH_ANCHORS[outcode];
    const map = mapRef.current;
    if (!anchor || !map) {
      setStatus(
        `"${raw}" isn't in this demo's small postcode table — try IP7, IP1, IP8, CO9, CO10, CM6 or CM3.`,
      );
      return;
    }
    map.flyTo(anchor, 14, { duration: 1.6 });
    setSearchOpen(false);
  }

  const stripTitle =
    activeCategory === "all"
      ? `On screen (${visible.length} of ${MOCK_PROJECTS.length})`
      : `${CATEGORY_LABELS[activeCategory]}s on screen (${visible.length} of ${MOCK_PROJECTS.length})`;

  return (
    <div className={styles.wrap}>
      <div ref={mapElRef} className={styles.map} />

      <div ref={topbarRef} className={styles.topbar}>
        <Link href="/" className={styles.wordmark}>
          AO · Architecture ONE
        </Link>
        <div className={styles.actions}>
          <Link href="/contact" className={styles.contact}>
            Contact Us
          </Link>
          <Link href="/book-a-consultation" className={styles.btnPrimary}>
            Book a Consultation
          </Link>
        </div>
      </div>

      <div ref={chipbarRef} className={styles.chipbar}>
        <button
          className={`${styles.chip} ${activeCategory === "all" ? styles.chipOn : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.chip} ${activeCategory === cat ? styles.chipOn : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {searchOpen && (
        <div className={styles.scrim} onClick={() => setSearchOpen(false)} />
      )}
      {searchOpen && (
        <div className={styles.searchcard}>
          <h1>
            <span>850+ projects.</span>
            <br />
            One map.
          </h1>
          <p>
            Enter a postcode district to see Architecture ONE&apos;s work
            near you.
          </p>
          <div className={styles.searchRow}>
            <input
              ref={postcodeInputRef}
              className={styles.searchInput}
              placeholder="Try IP7, IP1, CO10, CM3…"
              autoComplete="off"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") doSearch();
              }}
            />
            <button
              className={styles.searchBtn}
              aria-label="Search"
              onClick={doSearch}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" />
                <line
                  x1="11.5"
                  y1="11.5"
                  x2="15"
                  y2="15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className={styles.searchMeta}>
            We&apos;re starting you off in Hadleigh, Suffolk — search to look
            elsewhere
          </div>
        </div>
      )}
      {!searchOpen && (
        <button
          ref={reopenRef}
          className={styles.reopen}
          aria-label="Open search"
          onClick={() => {
            setSearchOpen(true);
            requestAnimationFrame(() => postcodeInputRef.current?.focus());
          }}
        >
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="11.5"
              y1="11.5"
              x2="15"
              y2="15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      <div ref={legendRef} className={styles.legend}>
        <span className={styles.legendRow}>
          <span className={styles.swatch} style={{ background: "#E63950" }} />
          Featured case study
        </span>
        <span className={styles.legendRow}>
          <span className={styles.swatch} style={{ background: "#9CA3AF" }} />
          Project location
        </span>
      </div>

      <div ref={stripRef} className={styles.strip}>
        <div className={styles.stripHead}>
          <h2 className={styles.stripTitle}>{stripTitle}</h2>
          <div className={styles.stripStatus}>{status}</div>
        </div>
        <div className={styles.row}>
          {visible.map((p, i) => (
            <button
              key={`${p.address}-${i}`}
              className={styles.card}
              onClick={() => openResult(p)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.cardImg}
                src={p.photoUrl}
                alt=""
              />
              <div>
                <div className={styles.cardName}>{p.address}</div>
                <div className={styles.cardMeta}>
                  {p.place} · {p.distance.toFixed(1)} mi
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
