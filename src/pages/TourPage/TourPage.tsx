import { Link, useLocation } from "react-router-dom";
import { getHotel, getPrice } from "@/api/endpoints";
import { useFetch } from "@/hooks/useFetch";
import { TourCard } from "@/components";
import { HotelOffer } from "@/types/location";

import "./TourPage.scss";

function getServiceLabel(key: string) {
  const labels: Record<string, string> = {
    wifi: '📶 Wi-Fi',
    aquapark: '🏊 Аквапарк',
    tennis_court: '🎾 Тенісний корт',
    laundry: '🧺 Пральня',
    parking: '🅿️ Парковка',
  }
  return labels[key] || key
}


export function TourPage() {
  const { pathname } = useLocation();
  const hotelId = pathname.split("/")[2];
  const priceId = pathname.split("/")[3];

  const { data: priceData, isLoading: isPriceLoading } = useFetch({
    key: `price-${priceId}`,
    queryFn: () => getPrice(String(priceId)),
    enabled: priceId !== undefined,
  });

  const { data: hotelData, isLoading: isHotelLoading } = useFetch({
    key: `hotel-${hotelId}`,
    queryFn: () => getHotel(Number(hotelId)),
    enabled: hotelId !== undefined,
  });

  if (isPriceLoading || isHotelLoading) {
    return <p>Loading tour details...</p>;
  }

  const tourData: HotelOffer | null = (() => {
    if (!priceData || !hotelData) return null;
    const { id: priceId, ...restPrice } = priceData;
    return { ...hotelData, ...restPrice, priceId };
  })();

  if (!tourData) {
    return <p>Не вдалося завантажити тур.</p>;
  }

  return (
    <div className="tour-page">
      <Link to="/" className="tour-page__back-link">
        ← Повернутися до пошуку
      </Link>
      <h1 className="tour-page__title">Тур</h1>
      <TourCard tour={tourData}>
        {tourData.description && (
          <div className="tour-page__description">
            <h3>Про готель</h3>
            <p>{tourData.description}</p>
          </div>
        )}

        {tourData.services && (
          <div className="tour-page__services">
            <h3>Зручності</h3>
            <ul className="tour-page__services-list">
              {Object.entries(tourData.services).map(([key, value]) =>
                value === "yes" ? (
                  <li key={key} className="tour-page__service-item">
                    {getServiceLabel(key)}
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        )}
      </TourCard>
    </div>
  );
}
