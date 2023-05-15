import { useRouter } from "next/router";
import OrderDetails from "./order-details";

export default function OrderDetailsPage() {
  const router = useRouter();
  const { selectedItems } = router.query;

  console.log("selectedItems:", selectedItems);

  let parsedItems = [];

  try {
    // use an empty array as a fallback value
    parsedItems = JSON.parse(selectedItems || "[]");
  } catch (error) {
    console.error(error);
    // handle error here
  }

  return <OrderDetails selectedItems={parsedItems} />;
}
