import "./globals.css";

export const metadata = {
  title: "Flashcard Frenzy",
  description: "Multiplayer flashcard game using Next.js and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Flashcard Frenzy</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
