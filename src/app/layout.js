import "./globals.css";

export const metadata = {
  title: "Funny resume checker",
  description: "reveiw resume by ai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
