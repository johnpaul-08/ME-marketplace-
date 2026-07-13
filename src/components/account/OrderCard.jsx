import { useState, useEffect } from "react";
import { CreditCard, Truck, AlertOctagon } from "lucide-react";
import ReportModal from "./ReportModal";
import ReviewModal from "./ReviewModal";

const OrderCard = ({ order, user, reviewsMap, onReviewSubmitted }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedItemToReport, setSelectedItemToReport] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedItemToReview, setSelectedItemToReview] = useState(null);

const handleReviewClick = (item) => {
  setSelectedItemToReview(item);
  setReviewModalOpen(true);
};

  const handleReportClick = (item) => {
    setSelectedItemToReport(item);
    setReportModalOpen(true);
  };

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
          {/* {getStatusBadge(order.payment_status)} */}
        </div>
      </div>

    {/* Products */}
    {items.length > 0 ? (
      <div className="order-items-list">
        {items.map((item, index) => {
          const alreadyReviewed =
            reviewsMap?.[`${order.id}-${item.id}`] ?? false;

          return (
            <div className="order-body" key={index}>
              <div className="order-img">
                {(item.image_url || item.image || item.images?.[0]) && (
                  <img
                    src={item.image_url || item.image || item.images?.[0]}
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

                {order.fulfillment_status?.toLowerCase() === "delivered" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    {alreadyReviewed ? (
                      <button
                        className="reviewed-btn"
                        disabled
                      >
                        ✓ Reviewed
                      </button>
                    ) : (
                      <button
                        className="review-btn"
                        onClick={() => handleReviewClick(item)}
                      >
                        ⭐ Rate & Review
                      </button>
                    )}

                    <button
                      className="report-issue-btn"
                      onClick={() => handleReportClick(item)}
                    >
                      <AlertOctagon size={14} />
                      Report Issue
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

      {selectedItemToReport && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          order={order}
          item={selectedItemToReport}
          user={user}
        />
      )}
      {selectedItemToReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          order={order}
          item={selectedItemToReview}
          user={user}
          onReviewSubmitted={() =>
            onReviewSubmitted(order.id, selectedItemToReview.id)
          }
        />
      )}
    </div>
  );
};

export default OrderCard;