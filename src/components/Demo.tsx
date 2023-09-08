import { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import {
  CopyCheckIcon,
  CopyIcon,
  CornerDownLeftIcon,
  DeleteIcon,
  Loader2Icon,
  LoaderIcon,
} from "lucide-react";
import { useLazyGetSummaryQuery } from "../services/article";

type Article = {
  url: string;
  summary: string;
};

const Demo = () => {
  const [article, setArticle] = useState<Article>({
    url: "",
    summary: "",
  });

  const [isCopying, setIsCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const articles = localStorage.getItem("articles");

    if (articles) {
      setAllArticles(JSON.parse(articles));
    }
  }, []);

  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!article.url) return;

      if (allArticles.find((item) => item.url === article.url)) {
        const item = allArticles.find((item) => item.url === article.url);
        setArticle(item!);
        return;
      }

      const { data } = await getSummary({
        url: article.url,
        length: 3,
      });

      if (data?.summary) {
        const newArticle = { ...article, summary: data.summary };
        const updatedAllArticles = [newArticle, ...allArticles];
        setArticle(newArticle);
        setAllArticles(updatedAllArticles);
      }

      localStorage.setItem("articles", JSON.stringify(allArticles));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = (item: Article) => {
    setIsCopying(true);
    navigator.clipboard.writeText(item.url);
    setTimeout(() => {
      setIsCopying(false);
    }, 1000);
  };

  const handleDelete = (item: Article) => {
    setIsDeleting(true);
    const updatedAllArticles = allArticles.filter(
      (article) => article.url !== item.url
    );
    setAllArticles(updatedAllArticles);
    localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    setTimeout(() => {
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          onSubmit={handleSubmit}
          className="relative flex justify-center items-center"
        >
          <label htmlFor="input">
            <img
              src={linkIcon}
              alt="link_icon"
              className="absolute left-0 ml-3 w-5 cursor-text transition-all duration-200 ease-in-out top-[50%] translate-y-[-50%]"
            />
          </label>

          <input
            type="url"
            id="input"
            placeholder="Enter URL"
            value={article.url}
            onChange={(e) => {
              setArticle({
                ...article,
                url: e.target.value,
              });
            }}
            required
            className="url_input peer"
          />

          <button className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 group">
            {isFetching ? (
              <Loader2Icon className="w-4 h-4 group-focus:border-gray-700 group-focus:text-gray-700 animate-spin" />
            ) : (
              <CornerDownLeftIcon className="w-4 h-4 group-focus:border-gray-700 group-focus:text-gray-700" />
            )}
          </button>
        </form>

        {/* Browse URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => {
                setArticle(item);
              }}
              className="link_card group hover:border hover:border-zinc-300 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer flex justify-between items-center gap-2 p-2 "
            >
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-100 group-focus:border ">
                {isCopying ? (
                  <Loader2Icon className="w-4 h-4 animate-spin text-zinc-500" />
                ) : (
                  <CopyIcon
                    className="w-4 h-4 z-10 text-zinc-500"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCopy(item);
                    }}
                  />
                )}
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
              {isDeleting ? (
                <Loader2Icon className="w-4 h-4 animate-spin text-zinc-500" />
              ) : (
                <DeleteIcon
                  className="w-4 h-4 z-10 text-zinc-500 hover:text-zinc-700 hover:scale-110 cursor-pointer"
                  onClick={() => {
                    handleDelete(item);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Display Results */}

      <div className="flex mb-10 max-w-full items-center justify-center ">
        {isFetching ? (
          <LoaderIcon className="w-20 h-20 mt-10 animate-spin text-zinc-500" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well that wasn't supposed to happen.
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              Try again?
            </span>
          </p>
        ) : (
          <div className="w-full mt-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-700 font-satoshi">
              {article.summary ? (
                <>
                  Article <span className="blue_gradient">Summary</span>
                </>
              ) : (
                <p>
                  <span className="font-inter font-bold text-black text-center">
                    Enter a URL to get started.
                  </span>
                </p>
              )}
            </h2>
            <div className="mt-2 text-gray-600 summary_box text-sm">
              <p>{article.summary}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
