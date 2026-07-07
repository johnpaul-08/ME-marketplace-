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

  // ── Data fetching ────────────────────────────────────────────────────────────

  const fetchAddresses = async () => {
    if (!user?.id) return;
    setLoadingAddresses(true);
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
    if (!email) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .schema("marketplace_dataspace")
        .from("orders")
        .select("*")
        .eq("customer_email", email)
        .order("created_at", { ascending: false });

      if (error || !data) {
        setLoadingOrders(false);
        return;
      }

      // Collect all product IDs from order items to fetch their images
      const productIds = new Set();
      data.forEach((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        items.forEach((item) => {
          if (item.id) productIds.add(item.id);
        });
      });

      // Batch-fetch product images
      let productImageMap = {};
      if (productIds.size > 0) {
        const { data: products } = await supabase
          .schema("marketplace_dataspace")
          .from("products")
          .select("id, images")
          .in("id", [...productIds]);

        if (products) {
          products.forEach((p) => {
            productImageMap[p.id] = p.images?.[0] || null;
          });
        }
      }

      // Merge images into order items
      const enrichedOrders = data.map((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        return {
          ...order,
          items: items.map((item) => ({
            ...item,
            image_url:
              item.image_url || item.image || productImageMap[item.id] || null,
          })),
        };
      });

      setOrders(enrichedOrders);
      setLoadingOrders(false);
    };

    fetchOrders();
    fetchAddresses();
  }, [user]);

  // ── Address handlers ─────────────────────────────────────────────────────────

  const handleAddAddress = async (address) => {
    if (address.is_default) {
      const { error: resetError } = await supabase
        .schema("marketplace_dataspace")
        .from("buyer_addresses")
        .update({ is_default: false })
        .eq("buyer_id", user.id);
      if (resetError) { console.error(resetError); return; }
    }

    const { error } = await supabase
      .schema("marketplace_dataspace")
      .from("buyer_addresses")
      .insert({ ...address, buyer_id: user.id });
    if (error) { console.error(error); return; }

    fetchAddresses();
  };

  const handleEditAddress = async (id, updatedAddress) => {
    if (updatedAddress.is_default) {
      const { error: resetError } = await supabase
        .schema("marketplace_dataspace")
        .from("buyer_addresses")
        .update({ is_default: false })
        .eq("buyer_id", user.id);
      if (resetError) { console.error(resetError); return; }
    }

    const { error } = await supabase
      .schema("marketplace_dataspace")
      .from("buyer_addresses")
      .update(updatedAddress)
      .eq("id", id);
    if (error) { console.error(error); return; }

    fetchAddresses();
  };

  const handleDeleteAddress = async (id) => {
    const { error } = await supabase
      .schema("marketplace_dataspace")
      .from("buyer_addresses")
      .delete()
      .eq("id", id);
    if (error) { console.error(error); return; }

    fetchAddresses();
  };

  const handleSetDefaultAddress = async (address) => {
    const { error: resetError } = await supabase
      .schema("marketplace_dataspace")
      .from("buyer_addresses")
      .update({ is_default: false })
      .eq("buyer_id", user.id);
    if (resetError) { console.error(resetError); return; }

    const { error } = await supabase
      .schema("marketplace_dataspace")
      .from("buyer_addresses")
      .update({ is_default: true })
      .eq("id", address.id);
    if (error) { console.error(error); return; }

    fetchAddresses();
  };

  // ── Render ───────────────────────────────────────────────────────────────────

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
                <Heart size={18} />
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

            {/* ORDERS */}
            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                loadingOrders={loadingOrders}
                user={user}
              />
            )}

            {/* WISHLIST */}
            {activeTab === "wishlist" && (
              <WishlistTab
                wishlist={wishlist}
                removeFromWishlist={removeFromWishlist}
              />
            )}

            {/* ADDRESSES */}
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