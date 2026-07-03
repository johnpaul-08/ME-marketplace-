import { MapPin, Phone, Home, Briefcase } from "lucide-react";
import "../../styles/AddressCard.css";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const getIcon = () => {
    switch (address.address_type) {
      case "Work":
        return <Briefcase size={16} />;
      case "Home":
      default:
        return <Home size={16} />;
    }
  };

  return (
    <div className="address-card">
      <div className="address-card-header">
        <div className="address-type">
          {getIcon()}
          <span>{address.address_type}</span>

          {address.is_default && (
            <span className="default-badge">
              Default
            </span>
          )}
        </div>
      </div>

      <div className="address-name">
        {address.full_name}
      </div>

      <div className="address-phone">
        <Phone size={15} />
        <span>{address.phone}</span>
      </div>

      <div className="address-location">
        <MapPin size={15} />

        <span>
          {address.address_line_1}

          {address.address_line_2 &&
            `, ${address.address_line_2}`}

          {address.landmark &&
            `, Near ${address.landmark}`}

          {`, ${address.city}, ${address.state} - ${address.postal_code}, ${address.country}`}
        </span>
      </div>

      <div className="address-actions">
        {!address.is_default && (
          <button
            className="secondary-btn"
            onClick={() => onSetDefault(address)}
          >
            Set Default
          </button>
        )}

        <button
          className="secondary-btn"
          onClick={() => onEdit(address)}
        >
          Edit
        </button>

        <button
          className="danger-btn"
          onClick={() => onDelete(address.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;