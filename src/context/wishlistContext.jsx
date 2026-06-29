import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

const WishlistContext= createContext();

export const WishlistProvider=({children})=>{
    const [wishlist, setWishlist] = useState([]);
    const [buyerId, setBuyerId] = useState(null);

    useEffect(()=>{
        if(buyerId){
            fetchWishlist();
        }
    }, [buyerId])

    async function loadBuyer() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            setBuyerId(user.id);
        }
    }

    useEffect(() => {
        loadBuyer();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setBuyerId(session?.user?.id ?? null);
            if (!session) {
                setWishlist([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function fetchWishlist(){
        const {data, error } = await supabase
        .schema("marketplace_dataspace")
        .from("wishlists")
        .select(`*, products(*)`)
        .eq('buyer_id', buyerId);

        if(error){
            console.error(error);
            return;
        }

        setWishlist(data);
    }

    async function addToWishlist(productId) {
        if(!buyerId || isWishlisted(productId)) return;
        const { error } = await supabase
        .schema("marketplace_dataspace")
        .from("wishlists")
        .insert({
            buyer_id: buyerId,
            product_id: productId,
        });

        if (error) {
        console.error(error);
        return;
        }

        await fetchWishlist();
    }

    async function removeFromWishlist(productId){
        if (!buyerId || !isWishlisted(productId)) return;
        const { error} = await supabase
            .schema("marketplace_dataspace")
            .from("wishlists")
            .delete()
            .eq("buyer_id", buyerId)
            .eq("product_id", productId);

        if(error){
            console.error(error);
            return;
        }
        await fetchWishlist();
    }

    function isWishlisted(productId){
        return wishlist.some(item=>item.product_id ===productId);
    }

    async function toggleWishlist(productId){
        if(isWishlisted(productId)){
            await removeFromWishlist(productId);
        }else{
            await addToWishlist(productId);
        }
    }
    
    return(
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isWishlisted,
                fetchWishlist,
            }}
        >{children}
        </WishlistContext.Provider>
    );

};

export const useWishlist=()=>useContext(WishlistContext);