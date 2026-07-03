import { useState } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import "../../styles/AddressTab.css";

const AddressTab = ({
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddClick = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSubmit = (data) => {
    if (editingAddress) {
      onEdit(editingAddress.id, data);
    } else {
      onAdd(data);
    }

    setShowForm(false);
    setEditingAddress(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <>
      <div className="address-header">
        <h2>My Addresses</h2>

        {!showForm && (
          <button
            className="add-address-btn"
            onClick={handleAddClick}
          >
            + Add New Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="address-form-wrapper">
          <AddressForm
            title={editingAddress ? "Edit Address" : "Add Address"}
            initialData={editingAddress || {}}
            onSubmit={handleSubmit}
          />

          <button
            className="cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="address-empty">
          <h3>No saved addresses</h3>
          <p>Add an address to make checkout faster.</p>
        </div>
      ) : (
        <div className="address-list">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEditClick}
              onDelete={onDelete}
              onSetDefault={onSetDefault}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AddressTab;