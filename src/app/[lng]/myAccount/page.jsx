"use client"
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from '../../i18n/client';
import { MainContext } from '@/mainContext';
import { apiUrl } from '@/apiUrl';
import { mainRequest } from '@/axiosConfig';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import UserAvatar from '@/components/UserAvatar';

const MyAccountPage = () => {
    const { t } = useTranslation();
    const { user, getUserInfo, loading } = useContext(MainContext);
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
    const [iPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
    const [userInfoState, setUserInfoState] = useState({
        name: user?.userInfo?.name || '',
        email: user?.userInfo?.email || '',
    });
    const [emailError, setEmailError] = useState('');
    const [passwordState, setPasswordState] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        // Update userInfoState when user changes
        setUserInfoState({
            name: user?.userInfo?.name || '',
            email: user?.userInfo?.email || '',
        });
    }, [user]);

    const handleNameChange = (e) => {
        setUserInfoState({ ...userInfoState, name: e.target.value });
    };

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setUserInfoState({ ...userInfoState, email: value });
        // Email validation using regular expression
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailError(isValidEmail ? '' : t('Invalid Email'));
    };

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswordState({ ...passwordState, [id]: value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        // Validate email
        if (!userInfoState.email || emailError) {
            return;
        }
        // Send Axios request to update profile
        setIsProfileSubmitting(true);
        try {
            const response = await mainRequest.put(`${apiUrl}/update-user-info`, { name: userInfoState.name });
            console.log(response);
            toast.success('Profile updated successfully');
            setIsProfileSubmitting(false);
            setEditingProfile(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error while updating profile');
            setIsProfileSubmitting(false);
        } finally {
            getUserInfo();
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        // Validate password fields
        if (!passwordState.currentPassword || !passwordState.newPassword || !passwordState.confirmPassword) {
            toast.error('All password fields are required');
            return;
        }
        if (passwordState.newPassword !== passwordState.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        // Send Axios request to update password
        setIsPasswordSubmitting(true);
        try {
            const response = await mainRequest.put(`${apiUrl}/update-user-password`, {
                oldPassword: passwordState.currentPassword,
                newPassword: passwordState.newPassword,
            });
            console.log(response);
            toast.success('Password updated successfully');
            setIsPasswordSubmitting(false);
            setEditingPassword(false);
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Error while updating password');
            setIsPasswordSubmitting(false);
        }
    };

    const toggleEditProfile = () => {
        setEditingProfile((prevState) => !prevState);
        setEditingPassword(false)
    };

    const toggleEditPassword = () => {
        setEditingPassword((prevState) => !prevState);
        setEditingProfile(false)
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container pt-5 pb-10">
            <div className="bg-white p-5 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 bg-primaryColor py-4 text-center text-white">
                    {t('Account')}
                </h2>
                <div className="grid grid-cols-2 gap-5 my-5">
                    <div className="user-info col-span-2 md:col-span-1 bg-white p-6 shadow-lg rounded-md">
                        <h3 className="text-2xl font-semibold mb-2 text-center">{t('Your Information')}</h3>
                        {editingProfile ? (
                            <form onSubmit={handleProfileSubmit}>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="text-lg">{t('Name')}:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={userInfoState.name}
                                        onChange={handleNameChange}
                                        className="text-lg border border-gray-300 rounded-md px-3 py-1"
                                    />
                                    <label htmlFor="email" className="text-lg">{t('Email')}:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        disabled
                                        value={userInfoState.email}
                                        onChange={handleEmailChange}
                                        className={`text-lg border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-1`}
                                    />
                                    {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                                </div>
                                <button type="submit" className="bg-primaryColor text-white px-4 py-2 rounded-md mt-4">
                                    {isProfileSubmitting ? t('Saving...') : t('Save Changes')}
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <p className="text-lg">{t('Name')}: {userInfoState.name}</p>
                                <p className="text-lg">{t('Email')}: {userInfoState.email}</p>
                            </div>
                        )}
                        <button onClick={toggleEditProfile} className="block text-lg text-primaryColor underline cursor-pointer mt-2">
                            {editingProfile ? t('Cancel') : t('Edit Profile')}
                        </button>
                        {editingPassword && (
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="flex flex-col gap-2 mt-4">
                                    <label htmlFor="currentPassword" className="text-lg">{t('Current Password')}:</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={passwordState.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="text-lg border border-gray-300 rounded-md px-3 py-1"
                                    />
                                    <label htmlFor="newPassword" className="text-lg">{t('New Password')}:</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={passwordState.newPassword}
                                        onChange={handlePasswordChange}
                                        className="text-lg border border-gray-300 rounded-md px-3 py-1"
                                    />
                                    <label htmlFor="confirmPassword" className="text-lg">{t('Confirm Password')}:</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={passwordState.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="text-lg border border-gray-300 rounded-md px-3 py-1"
                                    />
                                </div>
                                <button type="submit" className="bg-primaryColor text-white px-4 py-2 rounded-md mt-4">
                                    {iPasswordSubmitting ? t('Saving...') : t('Save Changes')}
                                </button>
                            </form>
                        )}
                        <button onClick={toggleEditPassword} className="block text-lg text-primaryColor underline cursor-pointer mt-2">
                            {editingPassword ? t('Cancel') : t('Change Password')}
                        </button>
                    </div>
                    <div className={`col-span-2 md:col-span-1 bg-white p-6 shadow-lg rounded-md`}>
                        <h2 className='text-2xl font-semibold mb-4 text-center'>{t('Profile')}</h2>
                        <div className="border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 text-start">
                            <UserAvatar currentAvatarUrl={user?.userInfo?.avatar?.url} canChangeAvatar={true} />
                            <div className="flex flex-col gap-4">
                                <div className='pb-2'>
                                    <p className="font-semibold">{t('Your Name')} :</p>
                                    <p>{userInfoState.name}</p>
                                </div>
                                <div className='pb-2'>
                                    <p className="font-semibold">{t('Your Email')} :</p>
                                    <p>{userInfoState.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccountPage;
