import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [selectedModel, setSelectedModel] = useState("braintumorCnn");
  const [model, setModel] = useState("CNN");
  const [strike, setstrike] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      // @ts-ignore
      setPreviewSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCnn = async () => {
    const formData = new FormData();
    // @ts-ignore
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/predict",
        formData
      );
      setPrediction(response.data.result);
      console.log(response.data.result, "CNN");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnn = async () => {
    const formData = new FormData();
    // @ts-ignore
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5050/predictann",
        formData
      );
      setPrediction(response.data.result);
      setModel("ANN");
      console.log(response.data.result, "ann");
    } catch (error) {
      console.error(error);
    }
  };

  const f = file?.name.charAt(0);
  const p = prediction?.charAt(0);

  useEffect(() => {
    if (file && prediction) {
      const f = file.name.charAt(0);
      const p = prediction.charAt(0);

      if (f && p && f === p) {
        setstrike(true);
      } else {
        setstrike(false);
      }
    }
  }, [file, prediction]);

  console.log(strike);
  return (
    <div className="flex flex-col items-center justify-center bg-blue-100 w-full h-screen">
      <h1 className="text-4xl mb-6 text-center font-extrabold uppercase animate-none underline">
        Brain tumor Detection
      </h1>
      <label className="bg-blue-50 px-2 rounded-xl mb-4 font-semibold">
        Select model :{""}
        <select
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
          }}
          className=" rounded m-2 bg-gray-500 text-white "
        >
          <option value="braintumorCnn">Brain Tumor CNN</option>
          <option value="braintumorAnn">Brain Tumor ANN</option>
        </select>
      </label>
      <label className="bg-blue-50 px-1 rounded-xl font-semibold">
        Upload image:
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className=" rounded m-2 bg-gray-500 text-white outline-none"
        />
      </label>

      {previewSrc && !prediction && (
        <div role="status" className="relative  left-32 w-[35%] mt-4 ">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="absolute top-0 left-10 text-xl animate-pulse">
            Preprocessing Started...
          </span>
        </div>
      )}
      {previewSrc && (
        <div>
          <img
            src={previewSrc}
            alt="preview"
            width="200"
            className="mt-8 rounded-xl mr-52"
          />
          {previewSrc && prediction && (
            <p className="mt-10  text-center  text-xl animate-bounce font-semibold text-xl bg-emerald-50 px-[10px] py-[3px] rounded-2xl ">
              <span className="animate-pulse">Preprocessing Complete </span>
            </p>
          )}
          <button
            className="py-2 px-4 rounded-full bg-green-200 mt-4 border-2 relative left-[40%]  border-green-400 font-bold"
            onClick={() =>
              selectedModel === "braintumorCnn" ? handleCnn() : handleAnn()
            }
          >
            Predict
          </button>
        </div>
      )}
      {prediction && (
        <p className="py-2 px-4 rounded bg-sky-200 border-2 relative  top-10  border-sky-400 font-bold w-fit uppercase">
          <span className="font-semibold  uppercase">Model :</span>
          {model}
          <br />
          <hr />
          <span className="font-semibold  uppercase">Prediction :</span>
          <span
            className={` ${
              !strike
                ? "line-through font-semibold text-red-500"
                : " text-lime-800 font-extrabold"
            } uppercase`}
          >
            {prediction}
          </span>
        </p>
      )}
    </div>
  );
}
