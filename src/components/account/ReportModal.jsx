import { useState, useRef } from "react";
import { X, AlertCircle, ImagePlus, Trash2, Loader } from "lucide-react";
import { supabase } from "../../supabase";
import "../../styles/ReportModal.css";

const ReportModal = ({ isOpen, onClose, order, item, user }) => {
  const [issueType, setIssueType] = useState("damaged");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // { file, previewUrl }
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }
    const newFiles = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setError(null);
    // Reset input so same file can be re-selected if removed
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async () => {
    const urls = [];
    for (const { file } of selectedFiles) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/reports/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("report-images")
        .upload(path, file, { upsert: false });

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage
        .from("report-images")
        .getPublicUrl(path);

      urls.push(publicUrlData.publicUrl);
    }
    return urls;
  };

  const resetForm = () => {
    setIssueType("damaged");
    setDescription("");
    selectedFiles.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
    setSelectedFiles([]);
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload images first
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        imageUrls = await uploadImages();
        setUploadingImages(false);
      }

      const itemSnapshot = {
        name: item.name || item.product_name,
        image: item.image_url || item.image,
        quantity: item.quantity,
        price: item.price,
      };

      const payload = {
        order_id: order.id,
        product_id: item.id || null,
        buyer_id: user.id,
        seller_id: item.seller_id || order.seller_id || "00000000-0000-0000-0000-000000000000",
        item_snapshot: itemSnapshot,
        issue_type: issueType,
        description: description,
        image_urls: imageUrls,
        status: "pending",
      };

      const { error: insertError } = await supabase
        .schema("marketplace_dataspace")
        .from("order_reports")
        .insert([payload]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      console.error("Report submit error:", err);
      setUploadingImages(false);
      setError(err.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const loadingLabel = uploadingImages
    ? "Uploading images..."
    : "Submitting...";

  return (
    <div className="report-modal-overlay">
      <div className="report-modal">
        <button className="close-btn" onClick={handleClose} disabled={loading}>
          <X size={20} />
        </button>

        <h2>Report Issue</h2>
        <p className="report-subtitle">
          Reporting issue for <strong>{item.name || item.product_name || "Product"}</strong>
        </p>

        {success ? (
          <div className="report-success">
            <AlertCircle size={40} className="success-icon" />
            <h3>Report Submitted</h3>
            <p>We have received your report and will look into it shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label>Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                required
              >
                <option value="damaged">Damaged Product</option>
                <option value="wrong_item">Wrong Item</option>
                <option value="missing_item">Missing Item</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail..."
                rows={4}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label>Attach Photos <span className="label-hint">(optional, max 5)</span></label>
              
              {selectedFiles.length < 5 && (
                <div
                  className="image-upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus size={24} />
                  <span>Click to add photos</span>
                  <span className="upload-hint">JPG, PNG, WEBP up to 5MB each</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="image-preview-grid">
                  {selectedFiles.map(({ previewUrl }, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={previewUrl} alt={`preview-${index}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveFile(index)}
                        disabled={loading}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <div className="report-error">{error}</div>}

            <div className="report-actions">
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
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Loader size={14} className="spin-icon" />
                    {loadingLabel}
                  </span>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
