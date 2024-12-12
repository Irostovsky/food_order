import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "./store/CartContext";
import UserProgressContext from "./store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHTTP";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);
  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());
    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully!</p>
        <p className="modal-actions">
          <Button type="button" textOnly onClick={handleFinish}>
            Okay
          </Button>
        </p>
      </Modal>
    );
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Order is submitting...</span>;
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="Email" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
