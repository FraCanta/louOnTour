import { getAllTours } from "../../components/lib/helper";

export default function Tours({ tour }) {
  return (
    <div className="h-screen">
      {tour.map((t) => {
        <div key={t.id}>
          <h1>{t.title}</h1>
          <p>{t.desc}</p>
        </div>;
      })}
    </div>
  );
}

export async function getStaticProps() {
  const tour = getAllTours();
  return {
    props: { tour },
  };
}

export async function getStaticPaths() {
  const tours = getAllTours();

  const paths = tours.map((tour) => ({
    params: { id: tour.id.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
}
