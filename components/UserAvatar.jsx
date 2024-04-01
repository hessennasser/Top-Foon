import React, { useContext, useState } from 'react';
import localAvatar from "../public/userAvatar.jpg";
import Image from 'next/image';
import { apiUrl } from '@/apiUrl';
import { MainContext } from '@/mainContext';
import { mainRequest } from '@/axiosConfig';
import { FaEdit } from 'react-icons/fa';
import { useTranslation } from '@/src/app/i18n/client';

const UserAvatar = ({ currentAvatarUrl, canChangeAvatar }) => {
    const [newAvatar, setNewAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const { getUserInfo } = useContext(MainContext);
    const { t } = useTranslation()
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setNewAvatar(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarUpload = async () => {
        if (newAvatar) {
            setLoading(true); // Set loading to true before making the request
            try {
                const data = { avatar: newAvatar };
                const response = await mainRequest.put(`${apiUrl}/update-user-avatar`, data);
                console.log(response.data);
                setNewAvatar(null);
                getUserInfo();
            } catch (error) {
                console.error('Error uploading avatar:', error);
            } finally {
                setLoading(false); // Set loading back to false after the request is completed
            }
        }
    };

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <label htmlFor="image" className='group relative overflow-hidden cursor-pointer'>
                <Image
                    src={newAvatar || currentAvatarUrl || localAvatar}
                    alt="Avatar"
                    width={100}
                    height={100}
                    className='rounded-full'
                />
                <input id='image' type="file" accept="image/*" onChange={handleAvatarChange} className='w-full h-full' hidden />
                <div className='group-hover:bg-opacity-50 absolute w-full h-full bg-gray-500 bg-opacity-0 top-0 left-0 rounded-full flex items-center justify-center'>
                    <FaEdit className='text-2xl text-white' />
                </div>
            </label>
            {canChangeAvatar && newAvatar && (
                <div className='mt-4'>
                    <button className='main-btn' onClick={handleAvatarUpload} disabled={loading}>
                        {loading ? t('Uploading...') : t('Update Avatar')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
