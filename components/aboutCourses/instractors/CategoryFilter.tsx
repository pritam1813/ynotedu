import React, { useState } from "react";

const CategoryFilter = ({
  categories,
  teamMembers,
  filterCategories,
  setFilterCategories,
  handleQueryParams,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleFilterCategories = (category) => {
    if (filterCategories.includes(category)) {
      setFilterCategories(filterCategories.filter((item) => item !== category));
    } else {
      setFilterCategories([...filterCategories, category]);
    }
  };

  return (
    <div className="sidebar__item">
      <div className="accordion js-accordion">
        <div
          className={`accordion__item js-accordion-item-active ${
            categoryOpen ? "is-active" : ""
          }`}
        >
          <div
            className="accordion__button items-center"
            onClick={() => setCategoryOpen((prev) => !prev)}
          >
            <h5 className="sidebar__title">Category</h5>
            <div className="accordion__icon">
              <div className="icon icon-chevron-down"></div>
              <div className="icon icon-chevron-up"></div>
            </div>
          </div>

          <div
            className="accordion__content"
            style={categoryOpen ? { maxHeight: "350px" } : {}}
          >
            <div className="accordion__content__inner">
              <div className="sidebar-checkbox">
                {/* All Categories Option */}
                <div
                  onClick={() => setFilterCategories([])}
                  className="sidebar-checkbox__item"
                >
                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={filterCategories.length === 0}
                      readOnly
                    />
                    <div className="form-checkbox__mark">
                      <div className="form-checkbox__icon icon-check"></div>
                    </div>
                  </div>
                  <div className="sidebar-checkbox__title">All</div>
                  <div className="sidebar-checkbox__count"></div>
                </div>

                {/* Individual Categories */}
                {categories.map((category, index) => {
                  const categoryCount = teamMembers.filter(
                    (member) => member.category === category.title
                  ).length;

                  return (
                    <div
                      key={index}
                      onClick={() => handleFilterCategories(category.title)}
                      className="sidebar-checkbox__item cursor"
                    >
                      <div className="form-checkbox">
                        <input
                          type="checkbox"
                          checked={filterCategories.includes(category.title)}
                          onChange={() => handleQueryParams(category.title)}
                        />
                        <div className="form-checkbox__mark">
                          <div className="form-checkbox__icon icon-check"></div>
                        </div>
                      </div>
                      <div className="sidebar-checkbox__title">
                        {category.title}
                      </div>
                      <div className="sidebar-checkbox__count">
                        ({categoryCount})
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="sidebar__more mt-15">
                <a href="#" className="text-14 fw-500 underline text-purple-1">
                  Show more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
