import type { GeoEntity as GeoItem } from "@/types/api";

import "./Dropdown.css";

type DropdownProps = {
  items: GeoItem[];
  onSelect: (item: GeoItem) => void;
  isLoading: boolean;
};

export function Dropdown({ items, onSelect, isLoading }: DropdownProps) {
  if (isLoading) {
    return (
      <div className="geo-dropdown">
        <div className="geo-dropdown__loading">Завантаження...</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="geo-dropdown">
        <div className="geo-dropdown__empty">Нічого не знайдено</div>
      </div>
    );
  }

  const getIcon = (type: GeoItem["type"]) => {
    switch (type) {
      case "city":
        return "🏙️";
      case "hotel":
        return "🏨";
      default:
        return "🌍";
    }
  };

  const getTypeLabel = (type: GeoItem["type"]) => {
    switch (type) {
      case "country":
        return "Країна";
      case "city":
        return "Місто";
      case "hotel":
        return "Готель";
      default:
        return "";
    }
  };

  return (
    <div className="geo-dropdown">
      <ul className="geo-dropdown__list">
        {items.map((item) => (
          <li key={`${item.type}-${item.id}`} className="geo-dropdown__item" onClick={() => onSelect(item)}>
            <span className="geo-dropdown__icon">{getIcon(item.type)}</span>
            <div className="geo-dropdown__info">
              <span className="geo-dropdown__name">{item.name}</span>
              <span className="geo-dropdown__type">{getTypeLabel(item.type)}</span>
            </div>
            {"flag" in item && item.flag && <img src={item.flag} alt={item.name} className="geo-dropdown__flag" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
