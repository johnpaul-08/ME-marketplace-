import { ShoppingBag } from "lucide-react";
import ProductCard from "../ProductCard";

const WishlistTab = ({ wishlist, removeFromWishlist }) => {
  return (
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
  );
};

export default WishlistTab;