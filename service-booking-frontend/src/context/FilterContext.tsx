import React, { createContext, useContext, useState } from 'react';

interface FilterContextType {
  category: string;
  city: string;
  sortByPrice: boolean;
  sortByRating: boolean;
  setCategory: (cat: string) => void;
  setCity: (city: string) => void;
  setSortByPrice: () => void;
  setSortByRating: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilter mora da se koristi vo FilterProvider");
  return context;
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [category, setCategory] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [sortByPrice, setSortByPriceState] = useState<boolean>(false);
  const [sortByRating, setSortByRatingState] = useState<boolean>(false);

  const setSortByPrice = () => {
  setSortByPriceState(prev => {
    const newValue = !prev;
    if (newValue) setSortByRatingState(false);
    return newValue;
  });
};

const setSortByRating = () => {
  setSortByRatingState(prev => {
    const newValue = !prev;
    if (newValue) setSortByPriceState(false);
    return newValue;
  });
};

  return (
    <FilterContext.Provider value={{
      category,
      city,
      sortByPrice,
      sortByRating,
      setCategory,
      setCity,
      setSortByPrice,
      setSortByRating
    }}>
      {children}
    </FilterContext.Provider>
  );
};
