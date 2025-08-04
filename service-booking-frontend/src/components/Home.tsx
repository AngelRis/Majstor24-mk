import { FilterProvider } from '../context/FilterContext';
import CategoryList from './CategoryList';
import CityAndSortFilter from './CityAndSortFilter';
import ServiceList from './ServiceList';

const Home = () => {
  return (
    <FilterProvider>
      <div className="container py-4">
        <h2 className="mb-4">Услуги</h2>
        <CategoryList />
        <CityAndSortFilter />
        <ServiceList />
      </div>
    </FilterProvider>
  );
};

export default Home;
