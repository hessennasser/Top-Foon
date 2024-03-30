"use client"
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl } from "@/apiUrl";
import { MainContext } from "@/mainContext";

const ActiveAccount = () => {
    const router = useRouter();
    const { user, setUser } = useContext(MainContext);
    const userActive = JSON.parse(localStorage.getItem("userRegistration"));

    useEffect(() => {
        if (!userActive?.activationToken && (!user?.active || user?.active === true)) {
            router.push("/signUp");
        }
    }, []);

    const [activationCode, setActivationCode] = useState("");

    // Create refs for each input field
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    const handleInputChange = (index, value, keyCode) => {
        if (keyCode === 8 && value.length === 0 && index > 0) {
            // If Backspace and the current input is empty, focus on the previous one
            inputRefs[index].current.value = "";
            inputRefs[index - 1].current.focus();
        } else if (value.length === 1 && index < inputRefs.length - 1) {
            // If not the last input, focus on the next one
            inputRefs[index + 1].current.focus();
        } else if (value.length === 0 && index === inputRefs.length - 1) {
            // If the last input and Backspace is pressed, focus on the current one (allow deletion)
            inputRefs[index].current.focus();
        }

        // Check if the input has a value and apply the border-primary-alt class
        if (inputRefs[index].current.value) {
            inputRefs[index].current.classList.add("border-primary-alt");
        } else {
            // Remove the border-primary-alt class if the input is empty
            inputRefs[index].current.classList.remove("border-primary-alt");
        }

        // Update the activationCode state with the combined value
        setActivationCode(inputRefs.map(ref => ref.current.value).join(''));
    };

    useEffect(() => {
        // Check if all input values are filled and trigger submit
        const allInputsFilled = inputRefs.every(ref => ref.current.value.length === 1);
        if (allInputsFilled) {
            handleSubmit();
        }
    }, [inputRefs])

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${apiUrl}/activate-user`, {
                activation_token: userActive.activationToken,
                activation_code: activationCode
            });

            if (response.status === 201) {
                // Display success message
                toast.success(response?.data?.message);

                // Update local storage to mark the user as active and remove the activation token
                const updatedUser = { ...userActive, active: true, activationToken: null };
                localStorage.setItem("userRegistration", JSON.stringify(updatedUser));
                setUser(updatedUser);

                router.push("/login");
            } else {
                toast.error("فشل تفعيل الحساب. الرجاء المحاولة مرة أخرى.");
            }

        } catch (error) {
            console.error("Error during Activation:", error);
            toast.error("حدث خطأ. الرجاء المحاولة مرة أخرى لاحقًا.");
        }
    }

    return (
        <div className="grid md:grid-cols-2">
            <div className="image">
                <img
                    src="https://exclusive-ecommerce-client.vercel.app/assets/signup-img-5MB1hWiM.avif"
                    alt="تسجيل"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="py-10 w-full max-w-full px-3 mx-auto mt-0 md:flex-0 shrink-0 flex flex-col items-center justify-center">
                <h2 className="text-xl text-primary-alt mb-2">
                    أدخل رمز التفعيل
                </h2>
                <p className="mb-4 text-center">
                    لقد قمنا بإرسال رمز التفعيل إلى البريد الإلكتروني{" "}
                    <span className="font-bold">{user?.userInfo?.email}</span>
                </p>
                <form>
                    <div className="flex items-center justify-center gap-4">
                        {inputRefs.map((inputRef, index) => (
                            <input
                                key={index}
                                type="tel"
                                pattern="[0-9]*"
                                className="border border-primary rounded-md w-16 h-16 text-center focus:outline"
                                tabIndex={index + 1}
                                maxLength="1"
                                ref={inputRef}
                                onChange={(e) =>
                                    handleInputChange(index, e.target.value, e.keyCode)
                                }
                                onKeyDown={(e) =>
                                    handleInputChange(index, "", e.keyCode || e.which)
                                }
                            />
                        ))}
                    </div>
                    <button
                        className="inline-block w-full px-6 py-3 mt-6 mb-2 font-bold text-center text-white uppercase align-middle transition-all bg-transparent border-0 rounded-lg cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-gray-900 to-slate-800 hover:border-slate-700 hover:bg-slate-700 hover:text-white"
                        type="button"
                        onClick={() => handleSubmit()}
                    >
                        إرسال
                    </button>
                </form>
                <div className="opacity-70 mt-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem("userRegistration");
                            router.push("/signUp");
                            setUser({});
                        }}
                    >
                        هل تحتاج إلى تسجيل الخروج
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveAccount;
