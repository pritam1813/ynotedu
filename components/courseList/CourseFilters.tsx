"use client";

import React, { useState } from "react";
import {
  categories,
  duration,
  instractorNames,
  languages,
  levels,
  prices,
  rating,
} from "@/data/courses";
import Star from "../common/Star";

interface CourseFiltersProps {
  category: string;
  level: string;
  language: string;
  price: string;
  rating: string;
  duration: string;
  updateFilters: (key: string, value: string) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  category,
  level,
  language,
  price,
  rating: ratingParam,
  duration: durationParam,
  updateFilters,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [instractorOpen, setInstractorOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [levelOpen, setLevelOpen] = useState(true);
  const [languageOpen, setLanguageOpen] = useState(true);
  const [durationOpen, setDurationOpen] = useState(true);

  return (
    <div className="col-xl-3 col-lg-4 lg:d-none">
      <div className="pr-30 lg:pr-0">
        <div className="sidebar -courses">
          {/* Category */}
          <div className="sidebar__item">
            <div className="accordion js-accordion">
              <div
                className={`accordion__item js-accordion-item-active ${
                  categoryOpen ? "is-active" : ""
                } `}
              >
                <div
                  className="accordion__button items-center"
                  onClick={() => setCategoryOpen((pre) => !pre)}
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
                      <div
                        onClick={() => updateFilters("category", "")}
                        className="sidebar-checkbox__item"
                      >
                        <div className="form-checkbox">
                          <input type="checkbox" defaultChecked={!category} />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon icon-check"></div>
                          </div>
                        </div>

                        <div className="sidebar-checkbox__title">All</div>
                        <div className="sidebar-checkbox__count"></div>
                      </div>
                      {categories.map((elm, i) => (
                        <div
                          key={i}
                          onClick={() => updateFilters("category", elm.title)}
                          className="sidebar-checkbox__item cursor"
                        >
                          <div className="form-checkbox">
                            <input
                              type="checkbox"
                              defaultChecked={category === elm.title}
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon icon-check"></div>
                            </div>
                          </div>

                          <div className="sidebar-checkbox__title">
                            {elm.title}
                          </div>
                          <div className="sidebar-checkbox__count"></div>
                        </div>
                      ))}
                    </div>

                    <div className="sidebar__more mt-15">
                      <a
                        href="#"
                        className="text-14 fw-500 underline text-purple-1"
                      >
                        Show more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="sidebar__item">
            <div className="accordion js-accordion">
              <div
                className={`accordion__item js-accordion-item-active ${
                  ratingOpen ? "is-active" : ""
                } `}
              >
                <div
                  className="accordion__button items-center"
                  onClick={() => setRatingOpen((pre) => !pre)}
                >
                  <h5 className="sidebar__title">Ratings</h5>

                  <div className="accordion__icon">
                    <div className="icon icon-chevron-down"></div>
                    <div className="icon icon-chevron-up"></div>
                  </div>
                </div>

                <div
                  className="accordion__content"
                  style={ratingOpen ? { maxHeight: "350px" } : {}}
                >
                  <div className="accordion__content__inner">
                    <div className="sidebar-checkbox">
                      <div
                        onClick={() => updateFilters("rating", "")}
                        className="sidebar-checkbox__item"
                      >
                        <div className="form-radio mr-10">
                          <div className="radio">
                            <input type="radio" defaultChecked={!ratingParam} />
                            <div className="radio__mark">
                              <div className="radio__icon"></div>
                            </div>
                          </div>
                        </div>
                        <div className="sidebar-checkbox__title d-flex items-center">
                          <div className="d-flex x-gap-5 pr-10">
                            <Star
                              star={5}
                              textSize={"text-11"}
                              textColor={undefined}
                            />
                          </div>
                          All
                        </div>
                        <div className="sidebar-checkbox__count"></div>
                      </div>
                      {rating.map((elm, i) => (
                        <div
                          key={i}
                          onClick={() =>
                            updateFilters("rating", elm.range.join(","))
                          }
                          className="sidebar-checkbox__item cursor"
                        >
                          <div className="form-radio mr-10">
                            <div className="radio">
                              <input
                                type="radio"
                                defaultChecked={
                                  ratingParam === elm.range.join(",")
                                }
                              />
                              <div className="radio__mark">
                                <div className="radio__icon"></div>
                              </div>
                            </div>
                          </div>
                          <div className="sidebar-checkbox__title d-flex items-center">
                            <div className="d-flex x-gap-5 pr-10">
                              <Star
                                star={5}
                                textSize={"text-11"}
                                textColor={undefined}
                              />
                            </div>
                            {elm.text}
                          </div>
                          <div className="sidebar-checkbox__count"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructors */}
          <div className="sidebar__item">
            <div className="accordion js-accordion">
              <div
                className={`accordion__item js-accordion-item-active ${
                  instractorOpen ? "is-active" : ""
                } `}
              >
                <div
                  className="accordion__button items-center"
                  onClick={() => setInstractorOpen((pre) => !pre)}
                >
                  <h5 className="sidebar__title">Instructors</h5>

                  <div className="accordion__icon">
                    <div className="icon icon-chevron-down"></div>
                    <div className="icon icon-chevron-up"></div>
                  </div>
                </div>

                <div
                  className="accordion__content"
                  style={instractorOpen ? { maxHeight: "350px" } : {}}
                >
                  <div className="accordion__content__inner">
                    <div className="sidebar-checkbox">
                      <div
                        className="sidebar-checkbox__item"
                        onClick={() => updateFilters("instructor", "")}
                      >
                        <div className="form-checkbox">
                          <input type="checkbox" defaultChecked={true} />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon icon-check"></div>
                          </div>
                        </div>

                        <div className="sidebar-checkbox__title">All</div>
                        <div className="sidebar-checkbox__count"></div>
                      </div>
                      {instractorNames.map((elm, i) => (
                        <div
                          key={i}
                          className="sidebar-checkbox__item cursor"
                          onClick={() => updateFilters("instructor", elm.title)}
                        >
                          <div className="form-checkbox">
                            <input type="checkbox" defaultChecked={false} />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon icon-check"></div>
                            </div>
                          </div>

                          <div className="sidebar-checkbox__title">
                            {elm.title}
                          </div>
                          <div className="sidebar-checkbox__count"></div>
                        </div>
                      ))}
                    </div>
                    <div className="sidebar__more mt-15">
                      <a
                        href="#"
                        className="text-14 fw-500 underline text-purple-1"
                      >
                        Show more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="sidebar__item">
            <div className="accordion js-accordion">
              <div
                className={`accordion__item js-accordion-item-active ${
                  priceOpen ? "is-active" : ""
                } `}
              >
                <div
                  className="accordion__button items-center"
                  onClick={() => setPriceOpen((pre) => !pre)}
                >
                  <h5 className="sidebar__title">Price</h5>

                  <div className="accordion__icon">
                    <div className="icon icon-chevron-down"></div>
                    <div className="icon icon-chevron-up"></div>
                  </div>
                </div>

                <div
                  className="accordion__content"
                  style={priceOpen ? { maxHeight: "350px" } : {}}
                >
                  <div className="accordion__content__inner">
                    <div className="sidebar-checkbox">
                      {prices.map((elm, i) => (
                        <div
                          key={i}
                          className="sidebar-checkbox__item cursor"
                          onClick={() => updateFilters("price", elm.title)}
                        >
                          <div className="form-radio mr-10">
                            <div className="radio">
                              <input
                                type="radio"
                                defaultChecked={price === elm.title}
                              />
                              <div className="radio__mark">
                                <div className="radio__icon"></div>
                              </div>
                            </div>
                          </div>
                          <div className="sidebar-checkbox__title">
                            {elm.title}
                          </div>
                          <div className="sidebar-checkbox__count"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="sidebar__item">
            <div className="accordion js-accordion">
              <div
                className={`accordion__item js-accordion-item-active ${
                  levelOpen ? "is-active" : ""
                }  `}
              >
                <div
                  className="accordion__button items-center"
                  onClick={() => setLevelOpen((pre) => !pre)}
                >
                  <h5 className="sidebar__title">Level</h5>

                  <div className="accordion__icon">
                    <div className="icon icon-chevron-down"></div>
                    <div className="icon icon-chevron-up"></div>
                  </div>
                </div>

                <div
                  className="accordion__content"
                  style={levelOpen ? { maxHeight: "350px" } : {}}
                >
                  <div className="accordion__content__inner">
                    <div className="sidebar-checkbox">
                      <div
                        className="sidebar-checkbox__item cursor"
                        onClick={() => updateFilters("level", "")}
                      >
                        <div className="form-checkbox">
                          <input type="checkbox" defaultChecked={!level} />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon icon-check"></div>
                          </div>
                        </div>

                        <div className="sidebar-checkbox__title">All</div>
                        <div className="sidebar-checkbox__count"></div>
                      </div>
                      {levels.map((elm, i) => (
                        <div
                          key={i}
                          className="sidebar-checkbox__item cursor"
                          onClick={() => updateFilters("level", elm.title)}
                        >
                          <div className="form-checkbox">
                            <input
                              type="checkbox"
                              defaultChecked={level === elm.title}
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon icon-check"></div>
                            </div>
                          </div>

                          <div className="sidebar-checkbox__title">
                            {elm.title}
                          </div>
                          <div className="sidebar-checkbox__count"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="sidebar__item">
            <div className="accordion js-accordion">
              <div
                className={`accordion__item js-accordion-item-active ${
                  languageOpen ? "is-active" : ""
                } `}
              >
                <div
                  className="accordion__button items-center"
                  onClick={() => setLanguageOpen((pre) => !pre)}
                >
                  <h5 className="sidebar__title">Language</h5>

                  <div className="accordion__icon">
                    <div className="icon icon-chevron-down"></div>
                    <div className="icon icon-chevron-up"></div>
                  </div>
                </div>

                <div
                  className="accordion__content"
                  style={languageOpen ? { maxHeight: "350px" } : {}}
                >
                  <div className="accordion__content__inner">
                    <div className="sidebar-checkbox">
                      <div
                        className="sidebar-checkbox__item cursor"
                        onClick={() => updateFilters("language", "")}
                      >
                        <div className="form-checkbox">
                          <input type="checkbox" defaultChecked={!language} />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon icon-check"></div>
                          </div>
                        </div>
                        <div className="sidebar-checkbox__title">All</div>
                        <div className="sidebar-checkbox__count"></div>
                      </div>
                      {languages.map((elm, i) => (
                        <div
                          key={i}
                          className="sidebar-checkbox__item cursor"
                          onClick={() => updateFilters("language", elm.title)}
                        >
                          <div className="form-checkbox">
                            <input
                              type="checkbox"
                              defaultChecked={language === elm.title}
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon icon-check"></div>
                            </div>
                          </div>
                          <div className="sidebar-checkbox__title">
                            {elm.title}
                          </div>
                          <div className="sidebar-checkbox__count"></div>
                        </div>
                      ))}
                    </div>
                    <div className="sidebar__more mt-15">
                      <a
                        href="#"
                        className="text-14 fw-500 underline text-purple-1"
                      >
                        Show more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="sidebar__item">
            <div className="accordion js-accordion">
              <div
                className={`accordion__item js-accordion-item-active ${
                  durationOpen ? "is-active" : ""
                } `}
              >
                <div
                  className="accordion__button items-center"
                  onClick={() => setDurationOpen((pre) => !pre)}
                >
                  <h5 className="sidebar__title">Duration</h5>

                  <div className="accordion__icon">
                    <div className="icon icon-chevron-down"></div>
                    <div className="icon icon-chevron-up"></div>
                  </div>
                </div>

                <div
                  className="accordion__content"
                  style={durationOpen ? { maxHeight: "350px" } : {}}
                >
                  <div className="accordion__content__inner">
                    <div className="sidebar-checkbox">
                      <div
                        className="sidebar-checkbox__item"
                        onClick={() => updateFilters("duration", "")}
                      >
                        <div className="form-checkbox">
                          <input
                            type="checkbox"
                            defaultChecked={!durationParam}
                          />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon icon-check"></div>
                          </div>
                        </div>
                        <div className="sidebar-checkbox__title">All</div>
                        <div className="sidebar-checkbox__count"></div>
                      </div>
                      {duration.map((elm, i) => (
                        <div
                          key={i}
                          className="sidebar-checkbox__item cursor"
                          onClick={() =>
                            updateFilters("duration", elm.range.join(","))
                          }
                        >
                          <div className="form-checkbox">
                            <input
                              type="checkbox"
                              defaultChecked={
                                durationParam === elm.range.join(",")
                              }
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon icon-check"></div>
                            </div>
                          </div>
                          <div className="sidebar-checkbox__title">
                            {elm.title}
                          </div>
                          <div className="sidebar-checkbox__count"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;
