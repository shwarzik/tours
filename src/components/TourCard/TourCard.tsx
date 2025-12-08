import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { HotelOffer } from "@/types/location";
import { formatDate, formatPrice } from "@/utils/format";
import { ArrowRightIcon } from "@/icons";

import "./TourCard.scss";

type TourCardProps = {
  tour: HotelOffer;
  children?: ReactNode;
};

export function TourCard({ tour, children }: TourCardProps) {
  return (
    <div className={`tour-card ${children ? "tour-card--detail" : ""}`}>
      {tour.img && (
        <div className="tour-card__image-wrapper">
          <img src={tour.img} alt={tour?.name} className="tour-card__image" />
        </div>
      )}

      <div className="tour-card__content">
        <h3 className="tour-card__hotel-name">{tour?.name || "Готель"}</h3>

        {tour.countryName && tour.cityName && (
          <p className="tour-card__location">
            {tour.countryName}, {tour.cityName}
          </p>
        )}

        <div className="tour-card__dates">
          <span className="tour-card__date-label">Дата початку:</span>
          <span className="tour-card__date-value">{formatDate(tour.startDate)}</span>
        </div>

        {children && (
          <div className="tour-card__dates">
            <span className="tour-card__date-label">Дата завершення:</span>
            <span className="tour-card__date-value">{formatDate(tour.endDate)}</span>
          </div>
        )}
        {children}
        <div className="tour-card__price">{formatPrice(tour.amount, tour.currency)}</div>
        {!children && (
          <Link to={`/tour/${tour.hotelID}/${tour.priceId}`} className="tour-card__link">
            Відкрити ціну <ArrowRightIcon size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}
