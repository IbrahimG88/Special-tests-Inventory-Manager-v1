import TemporaryDrawer from "./mui-temporary-drawer";
import ResponsiveDrawer from "./mui-temporary-drawer";

export default function Layout({ children }) {
  return (
    <>
      <TemporaryDrawer />
      <main>{children}</main>
    </>
  );
}
