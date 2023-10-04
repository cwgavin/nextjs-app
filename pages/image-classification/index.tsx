"use client";
import React, { useState } from "react";
import styles from "../../styles/ImageClassificationPage.module.css";
import { TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import { MuiFileInput } from "mui-file-input";
import Image from "next/image";
import { useRouter } from "next/router";

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
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ClassificationResult>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleFileChange = (newFile: File | null) => {
    setResult(null);
    setImageUrl("");
    setFile(newFile);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setFile(null);
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
          setFile(new File([blob], ""));
          setImageUrlIsValid(true);
        })
        .catch(() => {
          setImageUrlIsValid(false);
          setFile(null);
        });
    } else {
      setFile(null);
    }
  };

  const handleSubmit = () => {
    if (!file) return;
    setLoading(true);

    const data = new FormData();
    data.append("file", file);

    fetch("/flask-api/imageClassification", { method: "POST", body: data })
      .then(async (response) => {
        const imageResponse = await response.json();
        console.log(imageResponse);
        setLoading(false);
        setResult(imageResponse["preds"]);
      })
      .catch((err) => {
        console.log(err);
        alert(`Server error! Please wait for a while and try again.`);
        setLoading(false);
      });
  };

  return (
    <div className={styles.pageLayout}>
      <Button
        variant="outlined"
        className={styles.backButton}
        onClick={() => router.push("/")}
      >
        &larr;
      </Button>
      {/* <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Image Classification</Typography>
      </Breadcrumbs> */}
      <h2>Image Classification</h2>
      <p>Upload a local image:</p>
      <MuiFileInput
        className={styles.fileSelector}
        value={file}
        inputProps={{ accept: "image/*" }}
        onChange={handleFileChange}
        placeholder="Local image"
      />
      <p>Or input an online image URL:</p>
      <TextFieldPrimary
        error={imageUrl && !imageUrlIsValid}
        helperText={
          imageUrl &&
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
        disabled={file === null}
        onClick={handleSubmit}
        loading={loading}
      >
        Submit
      </ButtonPrimary>
      {file && (
        <Image
          className={styles.imagePreview}
          src={URL.createObjectURL(file)}
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
