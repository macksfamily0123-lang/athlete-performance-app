import type {Metadata,Viewport} from "next";
import "./globals.css";

export const metadata:Metadata={
  title:"Elite Performance Beta",
  description:"High-performance athlete development, training, testing, readiness, and progress tools.",
  applicationName:"Elite Performance",
  manifest:"/manifest.webmanifest?v=115",
  icons:{icon:"/elite-performance-speed-e.svg",apple:"/elite-performance-apple-touch-icon.png"}
};

export const viewport:Viewport={
  width:"device-width",
  initialScale:1,
  viewportFit:"cover",
  themeColor:"#0d0f0e"
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>
}
