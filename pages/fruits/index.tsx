"use client";
import React from "react";
import Input from "./input-component";
import FruitsSection, { Fruit } from "./fruits-component";

export default function Home() {
  const [fruits, setFruits] = React.useState<Fruit[]>([]);
  const [filteredFruits, setFilteredFruits] = React.useState<Fruit[]>([]);

  React.useEffect(() => {
    fetch("/fruit-api/fruit/all")
      .then((res) => res.json())
      .then((json: Fruit[]) => {
        setFruits(json);
        setFilteredFruits(json);
      })
      .catch((err) => console.log(err));
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    const newFilteredFruits = fruits.filter((fruit) =>
      fruit.name.toLowerCase().includes(searchValue)
    );
    setFilteredFruits(newFilteredFruits);
  };

  return (
    <main>
      <Input placeholder="Search fruits..." onChangeHandler={onChangeHandler} />
      <FruitsSection fruits={filteredFruits} />
    </main>
  );
}
