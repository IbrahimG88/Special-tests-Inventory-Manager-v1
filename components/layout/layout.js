"use client";
import TemporaryDrawer from "./mui-temporary-drawer";
import ResponsiveDrawer from "./mui-temporary-drawer";
import SplashScreen from "../SplashScreen";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState(isHome);

  useEffect(() => {
    if (isLoading) {
      return;
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && isHome ? (
        <SplashScreen finishLoading={() => setIsLoading(false)} />
      ) : (
        <>
          <TemporaryDrawer />
          <main>{children}</main>
        </>
      )}
    </>
  );
}
