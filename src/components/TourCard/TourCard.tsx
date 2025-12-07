import { Link } from "react-router-dom";
import { HotelOffer } from "@/types/location";
import "./TourCard.scss";

type TourCardProps = {
  tour: HotelOffer;
  isDetailView?: boolean;
};

export function TourCard({ tour, isDetailView = false }: TourCardProps) {
  const formatPrice = (amount: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      usd: "$",
      uah: "₴",
      eur: "€",
    };
    const symbol = currencySymbols[currency] || currency.toUpperCase();
    const formattedAmount = amount.toLocaleString("uk-UA");
    return `${formattedAmount} ${symbol}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const CardWrapper: React.ElementType = isDetailView ? "div" : "article";

  return (
    <CardWrapper className={`tour-card ${isDetailView ? "tour-card--detail" : ""}`}>
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

        {isDetailView && (
          <div className="tour-card__dates">
            <span className="tour-card__date-label">Дата завершення:</span>
            <span className="tour-card__date-value">{formatDate(tour.endDate)}</span>
          </div>
        )}

        <div className="tour-card__price">{formatPrice(tour.amount, tour.currency)}</div>

        {!isDetailView && (
          <Link to={`/tour/${tour.id}/${tour.priceId}`} className="tour-card__link">
            Відкрити ціну →
          </Link>
        )}
      </div>
    </CardWrapper>
  );
}
