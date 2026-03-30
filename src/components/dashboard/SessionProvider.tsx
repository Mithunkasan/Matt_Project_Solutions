// "use client";

// import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

// export default function SessionProvider({
//   children,
//   session,
// }: {
//   children: React.ReactNode;
//   session: any;
// }) {
//   return (
//     <NextAuthSessionProvider session={session}>
//       {children}
//     </NextAuthSessionProvider>
//   );
// }





"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface SessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function SessionProvider({
  children,
  session,
}: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}