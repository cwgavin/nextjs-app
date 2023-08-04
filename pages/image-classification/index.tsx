"use client";
import React, { useRef, useState } from "react";
import styles from "../../styles/ImageClassificationPage.module.css";
import { TextField } from "@mui/material";
import { styled } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import Image from "next/image";

const TextFieldPrimary = styled(TextField)({
  marginBottom: "20px",
  maxWidth: "500px",
});

const ButtonPrimary = styled(LoadingButton)({
  marginBottom: "20px",
  maxWidth: "120px",
});

type ClassificationResult = [[string, number]] | null;

export default function ImageClassificationPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlIsValid, setImageUrlIsValid] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<ClassificationResult>(null);
  const localImageSelector = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setResult(null);
    setImageUrl("");
    setImage(e.target.files[0]);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    localImageSelector.current!.value = "";
    setImageUrl(url);
    setResult(null);
    if (url && url.startsWith("http")) {
      fetch(url)
        .then((response) => {
          console.log(response);
          if (!response.ok) throw new Error();
          return response.blob();
        })
        .then((blob) => {
          setImage(new File([blob], ""));
          setImageUrlIsValid(true);
        })
        .catch(() => {
          setImageUrlIsValid(false);
          setImage(null);
        });
    } else {
      setImage(null);
    }
  };

  const handleSubmit = () => {
    if (!image) return;
    setLoading(true);

    const data = new FormData();
    data.append("file", image);

    fetch("/flask-api/imageClassification", { method: "POST", body: data })
      .then(async (response) => {
        const imageResponse = await response.json();
        console.log(imageResponse);
        setLoading(false);
        setResult(imageResponse["preds"]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.pageLayout}>
      <input
        ref={localImageSelector}
        id="select-local-image"
        type="file"
        accept="image/*"
        onChange={handleLocalFileChange}
      />
      <TextFieldPrimary
        error={!imageUrlIsValid}
        helperText={
          !imageUrlIsValid &&
          "Can't fetch image from this URL, please try another one."
        }
        variant="outlined"
        label="Image URL"
        value={imageUrl}
        onChange={handleUrlChange}
      />
      <ButtonPrimary
        type="submit"
        variant="contained"
        disabled={image === null}
        onClick={handleSubmit}
        loading={loading}
      >
        Submit
      </ButtonPrimary>
      {image && (
        <Image
          className={styles.imagePreview}
          src={URL.createObjectURL(image)}
          alt="image-preview"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
        />
      )}
      {result && (
        <p>
          {`Result: ${result[0][0]}`}
          <br />
          {`Confidence: ${Math.round(result[0][1])}%`}
        </p>
      )}
    </div>
  );
}
