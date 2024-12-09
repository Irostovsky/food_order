import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "./store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import UserProgressContext from "./store/UserProgressContext";
import CartItem from "./CartItem";

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Modal className="cart" open={userProgressCtx.progress === "cart"}>
      <h2>Your Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={() => cartCtx.addItem(item)}
            onDecrease={() => cartCtx.removeItem(item.id)}
          />
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={userProgressCtx.hideCart}>
          Close
        </Button>
        {cartTotal > 0 && (
          <Button onClick={() => userProgressCtx.showCheckout()}>
            Go to Checkout
          </Button>
        )}
      </p>
    </Modal>
  );
}
