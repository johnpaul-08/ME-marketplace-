import { ShoppingBag } from "lucide-react";
import OrderCard from "./OrderCard";

const OrdersTab = ({ orders, loadingOrders, user, reviewsMap, onReviewSubmit, onReviewSubmitted, }) => {
  return (
    <>
      <h2>My Orders</h2>

      {loadingOrders ? (
        <p className="orders-loading">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <ShoppingBag size={48} strokeWidth={1.2} />
          <h3>No orders yet</h3>
          <p>When you place an order, it will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              user={user}
              reviewsMap={reviewsMap}
              onReviewSubmit={onReviewSubmit}
              onReviewSubmitted={onReviewSubmitted}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default OrdersTab;