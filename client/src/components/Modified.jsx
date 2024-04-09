import React, { useState } from "react";

export default function Modified() {
  const [selectedModel, setSelectedModel] = useState("");

  const handleCnn = () => {
    // handle CNN model
    alert("cnn");
  };

  const handleSVm = () => {
    // handle SVN model
    alert("svm");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-blue-100 w-full h-screen">
      <form className=" text-xl ">
        <label className="bg-blue-50 p-2 rounded-xl font-semibold">
          Select model :{""}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className=" rounded m-2 bg-gray-500 text-white "
          >
            <option value="braintumorCnn">Brain Tumor CNN</option>
            <option value="braintumorSVn">Brain Tumor SVN</option>
          </select>
        </label>
        <br />
        <button
          onClick={() =>
            selectedModel === "braintumorCnn" ? handleCnn() : handleSVm()
          }
        >
          click me
        </button>
      </form>
    </div>
  );
}
