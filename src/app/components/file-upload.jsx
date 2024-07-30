"use client";
import { useEffect, useState } from "react";

export const FileUpload = ({ changeFile }) => {
  const [file, setFile] = useState();
  const [fileEnter, setFileEnter] = useState(false);

  return (
    <div className="container px-4 max-w-5xl mx-auto">
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setFileEnter(true);
          }}
          onDragLeave={(e) => {
            setFileEnter(false);
          }}
          onDragEnd={(e) => {
            e.preventDefault();
            setFileEnter(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setFileEnter(false);
            if (e.dataTransfer.items) {
              [...e.dataTransfer.items].forEach((item, i) => {
                if (item.kind === "file") {
                  const file = item.getAsFile();
                  if (file) {
                    let blobUrl = URL.createObjectURL(file);
                    setFile(blobUrl);
                  }
                  console.log(`items file[${i}].name = ${file?.name}`);
                }
              });
            } else {
              [...e.dataTransfer.files].forEach((file, i) => {
                console.log(`… file[${i}].name = ${file.name}`);
              });
            }
          }}
          className={` ${
            fileEnter ? "border-4 border-lime-600" : "border"
          } rounded-xl bg-white/80 object-cover shadow-lg mx-auto flex flex-col w-96 h-72 border-dashed border-gray-500 hover:border-gray-800 hover:bg-lime-50/30 transition-all duration-300 items-center justify-center cursor-pointer`}
        >
          <label
            htmlFor="file"
            className="h-full flex flex-col justify-center text-center text-lime-800 cursor-pointer"
          >
            Click to upload or drag and drop <br /> your resume
          </label>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={(e) => {
              let files = e.target.files;
              if (files && files[0]) {
                let blobUrl = URL.createObjectURL(files[0]);
                setFile(blobUrl);
                changeFile(files[0]);
              }
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <object
            className="fixed right-0 top-0 bottom-0 w-[50dvw] h-screen bg-gray-900/5 object-cover shadow-lg"
            data={file}
            type="application/pdf"
          />
          <button
            onClick={() => {
              setFile("");
              changeFile(null);
            }}
            className="fixed w-8 h-8 top-1 mr-1 right-[50dvw] uppercase tracking-widest outline-none bg-red-400 hover:bg-red-800 text-white rounded-sm shadow-lg"
          >
            x
          </button>
        </div>
      )}
    </div>
  );
};
