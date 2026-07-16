import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
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

    const newName = name.trim();
    const newEmail = email.trim();

    const { error: nameError } = await supabase
      .schema("marketplace_dataspace")
      .from("buyers")
      .update({ name: newName })
      .eq("id", user.id);

    let emailError = null;

    if (newEmail !== user.email) {
 const { data, error } = await supabase.auth.updateUser({
  email: newEmail,
});

console.log("Update User Data:", data);
console.log("Update User Error:", error);

emailError = error;
    }

    setLoading(false);

    if (nameError || emailError) {
      console.error("Name Error:", nameError);
      console.error("Email Error:", emailError);

      alert(
        nameError?.message ||
        emailError?.message ||
        "Failed to update profile."
      );

      return;
    }

    onProfileUpdated();
    setEditing(false);

    
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