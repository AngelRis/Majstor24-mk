import { serviceCategories } from '../constants/serviceCategory';
import { useFilter } from '../context/FilterContext';

const CategoryList = () => {
  const { category, setCategory } = useFilter();

  return (
    <div className="mb-3 d-flex flex-wrap gap-2">
        <button
        className={`btn ${category === '' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => setCategory('')}
      >
          Сите
        </button>
      {serviceCategories.map((cat) => (
        <button
          key={cat.value}
          className={`btn ${category === cat.value ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setCategory(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};
export default CategoryList;
