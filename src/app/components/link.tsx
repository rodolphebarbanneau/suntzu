export const Link = ({
  url,
  title,
  text,
  img,
}: {
  url: string;
  title: string;
  text?: string;
  img: string;
}) => (
  <a href={url} className={text ? "lg" : "sm"} target="_blank" rel="noreferrer" title={title}>
    <img src={img} alt={title}></img>
    {text && <p>{text}</p>}
  </a>
);

export default Link;
