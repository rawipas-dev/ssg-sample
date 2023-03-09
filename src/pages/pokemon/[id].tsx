import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import style from "./style.module.css";

interface Pokemons {
  name: string;
  url: string;
}

interface Props {
  pokemon: PokemonData;
  list: Pokemons[];
}

interface PokemonData {
  id: number;
  name: string;
  weight: number;
  height: number;
  image: string;
}

const BlogPage: React.FC<Props> = ({ pokemon, list }) => {
  const router = useRouter();
  const changePage = (url: string) => {
    const id = url.split("/").slice(-2, -1)[0];
    router.push(`/pokemon/${id}`);
  };

  const _renderList = () => {
    if (list.length > 0) {
      return (
        <Col>
          <ul>
            {list?.map((x, i) => (
              <li
                key={i}
                className={style.liStyle}
                onClick={() => changePage(x.url)}
              >
                {x.name}
              </li>
            ))}
          </ul>
        </Col>
      );
    }
  };
  return (
    <Container>
      <h1>Pokemon Blog</h1>
      <Row>
        <Col className="text-center">
          <Card>
            <Card.Body>
              <Card.Img
                variant="top"
                src={pokemon.image}
                style={{ height: 200, width: 200 }}
              />
              <Card.Title>{pokemon.name}</Card.Title>
              <p>Weight: {pokemon.weight}</p>
              <p>Height: {pokemon.height}</p>
            </Card.Body>
          </Card>
        </Col>
        {_renderList()}
      </Row>
    </Container>
  );
};

export default BlogPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
  const data = await response.json();

  const paths = data.results.map((item: Pokemons) => ({
    params: {
      id: item.url.split("/").slice(-2, -1)[0],
    },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!params) {
    return { notFound: true };
  }

  const getList = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
  const list = await getList.json();

  const url = `https://pokeapi.co/api/v2/pokemon/${params.id}`;
  const response = await fetch(url);
  const data = await response.json();
  const pokemon = {
    id: data.id,
    name: data.name,
    weight: data.weight,
    height: data.height,
    image: data.sprites.front_default,
  };

  return { props: { pokemon, list: list.results } };
};
