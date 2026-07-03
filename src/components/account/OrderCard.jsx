import { CreditCard, Truck } from "lucide-react";

const OrderCard = ({ order }) => {
  const getStatusBadge = (status) => {
    if (!status) return null;

    const s = status.toLowerCase();

    let cls = "status ";

    if (s === "delivered") cls += "delivered";
    else if (s === "shipped") cls += "shipped";
    else cls += "processing";

    return <span className={cls}>{status}</span>;
  };

  const items = Array.isArray(order.items) ? order.items : [];

  const shortId = order.id?.toString().slice(-8).toUpperCase();

  return (
    <div className="order-item">
      {/* Header */}
      <div className="order-header">
        <div className="order-header-left">
          <span className="order-id">Order #{shortId}</span>

          <span className="order-date">
            {order.created_at &&
              new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
          </span>
        </div>

        <div className="order-header-right">
          {getStatusBadge(order.fulfillment_status)}
          {getStatusBadge(order.payment_status)}
        </div>
      </div>

      {/* Products */}
      {items.length > 0 ? (
        <div className="order-items-list">
          {items.map((item, index) => (
            <div className="order-body" key={index}>
              <div className="order-img">
                {(item.image_url || item.image) && (
                  <img
                    src={item.image_url || item.image}
                    alt={item.name || item.product_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>

              <div className="order-info">
                <h4>{item.name || item.product_name || "Product"}</h4>

                <p>Qty: {item.quantity || 1}</p>

                <p className="price">₹{item.price ?? "--"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            color: "var(--text-secondary)",
            margin: "12px 0",
          }}
        >
          No item details available.
        </p>
      )}

      {/* Footer */}
      <div className="order-footer">
        <div className="order-footer-info">
          {order.payment_method && (
            <span className="footer-tag">
              <CreditCard size={14} />
              {order.payment_method}
            </span>
          )}

          {order.tracking_number && (
            <span className="footer-tag">
              <Truck size={14} />
              {order.courier_partner
                ? `${order.courier_partner}: `
                : ""}
              {order.tracking_number}
            </span>
          )}
        </div>

        <div className="order-total">
          Total: <strong>₹{order.total_amount ?? "--"}</strong>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;