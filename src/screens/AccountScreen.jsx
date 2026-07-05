import React, { useEffect, useState } from "react";
import {
  Package,
  MapPin,
  Settings,
  LogOut,
  Heart,
  ShoppingBag,
  CreditCard,
  Truck,
} from "lucide-react";
import BackButton from "../components/BackButton";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabase";
import { useWishlist } from "../context/wishlistContext";
import "../styles/Account.css";

const AccountScreen = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const avatarLetter = displayName.charAt(0).toUpperCase();
  const email = user?.email || "";

  const { wishlist, removeFromWishlist } = useWishlist();

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

      if (!error && data) {
        setOrders(data);
      }

      setLoadingOrders(false);
    };

    fetchOrders();
  }, [email]);

  const getStatusBadge = (status) => {
    if (!status) return null;

    const s = status.toLowerCase();

    let cls = "status ";

    if (s === "delivered") cls += "delivered";
    else if (s === "shipped") cls += "shipped";
    else cls += "processing";

    return <span className={cls}>{status}</span>;
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
                <Heart size={18} />
                Wishlist
              </button>

              <button>
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
              <>
                <h2>My Orders</h2>

                {loadingOrders ? (
                  <p className="orders-loading">Loading your orders...</p>
                ) : orders.length === 0 ? (
                  <div className="orders-empty">
                    <ShoppingBag size={48} strokeWidth={1.2} />
                    <h3>No orders yet</h3>
                    <p>When you place an order, it will appear here.</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => {
                      const items = Array.isArray(order.items)
                        ? order.items
                        : [];

                      const shortId = order.id
                        ?.toString()
                        .slice(-8)
                        .toUpperCase();

                      return (
                        <div className="order-item" key={order.id}>
                          {/* Header */}

                          <div className="order-header">
                            <div className="order-header-left">
                              <span className="order-id">
                                Order #{shortId}
                              </span>

                              <span className="order-date">
                                {order.created_at &&
                                  new Date(
                                    order.created_at
                                  ).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                              </span>
                            </div>

                            <div className="order-header-right">
                              {getStatusBadge(order.fulfillment_status)}
                              {getStatusBadge(order.payment_status)}
                            </div>
                          </div>

                          {/* Products */}

                          {items.length > 0 ? (
                            <div className="order-items-list">
                              {items.map((item, index) => (
                                <div className="order-body" key={index}>
                                  <div className="order-img">
                                    {(item.image_url || item.image) && (
                                      <img
                                        src={item.image_url || item.image}
                                        alt={
                                          item.name ||
                                          item.product_name
                                        }
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                        }}
                                      />
                                    )}
                                  </div>

                                  <div className="order-info">
                                    <h4>
                                      {item.name ||
                                        item.product_name ||
                                        "Product"}
                                    </h4>

                                    <p>Qty: {item.quantity || 1}</p>

                                    <p className="price">
                                      ₹{item.price ?? "--"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p
                              style={{
                                color: "var(--text-secondary)",
                                margin: "12px 0",
                              }}
                            >
                              No item details available.
                            </p>
                          )}

                          {/* Footer */}

                          <div className="order-footer">
                            <div className="order-footer-info">
                              {order.payment_method && (
                                <span className="footer-tag">
                                  <CreditCard size={14} />
                                  {order.payment_method}
                                </span>
                              )}

                              {order.tracking_number && (
                                <span className="footer-tag">
                                  <Truck size={14} />
                                  {order.courier_partner
                                    ? `${order.courier_partner}: `
                                    : ""}
                                  {order.tracking_number}
                                </span>
                              )}
                            </div>

                            <div className="order-total">
                              Total:
                              <strong>
                                ₹{order.total_amount ?? "--"}
                              </strong>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ================= WISHLIST ================= */}

            {activeTab === "wishlist" && (
              <>
                <h2>My Wishlist</h2>

                {wishlist.length === 0 ? (
                  <div className="orders-empty">
                    <ShoppingBag size={48} strokeWidth={1.2} />
                    <h3>Your wishlist is empty</h3>
                    <p>Add products you love to your wishlist.</p>
                  </div>
                ) : (
                  <div className="wishlist-grid">
                    {wishlist.map((item) => (
                      <ProductCard
                        key={item.products.id}
                        product={item.products}
                        showRemoveButton={true}
                        onRemove={removeFromWishlist}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountScreen;