import { useState } from "react";
import { X, Star, Loader } from "lucide-react";
import "../../styles/ReviewModal.css";

const ReviewModal = ({ isOpen, onClose, order, item, user, onReviewSubmit, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setSuccess(false);
    setError("");
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write your review.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onReviewSubmit({
        orderId: order.id,
        productId: item.id,
        buyerId: user.id,
        rating,
        comment: comment.trim(),
      });

      setSuccess(true);

      // Update reviewsMap in AccountScreen
      onReviewSubmitted?.();

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button
          className="close-btn"
          onClick={handleClose}
          disabled={loading}
        >
          <X size={20} />
        </button>

        <h2>Rate & Review</h2>

        <p className="review-subtitle">
          Reviewing <strong>{item.name || item.product_name}</strong>
        </p>

        {success ? (
          <div className="review-success">
            <h3>Thank You!</h3>
            <p>Your review has been submitted successfully.</p>
          </div>
        ) : (
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="rating-section">
              <label>Your Rating</label>

              <div className="star-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={36}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    fill={(hoverRating || rating) >= star ? "#facc15" : "none"}
                    color="#facc15"
                    style={{
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review</label>

              <textarea
                rows={5}
                placeholder="Tell others about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {error && (
              <div className="review-error">
                {error}
              </div>
            )}

            <div className="review-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={16} className="spin-icon" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;