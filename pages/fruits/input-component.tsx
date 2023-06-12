"use client";
import React from "react";

type Props = {
  placeholder: string;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = (props: Props) => {
  return (
    <input
      type="search"
      placeholder={props.placeholder}
      onChange={props.onChangeHandler}
    />
  );
};

export default Input;
