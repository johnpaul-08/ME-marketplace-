import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import "../../styles/SettingsTab.css";

const SettingsTab = ({ user, buyer, onProfileUpdated }) => {

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(buyer?.name || "");


    useEffect(() => {
        setName(buyer?.name || "");
    }, [buyer]);

    // edit buyer profile
  
const handleSave = async () => {
  setLoading(true);

  const { error } = await supabase
    .schema("marketplace_dataspace")
    .from("buyers")
    .update({ name })
    .eq("id", user.id);

  setLoading(false);

  if (!error) {
    onProfileUpdated();
    setEditing(false);
  } else {
    console.error(error);
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
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="setting-actions">
                <button
                  onClick={() => {
                    setName(buyer?.name || "");
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>

              <button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        ) : (
          <p>{name}</p>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;