import { X, MapPin, Phone, Check } from "lucide-react";
import { useState } from "react";
import "../../styles/AddressDrawer.css";
import AddressForm from "../account/AddressForm";

const AddressDrawer = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelect,
  onAddAddress,
}) => {
  if (!isOpen) return null;

  const [showForm, setShowForm] = useState(false);
  const handleSubmit = async (data) => {
    await onAddAddress(data);
    setShowForm(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-overlay" onClick={onClose}></div>

      {/* Drawer */}
      <div className="address-drawer">
        <div className="drawer-header">
          <h2>Select Delivery Address</h2>

          <button
            className="drawer-close-btn"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
          <div className="drawer-body">
              {showForm ? (
                <AddressForm
                  title="Add Address"
                  onSubmit={handleSubmit}
                />
              ) : (
                <>
                  {addresses.length === 0 ? (
                    <div className="drawer-empty">
                      <MapPin size={42} />
                      <p>No saved addresses.</p>
                    </div>
                  ) : (
                    addresses.map((address) => {
                      const selected = selectedAddress?.id === address.id;

                      return (
                        <div
                          key={address.id}
                          className={`drawer-address-card ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() => onSelect(address)}
                        >
                          <div className="drawer-card-top">
                            <div className="drawer-name">
                              {address.name}
                            </div>

                            {address.is_default && (
                              <span className="default-badge">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="drawer-phone">
                            <Phone size={15} />
                            <span>{address.phone}</span>
                          </div>

                          <div className="drawer-location">
                            <MapPin size={15} />
                            <span>
                              {address.address_line_1}
                              {address.address_line_2 &&
                                `, ${address.address_line_2}`}
                              {address.landmark &&
                                `, Near ${address.landmark}`}
                              {`, ${address.city}, ${address.state} - ${address.postal_code}`}
                            </span>
                          </div>

                          {selected && (
                            <div className="selected-indicator">
                              <Check size={18} />
                              <span>Deliver Here</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>

        <div className="drawer-footer">
          <button
            className="drawer-done-btn"
            onClick={() => setShowForm(true)}
          >
            + Add New Address
          </button>
        </div>
      </div>
    </>
  );
};

export default AddressDrawer;