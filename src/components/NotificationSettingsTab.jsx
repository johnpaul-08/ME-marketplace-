import { useState } from 'react';
import {
  Bell,
  BellOff,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  CreditCard,
  Star,
  Tag,
  Save,
  Loader,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import '../styles/NotificationSettings.css';

/* ============================================================
   Notification setting groups & rows configuration
   ============================================================ */

const ORDER_STATUSES = [
  {
    key: 'notif_order_booked',
    label: 'Order Booked',
    description: 'When your order is successfully placed & payment is received.',
    color: '#ff7612',
    dot: '#ff7612',
    icon: Package,
    sampleTitle: 'Order Booked! 🎉',
    sampleMsg: 'Your order #MKT2891 has been successfully placed.',
  },
  {
    key: 'notif_order_confirmed',
    label: 'Order Confirmed',
    description: 'When the seller confirms and accepts your order.',
    color: '#1e90ff',
    dot: '#1e90ff',
    icon: CheckCircle,
    sampleTitle: 'Order Confirmed ✅',
    sampleMsg: 'Great news! Your order #MKT2891 is confirmed by the seller.',
  },
  {
    key: 'notif_order_shipped',
    label: 'Order Shipped',
    description: 'When your package is dispatched and on the way.',
    color: '#7c3aed',
    dot: '#7c3aed',
    icon: Truck,
    sampleTitle: 'Order Shipped 🚚',
    sampleMsg: 'Your order is on its way! Track it with DTDC: 432981XY.',
  },
  {
    key: 'notif_order_delivered',
    label: 'Order Delivered',
    description: 'When your package is delivered to your address.',
    color: '#2ed573',
    dot: '#2ed573',
    icon: CheckCircle,
    sampleTitle: 'Delivered! 📦',
    sampleMsg: 'Your order #MKT2891 has been delivered. Enjoy!',
  },
  {
    key: 'notif_order_cancelled',
    label: 'Order Cancelled',
    description: 'When an order is cancelled by you or the seller.',
    color: '#ff4757',
    dot: '#ff4757',
    icon: XCircle,
    sampleTitle: 'Order Cancelled ❌',
    sampleMsg: 'Order #MKT2891 has been cancelled. Refund will be initiated.',
  },
  {
    key: 'notif_order_returned',
    label: 'Return / Refund',
    description: 'Status updates on return requests and refund processing.',
    color: '#ffa502',
    dot: '#ffa502',
    icon: RefreshCw,
    sampleTitle: 'Refund Initiated 💰',
    sampleMsg: 'Your refund of ₹499 for order #MKT2891 is being processed.',
  },
];

const PAYMENT_ALERTS = [
  {
    key: 'notif_payment_success',
    label: 'Payment Successful',
    description: 'Confirmation when a payment goes through successfully.',
    color: '#2ed573',
    dot: '#2ed573',
    icon: CreditCard,
    sampleTitle: 'Payment Received ✅',
    sampleMsg: '₹1,299 paid via UPI for order #MKT2891.',
  },
  {
    key: 'notif_payment_failed',
    label: 'Payment Failed',
    description: 'Alert when a payment fails so you can retry.',
    color: '#ff4757',
    dot: '#ff4757',
    icon: CreditCard,
    sampleTitle: 'Payment Failed ⚠️',
    sampleMsg: 'Your payment for order #MKT2893 could not be processed.',
  },
];

const PROMO_ALERTS = [
  {
    key: 'notif_deals',
    label: 'Deals & Offers',
    description: 'Flash sales, exclusive discounts and limited-time offers.',
    color: '#ff7612',
    dot: '#ff7612',
    icon: Tag,
    sampleTitle: '🔥 Flash Sale — 40% Off!',
    sampleMsg: 'Today only: All electronics up to 40% off. Shop now!',
  },
  {
    key: 'notif_reviews',
    label: 'Review Reminders',
    description: 'Prompts to rate and review your delivered products.',
    color: '#f59e0b',
    dot: '#f59e0b',
    icon: Star,
    sampleTitle: 'Share Your Feedback ⭐',
    sampleMsg: 'How was your experience with "Silk Scarf"? Leave a review.',
  },
];

/* ============================================================
   Default settings (localStorage key: me_notif_settings)
   ============================================================ */

const DEFAULT_SETTINGS = {
  master_enabled: true,
  notif_order_booked:    true,
  notif_order_confirmed: true,
  notif_order_shipped:   true,
  notif_order_delivered: true,
  notif_order_cancelled: true,
  notif_order_returned:  false,
  notif_payment_success: true,
  notif_payment_failed:  true,
  notif_deals:           false,
  notif_reviews:         false,
};

const STORAGE_KEY = 'me_notif_settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (_) {}
  return DEFAULT_SETTINGS;
}

/* ============================================================
   ToggleSwitch Component
   ============================================================ */
const ToggleSwitch = ({ checked, onChange, id, disabled }) => (
  <label className="toggle-switch" htmlFor={id} aria-label="Toggle">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <span className="toggle-slider" />
  </label>
);

/* ============================================================
   NotifRow Component
   ============================================================ */
const NotifRow = ({ item, value, onChange, masterEnabled }) => {
  const Icon = item.icon;
  return (
    <div className={`notif-row${!masterEnabled ? ' disabled' : ''}`}>
      <div className="notif-row-left">
        <span
          className="notif-status-dot"
          style={{ background: item.dot }}
          title={item.label}
        />
        <div className="notif-row-text">
          <h5>{item.label}</h5>
          <p>{item.description}</p>
        </div>
      </div>
      <ToggleSwitch
        id={`toggle-${item.key}`}
        checked={value}
        onChange={(e) => onChange(item.key, e.target.checked)}
        disabled={!masterEnabled}
      />
    </div>
  );
};

/* ============================================================
   SampleNotification preview
   ============================================================ */
const SampleNotification = ({ item }) => {
  const Icon = item.icon;
  return (
    <div className="notif-sample">
      <div
        className="notif-sample-icon"
        style={{ background: `${item.color}22`, color: item.color }}
      >
        <Icon size={18} />
      </div>
      <div className="notif-sample-body">
        <strong>{item.sampleTitle}</strong>
        <p>{item.sampleMsg}</p>
        <time>Just now · ME Marketplace</time>
      </div>
    </div>
  );
};

/* ============================================================
   NotificationSettingsTab — Main exported component
   ============================================================ */
const NotificationSettingsTab = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const { showToast } = useToast();

  // Track un-saved changes
  const handleToggle = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleMaster = (e) => {
    setSettings((prev) => ({ ...prev, master_enabled: e.target.checked }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate async save (e.g. to Supabase profile metadata)
    await new Promise((r) => setTimeout(r, 900));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaving(false);
    setDirty(false);

    showToast({
      title: 'Preferences saved!',
      message: 'Your notification settings have been updated.',
      type: 'success',
      duration: 3500,
    });
  };

  /* Demo: fire a sample toast for the first enabled order status */
  const handlePreviewToast = (item) => {
    showToast({
      title: item.sampleTitle,
      message: item.sampleMsg,
      type: 'order',
      duration: 5000,
    });
  };

  const master = settings.master_enabled;

  return (
    <div className="notif-settings">
      <h2>Notification Settings</h2>
      <p className="page-desc">
        Choose which updates you want to receive about your orders,
        payments, and promotions.
      </p>

      {/* Master Toggle Banner */}
      <div className="notif-master-banner">
        <div className="banner-left">
          <div className="banner-icon">
            {master ? <Bell size={22} /> : <BellOff size={22} />}
          </div>
          <div>
            <h3>All Notifications</h3>
            <p>
              {master
                ? 'Notifications are active'
                : 'All notifications are muted'}
            </p>
          </div>
        </div>
        <ToggleSwitch
          id="toggle-master"
          checked={master}
          onChange={handleMaster}
        />
      </div>

      {/* ── Order Status ────────────────────────────── */}
      <div className="notif-section">
        <div className="notif-section-header">
          <div className="section-icon">
            <Package size={18} />
          </div>
          <div>
            <h4>Order Status Updates</h4>
            <p>Real-time updates on your order journey</p>
          </div>
        </div>

        {ORDER_STATUSES.map((item) => (
          <NotifRow
            key={item.key}
            item={item}
            value={settings[item.key]}
            onChange={handleToggle}
            masterEnabled={master}
          />
        ))}

        {/* Live preview of a sample notification */}
        <div className="notif-preview-row">
          <p>Sample Notification Preview</p>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              handlePreviewToast(
                ORDER_STATUSES.find((s) => settings[s.key]) ||
                  ORDER_STATUSES[0]
              )
            }
            title="Click to preview a toast notification"
          >
            <SampleNotification
              item={ORDER_STATUSES.find((s) => settings[s.key]) || ORDER_STATUSES[0]}
            />
          </div>
        </div>
      </div>

      {/* ── Payment Alerts ──────────────────────────── */}
      <div className="notif-section">
        <div className="notif-section-header">
          <div className="section-icon">
            <CreditCard size={18} />
          </div>
          <div>
            <h4>Payment Alerts</h4>
            <p>Confirmations and failures for your transactions</p>
          </div>
        </div>

        {PAYMENT_ALERTS.map((item) => (
          <NotifRow
            key={item.key}
            item={item}
            value={settings[item.key]}
            onChange={handleToggle}
            masterEnabled={master}
          />
        ))}
      </div>

      {/* ── Promotions ──────────────────────────────── */}
      <div className="notif-section">
        <div className="notif-section-header">
          <div className="section-icon">
            <Tag size={18} />
          </div>
          <div>
            <h4>Promotions & Reminders</h4>
            <p>Deals, flash sales and product review nudges</p>
          </div>
        </div>

        {PROMO_ALERTS.map((item) => (
          <NotifRow
            key={item.key}
            item={item}
            value={settings[item.key]}
            onChange={handleToggle}
            masterEnabled={master}
          />
        ))}
      </div>

      {/* Save Button */}
      <button
        className="notif-save-btn"
        onClick={handleSave}
        disabled={saving || !dirty}
        id="save-notification-settings-btn"
      >
        {saving ? (
          <>
            <Loader size={18} className="spin" />
            Saving…
          </>
        ) : (
          <>
            <Save size={18} />
            {dirty ? 'Save Changes' : 'Saved'}
          </>
        )}
      </button>
    </div>
  );
};

export default NotificationSettingsTab;
