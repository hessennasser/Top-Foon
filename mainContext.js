"use client"
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { mainRequest } from "./axiosConfig";
import { apiUrl } from "./apiUrl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const MainContext = createContext();

function MainContextProvider({ children }) {
    const router = useRouter();

    // Manage user
    const [user, setUser] = useState({});
    const [cart, setCart] = useState([]);
    const [loadingCart, setLoadingCart] = useState(false);

    // Logout
    const logout = async () => {
        try {
            await mainRequest.get(`${apiUrl}/logout`);
            localStorage.removeItem('userRegistration');
            setUser({});
            setCart([]); // Clear cart on logout
            router.push("/login");
            toast.success("تم تسجيل الخروج بنجاح");
        } catch (error) {
            console.log(error);
        }
    };

    // Get website settings data
    const [settings, setSettings] = useState();
    const getSettings = async () => {
        try {
            const response = await axios.get(`${apiUrl}/settings`);
            setSettings(response.data?.websiteSettings);
        } catch (error) {
            console.log(error);
        }
    };

    // Manage Cart
    const addToCart = async (item) => {
        // Check if the product has metadata
        if (user.logged) {
            await addToCartApi(item, item.colors[0], item.storages[0]); // Pass defaultMetadata to addToCartApi
            console.log(item);
            await getUserCart();
        } else {
            toast.info("Please log in to add items to your cart.");
            router.push("/login");
        }
    };

    const removeFromCart = async (productId) => {
        if (user.logged) {
            await removeFromCartApi(productId);
            await getUserCart()
        } else {
            toast.info("Please log in to remove items from your cart.");
            router.push("/login");
        }
    };

    const updateCartItemQuantity = async (productId, quantity) => {
        console.log(productId, quantity);
        if (user.logged) {
            await updateCartItemQuantityApi(productId, quantity);
            await getUserCart()
        } else {
            toast.info("Please log in to update items in your cart.");
            router.push("/login");
        }
    };

    const calculateTotalPrice = () => {
        return cart?.reduce((total, item) => {
            return total + (item.totalForItem)
        }, 0);
    };

    const getUserCart = async () => {
        setLoadingCart(true);
        try {
            // Fetch user's cart from the backend
            const response = await mainRequest.get(`${apiUrl}/user-cart`);
            const userCart = response.data.cart?.items;
            setCart(userCart);
        } catch (error) {
            console.error("Error syncing cart data with the backend:", error);
        } finally {
            setLoadingCart(false);
        }
    }

    useEffect(() => {
        getSettings();

        if (localStorage.getItem("userRegistration")) {
            setUser(JSON.parse(localStorage.getItem("userRegistration")));
        }

        if (user?.logged) {
            getUserCart();
        }

    }, [user?.logged]);

    // API cart management functions
    const addToCartApi = async (item, color, storage) => {
        setLoadingCart(true);
        try {
            // Extract necessary properties from the item
            const { _id: productId } = item;
            console.log(color, storage);
            // Send request to add item to cart with product ID, quantity, and metadata
            const response = await mainRequest.post(`${apiUrl}/add-to-cart`, { productId, quantity: 1, color, storage });

            // Update cart state with the updated cart items from the response
            const updatedCart = response.data.cart.items;
            setCart(updatedCart);
        } catch (error) {
            console.error("Error adding item to cart:", error);
        } finally {
            setLoadingCart(false);
        }
    };

    const removeFromCartApi = async (productId) => {
        setLoadingCart(true)
        try {
            const response = await mainRequest.delete(`${apiUrl}/remove-from-cart/${productId}`);
            const updatedCart = response.data.cart.items;
            setCart(updatedCart);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        } finally {
            setLoadingCart(false)
        }
    };

    const updateCartItemQuantityApi = async (productId, quantity) => {
        setLoadingCart(true)
        try {
            const response = await mainRequest.put(`${apiUrl}/update-cart-item/${productId}`, { productId, quantity });
            const updatedCart = response.data.cart.items;
            setCart(updatedCart);
        } catch (error) {
            console.error("Error updating cart item quantity:", error);
        } finally {
            setLoadingCart(false)
        }
    };

    const updateCartItemMetaData = async (productId, metaData) => {
        const { color, storage } = metaData;
        setLoadingCart(true);
        try {
            // Send request to update item's metadata in the cart
            const response = await mainRequest.put(`${apiUrl}/update-cart-item-metaData/${productId}`, { productId, color, storage });
            // Update cart state with the updated cart items from the response
            const updatedCart = response.data.cart.items;
            await getUserCart();
        } catch (error) {
            console.error("Error updating cart item metadata:", error);
        } finally {
            setLoadingCart(false);
        }
    };


    return (
        <MainContext.Provider
            value={{
                user: user,
                setUser: setUser,
                logout: logout,
                settings: settings,
                cart: cart,
                setCart: setCart,
                addToCart: addToCart,
                removeFromCart: removeFromCart,
                updateCartItemQuantity: updateCartItemQuantity,
                updateCartItemMetaData: updateCartItemMetaData,
                calculateTotalPrice: calculateTotalPrice,
                loadingCart: loadingCart,
            }}>
            {children}
        </MainContext.Provider>
    );
}

export default MainContextProvider;
