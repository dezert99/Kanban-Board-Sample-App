import type { Metadata } from "next";
import "./globals.css";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Kanban Task Management",
  description: "A modern Kanban board for task management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}