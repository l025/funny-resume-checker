"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { FileUpload } from "./components/file-upload";
import axios from "axios";
import { annotate, annotationGroup } from "rough-notation";
import gsap from "gsap";

export default function Home() {
  const [file, setFile] = useState();
  const [analyse, setAnalyse] = useState(null);

  useEffect(() => {
    setAnalyse(null);
    if (file) handleAnalyse();
  }, [file]);

  useLayoutEffect(() => {
    // gsap.set(".form", { opacity: 0, y: 10 });
    // gsap.to(".form", {
    //   opacity: 1,
    //   y: 0,
    //   ease: "power2",
    //   duration: 1,
    //   delay: 0.2,
    // });

    const createAnnotation = (selector, type, color) => {
      let list = [];
      document.querySelectorAll(selector).forEach((item) => {
        list.push(annotate(item, { type, color }));
      });
      return list;
    };

    let aList = [
      ...createAnnotation(".a-highlight", "highlight", "#212121"),
      ...createAnnotation(".a-underline", "underline", "#ff80b5"),
      ...createAnnotation(".a-circle", "circle", "#9089fc"),
      ...createAnnotation(".a-bracket", "bracket", "#ff80b5"),
    ];

    const ag = annotationGroup(aList);
    ag.show();
  });
  async function handleAnalyse() {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/analyse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalyse(response?.data?.text);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="bg-white">
      <main>
        <div className="relative isolate">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 bottom-0 -z-10 h-screen w-full stroke-gray-100 [mask-image:radial-gradient(44rem_44rem_at_center,white,white)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg
              x="50%"
              y={-1}
              className="animate-pulse overflow-visible fill-gray-50"
            >
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
          <div
            aria-hidden="true"
            className="absolute left-1/2 right-0 top-0 bottom-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
              className="aspect-[801/1036] w-[50rem] scale-150 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            />
          </div>
          <div className="overflow-hidden">
            <div
              className={`mx-auto min-h-screen px-10 pb-32 transition-all duration-500 ${
                !file ? "pt-48 max-w-7xl" : "pt-12 max-w-auto"
              }`}
            >
              <div className="flex gap-8">
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div
                    className={`relative w-full ${analyse ? "opacity-20" : ""}`}
                  >
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                      Get Your &nbsp;
                      <br />
                      <span className="a-highlight  text-white inline-block px-2 py-0.5">
                        Resume
                      </span>
                      &nbsp;
                      <br /> Roasted by <span className="a-underline">AI</span>!
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 max-w-[50ch]">
                      Curious what an AI thinks of your resume? Our service
                      delivers hilarious, insightful feedback, perfect for
                      laughs and light-hearted reviews. Ready for some{" "}
                      <span className="a-circle">fun</span>?
                      <span className="a-underlines">Try it </span> now!
                    </p>
                  </div>
                  <div className="w-full h-full mt-5 flex flex-col">
                    {/* {file && !analyse && (
                      <div className="mt-2 flex items-center gap-x-6">
                        <button
                          onClick={handleAnalyse}
                          className="rounded-full bg-lime-600 px-5 py-2.5 text-xl font-extralight  text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-lime-600"
                        >
                          Analyse
                        </button>
                      </div>
                    )} */}

                    {file && !analyse && (
                      <div className="p-8">
                        <span class="loader"></span>
                      </div>
                    )}

                    {file && analyse && (
                      <div className="ring-lime-800/10  py-8 text-lg text-gray-900 mr-6 max-w-[40dvw] rtl">
                        {analyse}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form flex-1 flex justify-center items-start pt-3">
                  <FileUpload
                    changeFile={(f) => {
                      setFile(f);
                      setAnalyse(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
