import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Irfan Rahmanindra, Full Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#050505",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ color: "#60a5fa", fontSize: 28, letterSpacing: 8 }}>
        IRFAN RAHMANINDRA
      </div>
      <div style={{ fontSize: 72, fontWeight: 700, marginTop: 32 }}>
        Full Stack Software Engineer
      </div>
      <div style={{ color: "#a1a1aa", fontSize: 30, marginTop: 28 }}>
        Enterprise systems, web applications, and technology strategy.
      </div>
    </div>,
    { ...size },
  );
}