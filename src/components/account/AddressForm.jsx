import { useState } from "react";
import "../../styles/AddressForm.css";

const AddressForm = ({ onSubmit, initialData = {}, title = "Add Address" }) => {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || "",
    phone: initialData.phone || "",
    address_line_1: initialData.address_line_1 || "",
    address_line_2: initialData.address_line_2 || "",
    landmark: initialData.landmark || "",
    city: initialData.city || "",
    state: initialData.state || "",
    postal_code: initialData.postal_code || "",
    country: initialData.country || "India",
    address_type: initialData.address_type || "Home",
    is_default: initialData.is_default || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Address Line 1</label>
        <textarea
          name="address_line_1"
          value={formData.address_line_1}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label>Address Line 2 (Optional)</label>
        <input
          type="text"
          name="address_line_2"
          value={formData.address_line_2}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Landmark</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>PIN Code</label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Address Type</label>

        <select
          name="address_type"
          value={formData.address_type}
          onChange={handleChange}
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <label className="checkbox-group">
        <input
          type="checkbox"
          name="is_default"
          checked={formData.is_default}
          onChange={handleChange}
        />

        <span>Set as default address</span>
      </label>

      <button type="submit" className="save-address-btn">
        Save Address
      </button>
    </form>
  );
};

export default AddressForm;