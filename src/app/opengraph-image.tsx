import { ImageResponse } from "next/og";
import { profile } from "@/lib/profile";

export const alt = `${profile.name} — Network Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060d14",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: "#3fd0c9" }} />
          <div style={{ fontSize: 24, color: "#3fd0c9", letterSpacing: 1 }}>Network Engineer</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, color: "#e6edf3", lineHeight: 1, letterSpacing: -4 }}>
            Renz John
          </div>
          <div style={{ fontSize: 104, color: "#e6edf3", lineHeight: 1.1, letterSpacing: -4 }}>
            Manlapaz
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8fa5b8" }}>
          <div>Cisco · Fortinet · MikroTik · Meraki · UniFi</div>
          <div>{profile.location}</div>
        </div>
      </div>
    ),
    size,
  );
}
