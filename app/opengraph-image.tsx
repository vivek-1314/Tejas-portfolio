// Put this file at: app/opengraph-image.tsx
// Generates the preview card shown when your link is shared on WhatsApp, LinkedIn, X, etc.
import { ImageResponse } from "next/og";

export const alt = "Tejas Yadav | Sound Designer, Sound Engineer & Music Producer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#f8f7f4",
                    padding: 80,
                    color: "#0A0A0A",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 28,
                        letterSpacing: 4,
                        textTransform: "uppercase",
                        color: "#483A35",
                    }}
                >
                    dehleez.studio
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 150,
                            fontWeight: 700,
                            letterSpacing: -4,
                            lineHeight: 1,
                        }}
                    >
                        Tejas Yadav
                    </div>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 28,
                            fontSize: 38,
                            color: "#483A35",
                        }}
                    >
                        Sound Designer · Sound Engineer · Music Producer
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                        style={{
                            display: "flex",
                            width: 120,
                            height: 12,
                            background: "#E53935",
                            marginRight: 28,
                        }}
                    />
                    <div style={{ display: "flex", fontSize: 32 }}>
                        Sound, stories &amp; the spaces in between.
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
