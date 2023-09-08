import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type SummaryParams = {
  url: string;
  length: number;
}

type Summary = {
  summary: string
}
const rapidApiKey: string = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set("X-RapidAPI-Key", rapidApiKey);
      headers.set(
        "X-RapidAPI-Host",
        "article-extractor-and-summarizer.p.rapidapi.com"
      );

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query<Summary, SummaryParams>({
      query: (params) => `/summarize?url=${encodeURIComponent(params.url)}&length=${params.length}`,
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;