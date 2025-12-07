import "./Loader.scss";

type LoaderProps = {
  message?: string;
  size?: number;
};

export function Loader({ message, size = 48 }: LoaderProps) {
  return (
    <div className="loader">
      <div className="loader__spinner" style={{ width: `${size}px`, height: `${size}px` }}></div>
      {message && <p className="loader__text">{message}</p>}
    </div>
  );
}
