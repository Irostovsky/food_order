import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "./store/CartContext";
import UserProgressContext from "./store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Modal open={userProgressCtx.progress === "checkout"}>
      <form action="">
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
      </form>
    </Modal>
  );
}
