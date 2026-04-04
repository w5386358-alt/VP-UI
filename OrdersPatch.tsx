
// 安全版 TSX（無 JSX 但統一副檔名）

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const enhanceCreateOrderRecord = (originalFn: any, props: any) => {
  return async () => {
    const {
      cart,
      customerName,
      customerPhone,
      customerAddress,
      shippingMethod,
      subtotal,
      shippingFee,
      discountAmount,
      grandTotal,
      user
    } = props;

    if (!cart || !cart.length) return;

    const orderRef = await addDoc(collection(db, "orders"), {
      customerName,
      customerPhone,
      customerAddress,
      shippingMethod,
      subtotal,
      shippingFee,
      discountAmount,
      grandTotal,
      createdAt: serverTimestamp(),
      createdBy: user?.name || "",
      role: user?.role || "",
      rank: user?.rank || ""
    });

    for (const item of cart) {
      await addDoc(collection(db, "order_items"), {
        orderId: orderRef.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty
      });
    }

    if (originalFn) {
      await originalFn();
    }
  };
};