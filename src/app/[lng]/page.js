"use client"
import { useContext, useEffect, useState } from 'react';
import { apiUrl } from '@/apiUrl';
import axios from 'axios';
import HeroSlider from '@/components/heroSlider/HeroSlider';
import SlideCategory from '@/components/category/SlideCategory';
import ProductsByCategory from '@/components/product/ProductsByCategory';
import { MainContext } from '@/mainContext';

export default function Home({ params: { lng } }) {
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const { mainLoading, setLoading } = useContext(MainContext);
  const getAllSlides = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/home/hero-Slides`);
      setSlides(response.data?.heroSlides)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  const getAllCategories = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/all-category`);
      setCategories(response.data?.categories)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
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
