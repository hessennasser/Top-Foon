"use client"
import { useEffect, useState } from 'react';
import { apiUrl } from '@/apiUrl';
import axios from 'axios';
import HeroSlider from '@/components/heroSlider/HeroSlider';
import SlideCategory from '@/components/category/SlideCategory';
import ProductsByCategory from '@/components/product/ProductsByCategory';
import { useTranslation } from '../i18n/client';

export default function Home({ params: { lng } }) {
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const { i18n } = useTranslation();

  // useEffect(() => {
  //   document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  // }, [i18n.language]);


  const getAllSlides = async () => {
    try {
      const response = await axios.get(`${apiUrl}/home/hero-Slides`);
      setSlides(response.data?.heroSlides)
    } catch (error) {
      console.log(error);
    }
  }

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/all-category`);
      setCategories(response.data?.categories)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllSlides()
    getAllCategories()
  }, [])

  return (
    <div>
      <div className="">
        <HeroSlider slides={slides} />
        <SlideCategory categories={categories} />
        <ProductsByCategory categories={categories} />
      </div>
    </div>
  );
}
