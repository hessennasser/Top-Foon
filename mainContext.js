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
    const [loading, setLoading] = useState(false);

    // Manage user
    const [user, setUser] = useState({});
    const [cart, setCart] = useState([]);
    const [loadingCart, setLoadingCart] = useState(false);

    const getUserInfo = async () => {
        setLoading(true);
        try {
            // Fetch user's info from the backend
            const response = await mainRequest.get(`${apiUrl}/me`);
            const userInfo = response.data.user;

            // Get existing userRegistration from localStorage
            const existingUserRegistration = JSON.parse(localStorage.getItem('userRegistration'));

            // Update userInfo in existing userRegistration
            const updatedUserRegistration = {
                ...existingUserRegistration,
                userInfo: {
                    ...existingUserRegistration.userInfo,
                    ...userInfo, // Merge userInfo from response with existing userInfo
                },
            };

            // Save updated userRegistration back to localStorage
            localStorage.setItem('userRegistration', JSON.stringify(updatedUserRegistration));

            // Update state with updated userRegistration
            setUser(updatedUserRegistration);
        } catch (error) {
            console.error("Error syncing user data with the backend:", error);
        } finally {
            setLoading(false);
        }
    }

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
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/settings`);
            setSettings(response.data?.websiteSettings);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Manage Cart
    const addToCart = async (item) => {
        // Check if the user is logged in
        if (user.logged) {
            // Determine the quantity
            const quantity = item.quantity || 1;

            // Determine the color
            const color = item.metaData?.color || item.product.colors[0];

            // Determine the storage
            const storage = item.metaData?.storage || item.product.storages[0];

            // Add the item to the cart
            await addToCartApi(item.product, quantity, color, storage);

            // Refresh the user's cart
            await getUserCart();
        } else {
            // Inform the user to log in and redirect to the login page
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
        setLoading(true);
        try {
            // Fetch user's cart from the backend
            const response = await mainRequest.get(`${apiUrl}/user-cart`);
            const userCart = response.data.cart?.items;
            setCart(userCart);
        } catch (error) {
            console.error("Error syncing cart data with the backend:", error);
        } finally {
            setLoadingCart(false);
            setLoading(false);
        }
    }

    useEffect(() => {

        if (localStorage.getItem("userRegistration")) {
            setUser(JSON.parse(localStorage.getItem("userRegistration")));
        }

        if (user?.logged) {
            getUserCart();
        }

    }, [user?.logged]);

    // API cart management functions
    const addToCartApi = async (item, quantity, color, storage) => {
        setLoadingCart(true);
        try {
            // Extract necessary properties from the item
            const { _id: productId } = item;
            // Send request to add item to cart with product ID, quantity, and metadata
            const response = await mainRequest.post(`${apiUrl}/add-to-cart`, { productId, quantity, color, storage });

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

    useEffect(() => {
        getSettings();
        if (JSON.parse(localStorage.getItem("userRegistration"))) {
            getUserInfo();
        }
    }, [])

    return (
        <MainContext.Provider
            value={{
                getUserInfo,
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
                mainLoading: loading,
                setLoading
            }}>
            {children}
        </MainContext.Provider>
    );
}

export default MainContextProvider;
