import { useEffect, useState } from "react";
import {
  Package,
  MapPin,
  Settings,
  LogOut,
  Heart,
} from "lucide-react";
import BackButton from "../components/BackButton";
import { supabase } from "../supabase";
import { useWishlist } from "../context/wishlistContext";
import OrdersTab from "../components/account/OrdersTab";
import WishlistTab from "../components/account/wishlistTab";
import AddressTab from "../components/account/AddressTab";
import "../styles/Account.css";

const AccountScreen = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const email = user?.email || "";

  const { wishlist, removeFromWishlist } = useWishlist();

      const fetchOrders = async () => {
      if (!email) return;
      setLoadingOrders(true);

      const { data, error } = await supabase
        .schema("marketplace_dataspace")
        .from("orders")
        .select("*")
        .eq("customer_email", email)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }

      setLoadingOrders(false);
    };

    const fetchAddresses = async () => {
       if (!email) return;
       setLoadingAddresses(true);

      // Fetch addresses
      const { data } = await supabase
        .schema("marketplace_dataspace")
        .from("buyer_addresses")
        .select("*")
        .eq("buyer_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      setAddresses(data || []);
      setLoadingAddresses(false);
      };

  useEffect(() => {
      fetchOrders();
      fetchAddresses();
  }, [user]);

const handleAddAddress = async (address) => {

  // If this address is marked as default,
  // remove default from all existing addresses first.
  if (address.is_default) {
    const { error: resetError } = await supabase
      .schema("marketplace_dataspace")
      .from("buyer_addresses")
      .update({ is_default: false })
      .eq("buyer_id", user.id);

    if (resetError) {
      console.error(resetError);
      return;
    }
  }

  const { error } = await supabase
    .schema("marketplace_dataspace")
    .from("buyer_addresses")
    .insert({
      ...address,
      buyer_id: user.id,
    });

  if (error) {
    console.error(error);
    return;
  }

  fetchAddresses();
};

const handleEditAddress = async (id, updatedAddress) => {

  if (updatedAddress.is_default) {
    const { error: resetError } = await supabase
      .schema("marketplace_dataspace")
      .from("buyer_addresses")
      .update({ is_default: false })
      .eq("buyer_id", user.id);

    if (resetError) {
      console.error(resetError);
      return;
    }
  }

  const { error } = await supabase
    .schema("marketplace_dataspace")
    .from("buyer_addresses")
    .update(updatedAddress)
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  fetchAddresses();
};

const handleDeleteAddress = async (id) => {
  const { error } = await supabase
    .schema("marketplace_dataspace")
    .from("buyer_addresses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

await fetchAddresses();
};

const handleSetDefaultAddress = async (address) => {
  // Remove existing default
  const{ error: resetError } = await supabase
    .schema("marketplace_dataspace")
    .from("buyer_addresses")
    .update({ is_default: false })
    .eq("buyer_id", user.id);

  if (resetError) {
  console.error(resetError);
  return;
}

  // Set selected address as default
  const { error } = await supabase
    .schema("marketplace_dataspace")
    .from("buyer_addresses")
    .update({ is_default: true })
    .eq("id", address.id);

  if (error) {
    console.error(error);
    return;
  }
await fetchAddresses();
};
  return (
    <div className="section account-page" style={{ paddingTop: "120px" }}>
      <div className="container">
        <BackButton />

        <div className="account-layout">
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="user-profile-header">
              <div className="avatar-placeholder">{avatarLetter}</div>

              <div>
                <h3>{displayName}</h3>
                <p>{email}</p>
              </div>
            </div>

            <nav className="account-nav">
              <button
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                <Package size={18} />
                My Orders
              </button>

              <button
                className={activeTab === "wishlist" ? "active" : ""}
                onClick={() => setActiveTab("wishlist")}
              >
                <Heart size={18}/>
                Wishlist
              </button>

              <button
                className={activeTab === "addresses" ? "active" : ""}
                onClick={() => setActiveTab("addresses")}
              >
                <MapPin size={18} />
                Addresses
              </button>

              <button>
                <Settings size={18} />
                Settings
              </button>

              <button className="logout-btn" onClick={onLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="account-content">

            {/* ================= ORDERS ================= */}

            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                loadingOrders={loadingOrders}
                user={user}
              />
            )}

            {/* ================= WISHLIST ================= */}

              {activeTab === "wishlist" && (
                <WishlistTab
                  wishlist={wishlist}
                  removeFromWishlist={removeFromWishlist}
                />
              )}
            
            {/* ================= ADDRESS ================= */}
              {activeTab === "addresses" && (
                <AddressTab
                  addresses={addresses}
                  loadingAddresses={loadingAddresses}
                  onAdd={handleAddAddress}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefaultAddress}
                />
              )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountScreen;