import { useState, useEffect } from "react";
import "../../styles/SettingsTab.css";

const SettingsTab = ({ user, buyer, onProfileUpdated }) => {

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(buyer?.name || "");
  const [email, setEmail] = useState(user?.email || "");


    useEffect(() => {
      setName(buyer?.name || "");
      setEmail(user?.email || "");
    }, [buyer, user]);

    // edit buyer profile
  
  const handleSave = async () => {
    setLoading(true);

    try {
      await onProfileUpdate({
        name,
        email,
      });

      await onProfileUpdated();

      setEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);

      alert(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="settings-tab">
      <h2>Settings</h2>

      <div className="setting-card">
        <div className="setting-header">
          <h3>Personal Information</h3>

          {!editing && (
            <button onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>

        <label>Full Name</label>

        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <p>{name}</p>
        )}

        <label>Email</label>

        {editing ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <p>{user?.email}</p>
        )}
      </div>
      {editing && (
        <div className="setting-actions">
          <button
            onClick={() => {
              setName(buyer?.name || "");
              setEmail(user?.email || "");
              setEditing(false);
            }}
          >
            Cancel
          </button>

          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;