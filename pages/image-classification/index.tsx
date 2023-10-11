"use client";
import React, { useState } from "react";
import styles from "../../styles/ImageClassificationPage.module.css";
import { TextField, Button, Alert, Snackbar } from "@mui/material";
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

const BackButton = styled(Button)({
  minWidth: "0",
  width: "45px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  fontWeight: "bolder",
  fontSize: "18px",
});

type ClassificationResult = [[string, number]] | null;

export default function ImageClassificationPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlIsValid, setImageUrlIsValid] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ClassificationResult>(null);
  const [loading, setLoading] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
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
        setOpenSnackBar(true);
      })
      .catch((err) => {
        console.log(err);
        alert(`Server error! Please wait for a while and try again.`);
        setLoading(false);
      });
  };

  const handleCloseSnackBar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <div className={styles.pageLayout}>
      <BackButton variant="outlined" onClick={() => router.push("/")}>
        &larr;
      </BackButton>
      {/* <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Image Classification</Typography>
      </Breadcrumbs> */}
      <h2>Image Classification</h2>
      <Alert
        severity="warning"
        sx={{ marginBottom: "1rem" }}
      >
        Since it's using the free plan on Azure, if your first attempt fails,
        please try again after 5 minutes. This allows time for the server to get
        ready.
      </Alert>
      This is an image classification tool powered by deep learning
      technologies.
      <br />
      <br />
      For example, try taking a photo of a cat or selecting one from the
      internet, and let AI identify its breed.
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
      <Snackbar
        open={openSnackBar}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="success"
          sx={{ width: "160px" }}
        >
          Succeed
        </Alert>
      </Snackbar>
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
