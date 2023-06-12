"use client";
import React from "react";

export type Fruit = {
  name: string;
  id: number;
};

type Props = {
  fruits: Fruit[];
};

const FruitsSection = (props: Props) => {
  const { fruits } = props;
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit.id}>{fruit.name}</li>
      ))}
    </ul>
  );
};

export default FruitsSection;
