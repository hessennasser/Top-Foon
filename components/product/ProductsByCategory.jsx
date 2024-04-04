"use client"
import ProductCard from './ProductCard';
import { useTranslation } from '@/src/app/i18n/client';



const ProductsByCategory = ({ categories }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="w-full px-4 mx-auto sm:px-6 py-10 overflow-hidden">
            {
                categories?.map((item, index) => (
                    <section key={index} id={item?.name[i18n.language]}>
                        <h2 className='text-2xl text-center mb-10 font-bold w-fit mx-auto border-b-4 border-b-mainColor'>{item?.name[i18n.language]}</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                            {
                                item?.products?.map((item, index) => (
                                    <ProductCard key={index} item={item} />
                                ))
                            }
                        </div>
                    </section>
                ))
            }
        </div>
    )
}

export default ProductsByCategory