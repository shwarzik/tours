import { ReactNode } from "react";

import "./ResultMessage.scss";

type ErrorMessageProps = {
  icon?: ReactNode;
  title: string;
  message: string;
};

export function ResultMessage({ icon, title, message }: ErrorMessageProps) {
  return (
    <div className="message">
      {icon && icon}
      <h3 className="message__title">{title}</h3>
      <p className="message__text">{message}</p>
    </div>
  );
}
