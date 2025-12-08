import { Link, useLocation } from "react-router-dom";

import { getHotel, getPrice } from "@/api/endpoints";
import { useFetch } from "@/hooks/useFetch";
import { Loader, ResultMessage, TourCard } from "@/components";
import { getIcon, getTypeLabel, IconLabel } from "@/utils/labels";
import { InfoIcon, ArrowLeftIcon } from "@/icons";
import { HotelOffer } from "@/types/location";

import "./TourPage.scss";

export function TourPage() {
  const { pathname } = useLocation();
  const hotelId = pathname.split("/")[2];
  const priceId = pathname.split("/")[3];

  const { data: priceData, isLoading: isPriceLoading } = useFetch({
    key: `price-${priceId}`,
    queryFn: () => getPrice(String(priceId)),
    enabled: !!priceId,
  });

  const { data: hotelData, isLoading: isHotelLoading } = useFetch({
    key: `hotel-${hotelId}`,
    queryFn: () => getHotel(Number(hotelId)),
    enabled: !!hotelId,
  });

  const isLoading = isPriceLoading || isHotelLoading;
  const isDataExist = !priceData || !hotelData;

  if (isLoading) {
    return (
      <div className="tour-page">
        <Loader message="Завантаження..." />
      </div>
    );
  }

  if (isDataExist) {
    return (
      <div className="results-message-wrapper">
        <ResultMessage
          icon={<InfoIcon size={50} color="#ffb116" />}
          title="Результати відсутні"
          message="Не вдалося завантажити тур."
        />
      </div>
    );
  }

  const { countryId, cityId, cityName, countryName, name, img, description, services } = hotelData;
  const { startDate, endDate, amount, currency } = priceData;
  const tourData: HotelOffer = {
    id: Number(priceData.id),
    priceId: String(priceData.id),
    name,
    countryName,
    cityName,
    cityId,
    countryId,
    img,
    description,
    services,
    startDate,
    endDate,
    amount,
    currency,
  };

  return (
    <div className="tour-page">
      <Link to="/" className="tour-page__back-link">
        <ArrowLeftIcon /> Повернутися до пошуку
      </Link>
      <h1 className="tour-page__title">Деталі туру</h1>
      <TourCard tour={tourData}>
        {description && (
          <div className="tour-page__description">
            <h3>Про готель</h3>
            <p>{description}</p>
          </div>
        )}
        {services && (
          <div className="tour-page__services">
            <h3>Сервіси</h3>
            <ul className="tour-page__services-list">
              {Object.entries(services).map(([key, value]) => {
                const Icon = getIcon(key as IconLabel);
                const label = getTypeLabel(key as IconLabel);
                return (
                  value === "yes" && (
                    <li key={key} className="tour-page__service-item">
                      <Icon size={20} color="grey" />
                      {label}
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        )}
      </TourCard>
    </div>
  );
}
